import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';

const LoginHelp = () => {
  const helpTopics = [
    {
      title: "How to login?",
      content: "Enter your registered email and password to log in. Make sure your account is verified before attempting to log in.",
    },
    {
      title: "Forgot Password",
      content: "Click 'Forgot Password' on the login screen. Enter your registered email to receive a password reset link and follow the instructions.",
    },
    {
      title: "Two-Factor Authentication",
      content: "Enable 2FA in your account settings to add an extra layer of security. You will need to enter a code from your authenticator app when logging in.",
    },
    {
      title: "Account Locked",
      content: "After multiple failed login attempts, your account may be temporarily locked. Contact support at support@example.com to unlock your account.",
    },
    {
      title: "Change Username",
      content: "You can change your username in account settings. Some restrictions may apply, such as length or uniqueness.",
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

export default LoginHelp;

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
    justifyContent: 'space-between', // text left, icon right
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
