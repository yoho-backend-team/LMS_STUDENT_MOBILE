import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';

const PasswordHelp = () => {
  const helpTopics = [
    {
      title: "How to reset your password",
      content: "Go to Settings > Account > Reset Password. Enter your current password, then type a new password that is at least 8 characters long and contains letters and numbers. Confirm to update.",
    },
    {
      title: "Forgot password",
      content: "On the login screen, tap 'Forgot Password'. Enter your registered email address to receive a password reset link. Follow the instructions in the email to reset your password.",
    },
    {
      title: "Change password for security reasons",
      content: "Regularly updating your password helps secure your account. Navigate to Settings > Account > Change Password to update it anytime.",
    },
    {
      title: "Two-Factor Authentication (2FA)",
      content: "Enable 2FA in Settings > Security. This adds an extra layer of protection by requiring a code from your authentication app when logging in.",
    },
    {
      title: "Troubleshoot login issues",
      content: "If you cannot log in, ensure your email and password are correct. Clear app cache, try another device, or contact support at support@example.com.",
    },
  ];

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const toggleTopic = (index: number) => {
    setSelectedTopic(selectedTopic === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Help Centre</Text>

      <ScrollView>
        {helpTopics.map((topic, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              style={styles.topicBox}
              onPress={() => toggleTopic(index)}
            >
              <Text style={styles.topicText}>{topic.title}</Text>
              <Image
                source={
                  selectedTopic === index
                    ? require('../../assets/helpcenter/sub.png')
                    : require('../../assets/helpcenter/add.png')
                }
                style={styles.icon}
              />
            </TouchableOpacity>

            {selectedTopic === index && (
              <View style={styles.contentBox}>
                <Text style={styles.contentText}>{topic.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PasswordHelp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111',
  },
  topicBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
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
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  contentBox: {
    marginTop: 8,
    backgroundColor: '#EDEFF2',
    padding: 12,
    borderRadius: 10,
  },
  contentText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
