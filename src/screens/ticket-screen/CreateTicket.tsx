import React, { useState } from 'react';
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
import { COLORS, FONTS, icons } from '~/constants';
import Header from '~/components/shared/Header';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { createticketdata, uploadticketfile } from '~/features/Ticket/Services';
import toast from '~/utils/toasts';

const CreateTicket = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  const [priority, setPriority] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      if (result) {
        setAttachment(result?.assets[0]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      toast.error('Error', 'Failed to pick file');
    }
  };

  const handleSubmit = async () => {
    if (!subject || !description || !category || !priority) {
      toast.error('Error', 'Please fill all required fields');
      return;
    }

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
        branch: '67f3a26ef4b2c530acd16425',
        category: category,
        description: description,
        file: fileUrl,
        institute: '67f3a26df4b2c530acd16419',
        priority: priority,
        query: subject,
        user: '67f3b8feb8d2634300cc8819',
      };

     await createticketdata(ticketData, {});
      toast.success('Success', 'Ticket created successfully');
      navigation.goBack();
    } catch (err) {
      console.error('Ticket creation failed:', err);
      toast.error('Error', 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={icons.back_arrow} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Ticket</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Select Your Problem*</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => {
                setCategory(itemValue);
                const selectedProblem = problemCategories.find((prob) => prob.value === itemValue);
                if (selectedProblem && selectedProblem.value) {
                  setSubject(selectedProblem.label);
                }
              }}
              style={styles.picker}>
              {problemCategories.map((problem) => (
                <Picker.Item key={problem.value} label={problem.label} value={problem.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Query*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your query"
            value={subject}
            onChangeText={setSubject}
            editable={true}
          />

          <Text style={styles.label}>Description*</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Enter detailed description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Priority*</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => setPriority(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select priority" value="" />
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
            </Picker>
          </View>

          <Text style={styles.label}>Attachment</Text>
          <TouchableOpacity style={styles.attachmentButton} onPress={pickFile} disabled={isLoading}>
            <View style={styles.attachmentContent}>
              <Icon name="upload" size={24} color={COLORS.blue_01} />
              <Text style={styles.attachmentText}>
                {attachment ? attachment.name : 'Upload file'}
              </Text>
            </View>
          </TouchableOpacity>

          {attachment && (
            <TouchableOpacity onPress={() => setAttachment(null)} style={styles.removeAttachment}>
              <Text style={styles.removeAttachmentText}>Remove Attachment</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}>
            <Text style={styles.submitText}>{isLoading ? 'Creating...' : 'Create Ticket'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CreateTicket;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d5e2f1ff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 5,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  backButton: { paddingHorizontal: 10, marginTop: 10 },
  formContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#cfdeedff',
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#cfdeedff',
    overflow: 'hidden',
    marginBottom: 15,
  },
  picker: { height: 50, width: '100%' },
  attachmentButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cfdeedff',
    marginTop: 10,
  },
  attachmentContent: { justifyContent: 'center', alignItems: 'center', gap: 5 },
  attachmentText: { ...FONTS.body6, color: COLORS.text_desc, textAlign: 'center' },
  removeAttachment: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  removeAttachmentText: {
    color: COLORS.light_red,
    ...FONTS.h5,
    fontWeight: 500,
  },
  submitButton: {
    marginTop: 30,
     backgroundColor: '#7b00ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
     backgroundColor: '#7b00ff',
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
