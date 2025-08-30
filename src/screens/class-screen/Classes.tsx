import React, { useState } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { COLORS } from '~/constants';
import Classcards from '~/components/Classes/Onlineclasses';
import ClassById from './ClassById';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header';

function Classes() {
  const navigation = useNavigation<any>();

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        {/* code inside the view section*/}
        <View>
          <Classcards />
        </View>
        <TouchableOpacity
          style={styles.chatbotBtn}
          onPress={() => navigation.navigate('ChatbotScreen')}>
          <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

export default Classes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
  chatbotBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#7B00FF',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
