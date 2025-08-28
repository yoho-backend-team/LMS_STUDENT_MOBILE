import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, screens } from '~/constants';
import { formatDate, formatTime } from '~/utils/formatDate';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';

interface ClassDataProps {
  classData: any;
}

const CompleteClassDetails: React.FC<ClassDataProps> = ({ classData }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  const classInfoData = [
    { label: 'Date', value: formatDate(classData?.start_date) },
    { label: 'Start At', value: formatTime(classData?.start_time, false) },
    { label: 'End At', value: formatTime(classData?.end_time, false) },
    { label: 'Duration', value: classData?.duration },
  ];

  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
          </TouchableOpacity>
          <Text style={styles.title}>{classData?.class_name}</Text>
        </View>

        <View style={styles.container1}>
          <Text style={styles.batchTitle}>Batch No : #{classData?.batch?.id}</Text>

          <View style={{}}>
            <LinearGradient
              colors={['#7B00FF', '#B200FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.card}>
              {classInfoData?.map((item, index) => (
                <View key={index} style={styles.column}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              ))}
            </LinearGradient>
          </View>

          <Text style={styles.notesubTitle}>
            Make sure your presence in this class & if you are unable to attend, please inform the
            Coordinator.
          </Text>

          <TouchableOpacity
            style={styles.notesCard}
            onPress={() => {
              navigation.goBack();
              dispatch(setSelectedTab(screens.attendance));
            }}>
            <Text style={styles.noteText1}>Check Attendance</Text>
          </TouchableOpacity>
          <Text style={styles.notesubTitle}>If any issue in attendance please raise a ticket</Text>
          <View style={{ marginTop: 5 }}></View>
          <Text style={styles.noteTitle}>Session Notes</Text>
          <TouchableOpacity
            style={styles.notesCard1}
            onPress={() => {
              Linking.openURL('https://your-notes-link.com');
            }}>
            <Text style={styles.noteText}>Once Class Finished Videos will be Uploaded</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container2}>
          <Text style={styles.noteTitle}>Study Materials</Text>
          <TouchableOpacity
            style={styles.notesCard1}
            onPress={() => {
              Linking.openURL('https://your-materials-link.com');
            }}>
            <Text style={styles.noteText}>
              Once Class Finished Study Materials Videos will be Uploaded
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
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
    color: COLORS.text_title,
    marginBottom: 8,
    fontWeight: 600,
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
    backgroundColor: COLORS.light_blue,
    alignSelf: 'flex-start',
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
    color: COLORS.text_title,
  },
  noteText1: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: 500,
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
    marginVertical: 5,
    backgroundColor: COLORS.white,
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
