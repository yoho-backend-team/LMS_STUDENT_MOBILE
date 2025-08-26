import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';

const PaymentHelp =  ({ searchQuery }: { searchQuery: string })  => {
  const helpTopics = [
    {
      title: "How to add a payment method?",
      content: "Navigate to Settings > Billing > Add Payment Method. Enter your card or UPI details securely and confirm to save it. You can add multiple payment options for convenience.",
    },
    {
      title: "Failed transaction",
      content: "If your payment fails, check your card/UPI details, available balance, and internet connection. Try again or use an alternative method. For repeated issues, contact support at support@example.com.",
    },
    {
      title: "Refund status",
      content: "Go to Settings > Billing > Refunds to track your refund requests. Refunds usually take 5-7 business days depending on your bank or payment provider.",
    },
    {
      title: "Update billing information",
      content: "To keep your billing info up-to-date, go to Settings > Billing > Edit Billing Info. Update your card, address, or other relevant details and save changes.",
    },
    {
      title: "View payment history",
      content: "You can see all your past transactions in Settings > Billing > Payment History. This includes successful payments, failed attempts, and refunded transactions.",
    },
  ];

const filteredTopics = helpTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const toggleTopic = (index: number) => {
    setSelectedTopic(selectedTopic === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Help Centre</Text>

      <ScrollView>
        {filteredTopics.map((topic, index) => (
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

export default PaymentHelp;

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
