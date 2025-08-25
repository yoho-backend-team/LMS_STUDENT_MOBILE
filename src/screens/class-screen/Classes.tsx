import React, { useState } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { COLORS } from '~/constants';

const { width } = Dimensions.get('window');

const Classes = () => {
  const [activeTab, setActiveTab] = useState('task');

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.screen}>
        
        {/* Header */}
        <Text style={styles.headerTitle}>Learning Path</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('task')} style={{ flex: 1 }}>
            {activeTab === 'task' ? (
              <LinearGradient colors={['#a259ff', '#7209b7']} style={styles.activeTab}>
                <Text style={styles.activeTabText}>Task & Projects</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTab}>
                <Text style={styles.inactiveTabText}>Task & Projects</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('course')} style={{ flex: 1 }}>
            {activeTab === 'course' ? (
              <LinearGradient colors={['#a259ff', '#7209b7']} style={styles.activeTab}>
                <Text style={styles.activeTabText}>Course Track</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTab}>
                <Text style={styles.inactiveTabText}>Course Track</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>English Mastery Challenge</Text>
          <Text style={styles.cardSubtitle}>
            Classic Style Grammar And Speaking Practice
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

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
