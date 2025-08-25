import React, { useState } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { COLORS } from '~/constants';
import Classcards from '~/components/Classes/Onlineclasses';
import ClassById from './ClassById';
import Header from '~/components/shared/Header'




function Classes() {
  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        {/* code inside the view section*/}
        <View>
     <Classcards />
        </View>
      </SafeAreaView>
    </>
  );
}

export default Classes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
});