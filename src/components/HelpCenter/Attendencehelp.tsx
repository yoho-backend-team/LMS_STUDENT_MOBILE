import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';

const AttendanceHelp = () => {
  const helpTopics = [
    {
      title: "How to Mark Attendance",
      content: "Go to the Attendance section and select the class. Mark attendance for the students present.",
    },
    {
      title: "View Daily/Monthly Attendance",
      content: "You can view daily or monthly attendance reports in the Attendance dashboard.",
    },
    {
      title: "Fix Missing Attendance Records",
      content: "Report missing attendance to the admin or update records if you have the necessary permissions.",
    },
    {
      title: "Late Marking or Absence Issues",
      content: "Late or absent marks can be adjusted by authorized staff in the Attendance settings.",
    },
    {
      title: "Download Attendance Report",
      content: "Export attendance reports in CSV or PDF format from the Attendance section for your records.",
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
              {/* Show add or sub icon based on selectedTopic */}
              <Image
                source={
                  selectedTopic === index
                    ? require('../../assets/helpcenter/sub.png')
                    : require('../../assets/helpcenter/add.png')
                }
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* Only show content for the selected topic */}
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

export default AttendanceHelp;

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
    justifyContent: 'space-between', // ensures text and icon are on opposite sides
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
    flex: 1, // allows text to take available space
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
