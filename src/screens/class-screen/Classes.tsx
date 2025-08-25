import React, { useState } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { COLORS } from '~/constants';
import Classcards from '~/components/Classes/Onlineclasses';
import ClassById from './ClassById';




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
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2A2A',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
  },
  activeTab: {
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  inactiveTab: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveTabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
  },
});
