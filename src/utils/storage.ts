// storage.ts
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save Student info
export const saveStudentData = async (token: string, user: any) => {
  await SecureStore.setItemAsync('AuthStudentToken', token);
  await AsyncStorage.setItem('StudentData', JSON.stringify(user));
};

// Get Student profile
export const getStudentData = async () => {
  const userStr = await AsyncStorage.getItem('StudentData');
  return userStr ? JSON.parse(userStr) : null;
};

// Get token
export const getStudentToken = async () => {
  return await SecureStore.getItemAsync('AuthStudentToken');
};

// Logout (clear storage)
export const clearStudentData = async () => {
  await SecureStore.deleteItemAsync('AuthStudentToken');
  await AsyncStorage.removeItem('StudentData');
};
