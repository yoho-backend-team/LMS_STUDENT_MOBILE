import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, icons } from '~/constants';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  TaskCard: { task: any };
};

type Task = {
  id: number;
  instructorname: string;
  task: string;
  taskname: string;
  deadline: string;
  status: 'Completed' | 'Pending';
  question: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'TaskCard'>;

const TaskCard: React.FC<Props> = ({ route, navigation }) => {
  const { task } = route.params;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file.name);
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const isCompleted = task.status === 'Completed';

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Image source={icons.back_arrow} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assessment Page</Text>
          </View>

          <View style={styles.taskCard}>
            <View style={styles.textRow}>
              <Text style={styles.taskText}>Instructor Name</Text>
              <Text style={styles.taskValue}>{task.instructorname}</Text>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.taskText}>Task</Text>
              <Text style={styles.taskValue}>{task.task}</Text>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.taskText}>Task Name</Text>
              <Text style={styles.taskValue}>{task.taskname}</Text>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.taskText}>Deadline</Text>
              <Text style={styles.taskValue}>{task.deadline}</Text>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.taskText}>Doubt</Text>
              <View style={styles.doubtRight}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.doubtText}>{task.question}</Text>

                  {!isCompleted && (
                    <>
                      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                        <Text style={styles.uploadText}>Upload</Text>
                      </TouchableOpacity>

                      <Text
                        style={[
                          styles.fileName,
                          !selectedFile && { color: '#9CA3AF', fontStyle: 'italic' },
                        ]}>
                        {selectedFile ? selectedFile : 'Upload Data'}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.taskText}>Action</Text>
              <View
                style={[
                  styles.statusButton,
                  task.status === 'Completed' ? styles.completed : styles.pending,
                ]}>
                <Text style={styles.statusText}>{task.status}</Text>
              </View>
            </View>

            {!isCompleted && (
              <View style={styles.submitContainer}>
                <TouchableOpacity
                  style={[styles.submitButton, !selectedFile && styles.submitButtonDisabled]}
                  onPress={() => {
                    if (!selectedFile) {
                      Alert.alert('Missing File', 'Please upload a file before submitting.');
                      return;
                    }
                    Alert.alert('Success', 'File uploaded successfully!', [
                      {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                      },
                    ]);
                    console.log('Submitted with file:', selectedFile);
                  }}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  taskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doubtRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doubtText: {
    fontSize: 18,
    color: '#716F6F',
    flexShrink: 1,
    marginRight: 10,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  taskText: { fontSize: 18, color: '#716F6F', width: '35%' },
  taskValue: { fontSize: 18, color: '#716F6F', flex: 1, flexWrap: 'wrap' },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  uploadText: { color: '#fff', marginLeft: 6, fontSize: 14 },
  fileName: { marginTop: 6, fontSize: 14, color: '#374151', marginLeft: 4 },
  statusButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completed: { backgroundColor: '#4ADE80' },
  pending: { backgroundColor: '#9CA3AF' },
  statusText: { color: '#fff', fontWeight: 'bold' },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
