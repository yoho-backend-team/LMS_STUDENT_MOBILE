import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS, screens } from '~/constants';
import { formatDate, formatTime } from '~/utils/formatDate';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { AppDispatch } from '~/store/store';
import { selectIdClass } from '~/features/classid/reducers/selector';
import { getClassIdDetail } from '~/features/classid/reducers/thunks';

const ClassDetails: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { classData: routeClassData } = route?.params || {};

  const dispatch = useDispatch<AppDispatch>();
  const classIdData = useSelector(selectIdClass);

  // Prefer API data, fallback to route data
  const classData = classIdData || routeClassData;

  useEffect(() => {
    if (routeClassData?.uuid) {
      dispatch(
        getClassIdDetail({
          id: routeClassData?.uuid,
          course: routeClassData?.course_uuid || '',
          classType: 'online',
        })
      );
    }
  }, [routeClassData, dispatch]);

  const classInfoData = [
    { label: 'Date', value: classData?.start_date ? formatDate(classData?.start_date) : '-' },
    { label: 'Start At', value: classData?.start_time ? formatTime(classData?.start_time, false) : '-' },
    { label: 'End At', value: classData?.end_time ? formatTime(classData?.end_time, false) : '-' },
    { label: 'Duration', value: classData?.duration || '-' },
  ];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.screen}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('~/assets/profile/back.png')} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.title}>{classData?.class_name || 'Class Details'}</Text>
          </View>

          {/* Batch + Info */}
          <View style={styles.section}>
            <Text style={styles.batchTitle}>Batch No : #{classData?.batch?.id || '-'}</Text>

            <LinearGradient
              colors={['#7B00FF', '#B200FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.card}>
              {classInfoData.map((item, index) => (
                <View key={index} style={styles.column}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              ))}
            </LinearGradient>

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

            <Text style={styles.noteTitle}>Session Notes</Text>
            <TouchableOpacity
              style={styles.notesCard1}
              onPress={() => Linking.openURL('https://your-notes-link.com')}>
              <Text style={styles.noteText}>Once Class Finished Videos will be Uploaded</Text>
            </TouchableOpacity>
          </View>

          {/* Study Materials */}
          <View style={styles.section}>
            <Text style={styles.noteTitle}>Study Materials</Text>
            <TouchableOpacity
              style={styles.notesCard1}
              onPress={() => Linking.openURL('https://your-materials-link.com')}>
              <Text style={styles.noteText}>
                Once Class Finished Study Materials will be Uploaded
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ClassDetails;

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  screen: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    color: '#333',
  },
  batchTitle: {
    color: '#7B00FF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
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
  noteTitle: {
    fontSize: 16,
    color: COLORS.text_title,
    marginBottom: 8,
    fontWeight: '600',
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
    fontWeight: '500',
  },
});
