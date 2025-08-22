import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React from 'react';

const PayementHelp = () => {
  const helpTopics = [
    "How to add a payment method?",
    "Failed Transaction",
    "Refund Status",
    "Update Billing Info",
    "View Payment History",
  ];

  return (
    <View style={styles.container}>
          {/* Section Title */}
      <Text style={styles.sectionTitle}>Help Centre</Text>

      {/* Help Topics */}
      {helpTopics.map((topic, index) => (
        <TouchableOpacity key={index} style={styles.topicBox}>
          <Text style={styles.topicText}>{topic}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PayementHelp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8FAFC', // light background
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111',
  },
  topicBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  topicText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
});
