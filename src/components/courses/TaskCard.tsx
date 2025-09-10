import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, icons } from '~/constants';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import toast from '~/utils/toasts';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDateMonthandYear } from '~/utils/formatDate';
import { uploadticketfile } from '~/features/Ticket/Services';
import { updatetaskdata } from '~/features/Courses/Services';
import { getFileUrl } from '~/utils/imageUtils';
import { TrendingUpDown } from 'lucide-react-native';

type RootStackParamList = {
  TaskCard: { task: any };
};

type Task = {
  _id: string;
  task_name: string;
  deadline: string;
  status: 'pending' | 'completed';
  instructor: {
    _id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    qualification: string;
    contact_info: {
      phone_number: string;
      alternate_phone_number: string;
      address1: string;
      address2: string;
      pincode: number;
    };
  };
  question: string;
  answer_file: string | null;
  mark: number | null;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'TaskCard'>;

const TaskCard: React.FC<Props> = ({ route, navigation }) => {
  const { task } = route.params;
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
      }
    } catch (error) {
      console.log('Error picking document:', error);
      toast.error('Error', 'Failed to select file');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Missing File', 'Please upload a file before submitting.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'application/octet-stream',
      } as any);

      const uploadRes = await uploadticketfile(formData);

      if (uploadRes) {
        toast.success('Success', 'File uploaded successfully!');
        const taskUpdateData = {
          taskid: task._id,
          file: getFileUrl(uploadRes?.data?.data?.file),
          is_active: true,
          submittedAt: new Date().toISOString(),
        };

        const response = await updatetaskdata(taskUpdateData);
        if (response) {
          toast.success('Task Updated', 'Your task has been updated successfully.');
          navigation.goBack();
        }
      } else {
        const errorMessage = uploadRes || 'Failed to upload file';
        toast.error('Upload Failed', errorMessage);
      }
    } catch (error: any) {
      console.log('Error uploading file:', error);
      const errorMessage = error.message || 'Failed to upload file';
      toast.error('Error', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const isCompleted = task?.is_active === true ? true : false;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assessment Page</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.taskCard}>
              <View style={styles.textColumn}>
                <Text style={styles.taskLabel}>Instructor Name</Text>
                <Text style={styles.taskValue}>
                  {task?.instructor?.full_name?.substring(0, 15) || 'N/A'}
                </Text>
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.taskLabel}>Type</Text>
                <Text style={styles.taskValue}>{task?.task_type?.substring(0, 15) || 'N/A'}</Text>
              </View>

              <View style={styles.textColumn}>
                <Text style={styles.taskLabel}>Task Name</Text>
                <Text style={styles.taskValue}>{task?.task_name || 'N/A'}</Text>
              </View>

              <View style={styles.textColumn}>
                <Text style={styles.taskLabel}>Deadline</Text>
                <Text style={styles.taskValue}>
                  {formatDateMonthandYear(task?.deadline) || 'N/A'}
                </Text>
              </View>

              <View style={styles.textColumn}>
                <Text style={styles.taskLabel}>Question</Text>
                <View style={styles.questionBox}>
                  <Text style={styles.questionText}>
                    {task?.question || 'No question provided'}
                  </Text>
                </View>

                {!isCompleted && (
                  <>
                    <TouchableOpacity
                      onPress={pickDocument}
                      style={{ borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' }}
                      disabled={isUploading}>
                      <LinearGradient
                        colors={['#7B00FF', '#B200FF']}
                        start={{ x: 0.134, y: 0.021 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.uploadButtonGradient}>
                        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                        <Text style={styles.uploadText}>Upload</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <Text
                      style={[
                        styles.fileName,
                        !selectedFile && { color: '#9CA3AF', fontStyle: 'italic' },
                      ]}>
                      {selectedFile ? selectedFile.name : 'No file selected'}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.textColumn}>
                <Text style={styles.taskLabel}>Status</Text>
                <View style={styles.taskValueBox}>
                  <View
                    style={[
                      styles.statusButtonInsideBox,
                      isCompleted ? styles.completedStatus : styles.pendingStatus,
                    ]}>
                    <Text style={styles.statusTextInside}>
                      {isCompleted ? 'Completed' : 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.textColumn}>
                <Text style={styles.taskLabel}>Score</Text>
                <Text style={styles.taskValue}>
                  {task?.mark !== null && task?.mark !== undefined
                    ? `${task?.mark} / 10`
                    : 'Not graded yet'}
                </Text>
              </View>

              {task?.remark && (
                <View style={styles.textColumn}>
                  <Text style={styles.taskLabel}>Instructor Remark</Text>
                  <View style={styles.questionBox}>
                    <Text style={styles.questionText}>{task?.remark}</Text>
                  </View>
                </View>
              )}

              {isCompleted && task?.answer_file && (
                <View style={styles.textColumn}>
                  <Text style={styles.taskLabel}>Submitted File</Text>
                  <View style={styles.viewNotesBox}>
                    <Text style={styles.notesText}>{task?.answer_file}</Text>
                    <TouchableOpacity
                      style={{ borderRadius: 8, marginLeft: 10 }}
                      onPress={() => {
                        Alert.alert('View File', 'Opening submitted file...');
                        // Here you would typically open the file
                      }}>
                      <LinearGradient
                        colors={['#7B00FF', '#B200FF']}
                        start={{ x: 0.134, y: 0.021 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.uploadButtonGradient}>
                        <Text style={styles.uploadText}>View</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {!isCompleted && (
                <View style={styles.submitContainers}>
                  <TouchableOpacity
                    style={[styles.cancelButton]}
                    onPress={() => navigation.goBack()}
                    disabled={isUploading}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={!selectedFile || isUploading}
                    onPress={handleSubmit}
                    style={{ flex: 1, borderRadius: 8 }}>
                    <LinearGradient
                      colors={
                        selectedFile && !isUploading
                          ? ['#7B00FF', '#B200FF']
                          : ['#9CA3AF', '#9CA3AF']
                      }
                      start={{ x: 0.134, y: 0.021 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.submitButtonGradient}>
                      <Text style={styles.submitText}>
                        {isUploading ? 'Uploading...' : 'Submit'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backbutton: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    marginTop: 5,
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    gap: 5,
  },
  textColumn: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  taskLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskValue: {
    fontSize: 16,
    color: '##6B7280',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  uploadText: { color: '#fff', marginLeft: 6, fontSize: 14 },
  fileName: { marginTop: 6, fontSize: 14, color: '#374151', marginLeft: 4 },
  taskValueBox: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
    alignSelf: 'stretch',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusButtonInsideBox: {
    paddingVertical: 8,
    borderRadius: 6,
    width: '35%',
    alignItems: 'center',
  },
  completedStatus: {
    backgroundColor: '#4ADE80',
  },
  pendingStatus: {
    backgroundColor: '#9CA3AF',
  },
  statusTextInside: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  submitButtonGradient: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionBox: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
  },
  questionText: {
    fontSize: 16,
    color: '#6B7280',
  },
  viewNotesBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
  },
  notesText: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
});
