import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { createticketdata, uploadticketfile } from '~/features/Ticket/Services/index';
import toast from '~/utils/toasts';
import { LinearGradient } from 'expo-linear-gradient';
import { getStudentData } from '~/utils/storage';

const CreateTicket = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  const [priority, setPriority] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const data = await getStudentData();
      setStudent(data);
    })();
  }, []);

  const problemCategories = [
    { label: 'Select your problem', value: '' },
    { label: 'Attendance Issue', value: 'attendance' },
    { label: 'Grade Issue', value: 'grade' },
    { label: 'Course Material', value: 'material' },
    { label: 'Technical Support', value: 'technical' },
    { label: 'Feedback', value: 'feedback' },
    { label: 'Assignment Submission', value: 'assignment' },
    { label: 'Others', value: 'other' },
  ];

  const pickFile = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
      });

      if (result && result.assets && result.assets[0]) {
        setAttachment(result.assets[0]);
      }
    } catch (error) {
      console.log('Error picking file:', error);
      toast.error('Error', 'Invalid file format');
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!category) newErrors.category = 'Please select a problem category.';
    if (!subject.trim()) newErrors.subject = 'Please enter a query or subject.';
    if (!description.trim()) newErrors.description = 'Please enter a detailed description.';
    if (!priority) newErrors.priority = 'Please select a priority level.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsLoading(true);

    try {
      let fileUrl: string | null = null;

      if (attachment) {
        try {
          const formData = new FormData();
          formData.append('file', {
            uri: attachment.uri,
            name: attachment.name,
            type: attachment.mimeType || 'application/octet-stream',
          } as any);

          const uploadRes = await uploadticketfile(formData);
          fileUrl = uploadRes?.data?.data?.file;
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          toast.error('Error', 'File upload failed. Creating ticket without attachment.');
        }
      }

      const ticketData = {
        branch: student?.branch_id?._id,
        category,
        description,
        file: fileUrl,
        institute: student?.institute_id?._id,
        priority,
        query: subject,
        user: student?._id,
      };

      const response = await createticketdata(ticketData, {});
      if (response) {
        toast.success('Success', 'Ticket created successfully');
        navigation.goBack();
      } else {
        toast.error('Error', 'Failed to create ticket');
      }
    } catch (err) {
      console.error('Ticket creation failed:', err);
      toast.error('Error', 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const isImage = attachment?.mimeType?.includes('image');

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Ticket</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}>
          {/* Category */}
          <Text style={styles.label}>Select Your Problem*</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => {
                setCategory(itemValue);
                setErrors((prev) => ({ ...prev, category: '' }));
                const selectedProblem = problemCategories.find((prob) => prob.value === itemValue);
                if (selectedProblem && selectedProblem.value) setSubject(selectedProblem.label);
              }}
              style={styles.picker}>
              {problemCategories.map((problem) => (
                <Picker.Item key={problem.value} label={problem.label} value={problem.value} />
              ))}
            </Picker>
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

          {/* Subject */}
          <Text style={styles.label}>Query*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your query"
            value={subject}
            onChangeText={(text) => {
              setSubject(text);
              setErrors((prev) => ({ ...prev, subject: '' }));
            }}
            editable={true}
          />
          {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}

          {/* Description */}
          <Text style={styles.label}>Description*</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Enter detailed description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
            multiline
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

          {/* Priority */}
          <Text style={styles.label}>Priority*</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => {
                setPriority(itemValue);
                setErrors((prev) => ({ ...prev, priority: '' }));
              }}
              style={styles.picker}>
              <Picker.Item label="Select priority" value="" />
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
            </Picker>
          </View>
          {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}

          {/* Attachment */}
          <Text style={styles.label}>Attachment</Text>
          <TouchableOpacity style={styles.attachmentButton} onPress={pickFile} disabled={isLoading}>
            <View style={styles.attachmentContent}>
              <Icon name="upload" size={24} color={COLORS.blue_01} />
              <Text style={styles.attachmentText}>
                {attachment ? attachment.name : 'Upload file'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Image Preview */}
          {isImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: attachment.uri }} style={styles.imagePreview} />
            </View>
          )}

          {/* Remove Attachment */}
          {attachment && (
            <TouchableOpacity onPress={() => setAttachment(null)} style={styles.removeAttachment}>
              <Text style={styles.removeAttachmentText}>Remove Attachment</Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <LinearGradient
            colors={['#7B00FF', '#B200FF']}
            start={{ x: 0.134, y: 0.021 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientButton, isLoading && styles.submitButtonDisabled]}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}>
              <Text style={styles.submitText}>{isLoading ? 'Creating...' : 'Create Ticket'}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CreateTicket;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 5,
    marginVertical: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  backButton: { paddingHorizontal: 10, marginTop: 10 },
  formContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  backbutton: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    marginTop: 5,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: { height: 55, width: '100%' },
  attachmentButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginTop: 10,
  },
  attachmentContent: { justifyContent: 'center', alignItems: 'center', gap: 5 },
  attachmentText: { ...FONTS.body6, color: COLORS.text_desc, textAlign: 'center' },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  removeAttachment: { marginTop: 10, alignSelf: 'flex-end' },
  removeAttachmentText: {
    color: COLORS.light_red,
    ...FONTS.h5,
    fontWeight: '500',
  },
  gradientButton: {
    marginTop: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: COLORS.shadow_01 },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 5,
  },
});
