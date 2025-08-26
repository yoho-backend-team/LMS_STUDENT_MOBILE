import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';  
import { LinearGradient } from 'expo-linear-gradient';


const classInfoData = [
  { label: 'Date', value: '9 Apr 2025' },
  { label: 'Start At', value: '9:30 AM' },
  { label: 'End At', value: '6:00 PM' },
  { label: 'Duration', value: '6 Mon Hrs' },
];

// const [showVideo, setShowVideo] = useState(false);
//  // Function to handle back button press when video is playing
//   const handleBackPress = () => {
//     if (showVideo) {
//       setShowVideo(false);
//     } else {
//       navigation.goBack();
//     }
//   };

const CompleteClassDetails = () => (
  <ScrollView contentContainerStyle={styles.screen}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#444" />
      </TouchableOpacity>

      {/* Back Button
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Image
                  source={require('../../assets/courses/arrow.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity> */}
      <Text style={styles.title}>Class Details</Text>
    </View>

    <View style={styles.container1}>
      <Text style={styles.batchTitle}>Batch No : #13</Text>
      <Text style={styles.title}>The Path Of MERN Stack</Text>
      <Text style={styles.description}>
        The MERN stack is a collection of technologies for building web applications using JavaScript.
        It's made up of MongoDB, Express.js, React, and Node.js. Mern is a popular, Pre-build,
        and versatile technologu stack.
      </Text>

      <View style={styles.container1}>
        <LinearGradient
          colors={['#7B00FF', '#B200FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          {classInfoData.map((item, index) => (
            <View key={index} style={styles.column}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </LinearGradient>
      </View>

      <Text style={styles.linkLabel}>Class Meeting Link</Text>
      <Text style={styles.subText}>Join The Class @9:30 AM</Text>
      <TouchableOpacity style={styles.joinButton} onPress={() => {/* linking code here */ }}>
        <Text style={styles.joinText}>Join Now</Text>
      </TouchableOpacity>
      <Text style={styles.notesubTitle}>Make sure your presence in this class & if you are unable to attend, plase inform the Coordinator.</Text>

      <TouchableOpacity style={styles.notesCard1} onPress={() => {/* linking code here */ }}>
        <Text style={styles.noteText}>Check Attendance</Text>
      </TouchableOpacity>
      <Text style={styles.notesubTitle}>If any issue in attendance please raise a ticket</Text>

      <Text style={styles.noteTitle}>Session Notes</Text>
      <TouchableOpacity style={styles.notesCard1} onPress={() => {/* linking code here */ }}>
        <Text style={styles.noteText}>Once Class Finished Videos will be Uploaded</Text>
     </TouchableOpacity>
    </View>

    <View style={styles.container2}>
      <Text style={styles.noteTitle}>Study Materials</Text>
     <TouchableOpacity style={styles.notesCard1} onPress={() => {/* linking code here */ }}>
        <Text style={styles.noteText}>Once Class Finished Study Materials Videos will be Uploaded</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>

);

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#EBF0F5',
  },
  batchTitle: {
    color: '#7B00FF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#EBF0F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  linkLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B00FF',
    marginBottom: 24,
    marginTop: 8,
  },
  subText: {
    fontSize: 17,
    color: '#333',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  joinButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#7B00FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 6,
    shadowColor: '#7B00FF',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  joinText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noteTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  notesubTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  notesCard1: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,

    backgroundColor: '#EBF0F5',
    borderRadius: 14,
    padding: 16,
    // Inset shadow to mimic “inner” effect
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  notesCard: {
    backgroundColor: '#EBF0F5',
    borderRadius: 16,
    padding: 16,
    // Inset shadow to mimic “inner” effect
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,

  },
  noteText: {
    fontSize: 14,
    color: '#666',
  },
  container1: {
    flex: 1,
    backgroundColor: '#d9e8f5ff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#3b3030ff',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  container2: {
    flex: 1,
    backgroundColor: '#d9e8f5ff',
    padding: 16,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: '#3b3030ff',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#edf2f7', 
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    margin: 1,
  },
});

export default CompleteClassDetails;
