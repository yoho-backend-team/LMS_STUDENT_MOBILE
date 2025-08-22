import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '~/constants';
import Header from '~/components/shared/Header';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CreateTicketComponent = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  const [priority, setPriority] = useState('');

  const pickDocument = async () => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (docRes && docRes.assets && docRes.assets.length > 0) {
        setAttachment(docRes.assets[0]);
      }
    } catch (error: any) {
      console.log('Error while selecting the file:', error.message);
    }
  };

  const handleSubmit = () => {
    if (!subject || !description) {
      alert('Please fill all required fields');
      return;
    }

    console.log({ subject, description, category, attachment, priority });
    alert('Ticket created successfully!');
    navigation.goBack();
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
            <Image />
          </TouchableOpacity>
          <Text style={styles.title}>Create Ticket Screen</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Select Your Problem</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ticket subject"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Query</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter category (e.g., Support, Billing)"
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Enter detailed description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Priority Dropdown */}
          <Text style={styles.label}>Priority</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue: any) => setPriority(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select value" />
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
            </Picker>
          </View>

          <Text style={styles.label}>Attachment</Text>
          <TouchableOpacity style={styles.attachmentButton} onPress={pickDocument}>
            <View style={styles.attachmentContent}>
              <Icon name="upload" size={24} color="#2B00FF" />
              <Text style={styles.attachmentText}>
                {attachment ? attachment.name : 'Upload file'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Create Ticket</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CreateTicketComponent;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    gap: 20,
  },

  title: { fontSize: 20, fontWeight: 'bold', flex: 1 },

  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2B00FF',
    borderRadius: 8,
  },

  backText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  formContainer: { padding: 20 },

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

  attachmentContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5, // space between icon and text
  },

  attachmentText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center', // center text
  },

  submitButton: {
    marginTop: 30,
    backgroundColor: '#2B00FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
