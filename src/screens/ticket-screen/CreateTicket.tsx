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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '~/constants';
import Header from '~/components/shared/Header';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { CreateTicketThunks } from '../../features/Ticket/reducers/Thunks'; 
import { createticketdata, uploadticketfile } from '~/features/Ticket/Services';

const CreateTicket = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  const [priority, setPriority] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // allow jpg, png, pdf
      });

      console.log("resu",result);

      if (result) {
        setAttachment(result?.assets[0]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!subject || !description || !category || !priority) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      let fileUrl: string | null = null;

      // Upload file if attachment exists
      console.log("attahc",attachment);
      if (attachment) {
        try {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('file', {
            uri: attachment.uri,
            name: attachment.name,
            type: attachment.mimeType || "application/octet-stream",
          } as any);

          const uploadRes = await uploadticketfile(formData);
          console.log(uploadRes,"up");
          fileUrl = uploadRes?.data?.data?.file 
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          Alert.alert("Error", "File upload failed. Creating ticket without attachment.");
        }
      }

      // Build payload
      const ticketData = {
        branch: "67f3a26ef4b2c530acd16425",
        category: category,
        description: description,
        file: fileUrl, // This should be the URL returned from the upload
        institute: "67f3a26df4b2c530acd16419",
        priority: priority,
        query: subject,
        user: "67f3b8feb8d2634300cc8819",
      };

      console.log("Ticket Payload:", ticketData);

      // Create ticket
      const response = await createticketdata(ticketData, {});
      console.log("Ticket created:", response);
      
      Alert.alert("Success", "Ticket created successfully");
      navigation.goBack();
    } catch (err) {
      console.error("Ticket creation failed:", err);
      Alert.alert("Error", "Failed to create ticket");
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
          <TextInput
            style={styles.input}
            placeholder="Enter ticket subject"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Category*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter category (e.g., grade, support)"
            value={category}
            onChangeText={setCategory}
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
              onValueChange={(itemValue: any) => setPriority(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select Priority" value="" />
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
            disabled={isLoading}
          >
            <Text style={styles.submitText}>
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Text>
          </TouchableOpacity>
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
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  backButton: { paddingHorizontal: 10, marginTop: 10 },
  formContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, marginTop: 15 },
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
  picker: { height: 50, width: '100%' },
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
  attachmentText: { fontSize: 16, color: '#333', textAlign: 'center' },
  removeAttachment: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  removeAttachmentText: {
    color: COLORS.red,
    fontSize: 14,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: COLORS.blue_01,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});