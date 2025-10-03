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





const STORAGE_KEYS = {
  QUIZ_SCORES: '@quiz_scores',
  UNLOCKED_SECTIONS: '@unlocked_sections',
  UNLOCKED_CHILDREN: '@unlocked_children',
};

export const StorageService = {
  // Quiz Scores
  async saveQuizScores(scores: { [key: string]: number }): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));
    } catch (error) {
      console.error('Error saving quiz scores:', error);
    }
  },

  async getQuizScores(): Promise<{ [key: string]: number }> {
    try {
      const scores = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
      return scores ? JSON.parse(scores) : {};
    } catch (error) {
      console.error('Error loading quiz scores:', error);
      return {};
    }
  },

  // Unlocked Sections
  async saveUnlockedSections(sections: number[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_SECTIONS, JSON.stringify(sections));
    } catch (error) {
      console.error('Error saving unlocked sections:', error);
    }
  },

  async getUnlockedSections(): Promise<number[]> {
    try {
      const sections = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_SECTIONS);
      return sections ? JSON.parse(sections) : [0];
    } catch (error) {
      console.error('Error loading unlocked sections:', error);
      return [0];
    }
  },

  // Unlocked Children
  async saveUnlockedChildren(children: { [stepIndex: number]: number[] }): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_CHILDREN, JSON.stringify(children));
    } catch (error) {
      console.error('Error saving unlocked children:', error);
    }
  },

  async getUnlockedChildren(): Promise<{ [stepIndex: number]: number[] }> {
    try {
      const children = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_CHILDREN);
      return children ? JSON.parse(children) : { 0: [0] };
    } catch (error) {
      console.error('Error loading unlocked children:', error);
      return { 0: [0] };
    }
  },

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.QUIZ_SCORES,
        STORAGE_KEYS.UNLOCKED_SECTIONS,
        STORAGE_KEYS.UNLOCKED_CHILDREN,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};
