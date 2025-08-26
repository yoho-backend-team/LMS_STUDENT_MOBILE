import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { getClassDetails } from '~/features/classes/reducers/thunks';
import { selectClass } from '~/features/classes/reducers/selector';
import { COLORS } from '~/constants';

const Classcards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const classData = useSelector(selectClass) || [];
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'completed'>('live');
  const scrollRef = useRef<ScrollView>(null);

  const tabs = [
    { key: 'live', label: 'Live Class' },
    { key: 'upcoming', label: 'Upcoming Class' },
    { key: 'completed', label: 'Completed Class' },
  ];
  console.log('Classdata....', classData?.data);

  // Fetch classes from API
  const fetchClassData = (type: 'live' | 'upcoming' | 'completed') => {
    dispatch(
      getClassDetails({
        userType: 'online',
        classType: type,
        page: 1,
        courseId: '67f3b7fcb8d2634300cc87b6',
      })
    );
  };

  useEffect(() => {
    fetchClassData('completed');
  }, []);

  const onTabPress = (key: 'live' | 'upcoming' | 'completed', index: number) => {
    setActiveTab(key);
    scrollRef.current?.scrollTo({ x: index * 120 - 20, animated: true });
    fetchClassData(key);
  };

  const ClassCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Day</Text>
        <Text style={styles.value}>{item.day}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Topic</Text>
        <Text style={styles.value}>
          {item.topic.length > 20 ? item.topic.substring(0, 20) + '...' : item.topic}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Join Link</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
          <Text style={styles.value1}>
            {item.link.length > 20 ? item.link.substring(0, 20) + '...' : item.link}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{item.duration}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Action</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.link)} style={styles.joinButton}>
          <Text style={styles.buttonText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CompletedClassCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>
          {item.Title.length > 20 ? item.Title.substring(0, 20) + '...' : item.Title}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Start Date</Text>
        <Text style={styles.value}>{item.StartDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Start Time</Text>
        <Text style={styles.value}>{item.StartTime}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{item.duration}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Action</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ClassByIdScreen' as never)}
          style={styles.joinButton}>
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Online Classes</Text>

      <View style={styles.wrapper}>
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key as any, index)}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}>
              <Text style={activeTab === tab.key ? styles.activeTabText : styles.tabText}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View>
          {activeTab === 'live' && <Text style={styles.container2}>Live Classes </Text>}
          {activeTab === 'upcoming' && <Text style={styles.container2}>Upcoming Classes </Text>}
          {activeTab === 'completed' && <Text style={styles.container2}>Completed Classes</Text>}
        </View>
      </View>

      <View style={styles.container1}>
        {activeTab !== 'completed' &&
          classData?.data?.map((item: any, index: number) => (
            <ClassCard
              key={index}
              item={{
                day: `Day ${index + 1}`,
                topic: item.class_name,
                link: item.video_url,
                duration: item.duration + ' Min',
              }}
            />
          ))}

        {activeTab === 'completed' &&
          classData?.data?.map((item: any, index: number) => (
            <CompletedClassCard
              key={index}
              item={{
                Title: item.class_name,
                StartDate: new Date(item.start_date).toLocaleDateString(),
                StartTime: new Date(item.start_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                duration: item.duration + ' Min',
              }}
            />
          ))}
      </View>
    </ScrollView>
  );
};

export default Classcards;

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#333' },
  wrapper: { marginBottom: 16 },
  tabContainer: { paddingHorizontal: 0, marginBottom: 10 },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: COLORS.bg_Colour,
    marginHorizontal: 6,
  },
  activeTab: { backgroundColor: '#7B00FF' },
  tabText: { fontSize: 16, color: '#555', fontWeight: '500' },
  activeTabText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  card: {
    backgroundColor: '#E4EBF5',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#ebeff3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#666', fontWeight: '500', fontSize: 14 },
  value: { color: '#222', fontSize: 14 },
  value1: { color: '#3366FF', fontSize: 14, textDecorationLine: 'underline' },
  joinButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ebeff3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: { color: 'black', fontWeight: '500', fontSize: 14 },
  container1: { backgroundColor: '#f1f6fc', padding: 16, borderRadius: 16 },
  container2: { fontSize: 18, borderRadius: 20, padding: 10, fontWeight: '500', color: '#333' },
});
