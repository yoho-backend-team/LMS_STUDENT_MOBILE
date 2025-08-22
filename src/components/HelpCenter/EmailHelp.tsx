import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';

const EmailHelp = () => {
  const helpTopics = [
    {
      title: "How to verify your email?",
      content: "After signing up, check your inbox at example@email.com. Open the email from 'Support Team' and click the 'Verify Email' button to activate your account.",
    },
    {
      title: "Didn’t receive verification code",
      content: "If you haven’t received a verification code, ensure your inbox and spam folder are checked. You can also tap 'Resend Code' in the app to get a new verification email.",
    },
    {
      title: "Update registered email address",
      content: "Go to Settings > Account Info > Email. Enter your new email address, verify it through the confirmation email, and your account will be updated.",
    },
    {
      title: "Troubleshoot email notifications",
      content: "Ensure push notifications are allowed in your device settings. Also, check your email provider’s spam/junk folder to make sure our emails aren’t being filtered.",
    },
    {
      title: "Whitelist our domain",
      content: "Add '@support.example.com' to your email whitelist to ensure you receive all important notifications without delays.",
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

export default EmailHelp;

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
