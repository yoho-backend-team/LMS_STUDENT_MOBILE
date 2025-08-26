import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { getClassDetails } from '~/features/classes/reducers/thunks';
import { selectClass } from '~/features/classes/reducers/selector';



const Classcards = () => {
  const dispatch = useDispatch<AppDispatch>();
    const classData = useSelector(selectClass)?.data || [];

      
  


  const fetchClassData = () => {
   
    dispatch(
      getClassDetails({
        // courseId: '67f3b7fcb8d2634300cc87b6',
        userType: 'online',
        classType: 'completed',
        page: 1,
      })
    );
  };

  useEffect(() => {

    fetchClassData();
  }, []);

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'completed'>('live');
  const scrollRef = useRef<ScrollView>(null);

  const ClassCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Day</Text>
        <Text style={styles.value}>{item.day}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Topic</Text>
        <Text style={styles.value}>{item.topic}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Join Link</Text>
        <TouchableOpacity >
          <Text style={styles.value1}>{item.link}</Text>
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
        <Text style={styles.value}>{item.Title}</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('ClassByIdScreen' as never)} style={styles.joinButton}>
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  const tabs = [
    { key: 'live', label: 'Live Class' },
    { key: 'upcoming', label: 'Upcoming Class' },
    { key: 'completed', label: 'Completed Class' },
  ];

  const liveClasses = [
    { day: 'Day 1', topic: 'HTML', link: 'www.google.com/url', duration: '45 Min' },
    { day: 'Day 2', topic: 'HTML', link: 'www.google.com/url', duration: '45 Min' },
    { day: 'Day 3', topic: 'HTML', link: 'www.google.com/url', duration: '45 Min' },
    { day: 'Day 4', topic: 'HTML', link: 'www.google.com/url', duration: '45 Min' },
  ];
  const upcomingClasses = [''
    // { day: 'Day 2', topic: 'CSS', link: 'https://www.example.com', duration: '60 Min' },
  ];

  const completeClasses = [
    { Title: 'HTML, CSS Basic', StartDate: '12-06-2025', StartTime: '09:00 AM', duration: '45 Min' },
    { Title: 'HTML, CSS Basic', StartDate: '12-06-2025', StartTime: '09:00 AM', duration: '45 Min' },
    { Title: 'HTML, CSS Basic', StartDate: '12-06-2025', StartTime: '09:00 AM', duration: '45 Min' },
    { Title: 'HTML, CSS Basic', StartDate: '12-06-2025', StartTime: '09:00 AM', duration: '45 Min' },
  ];

  const onTabPress = (key: 'live' | 'upcoming' | 'completed', index: number) => {
    setActiveTab(key);
    scrollRef.current?.scrollTo({ x: index * 120 - 20, animated: true });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Online Classes</Text>

      <View style={styles.wrapper}>
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab, index) => (
            
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key, index)}
              style={[styles.tab, { width: 140 }, activeTab === tab.key && styles.activeTab]}
            >
              <Text style={activeTab === tab.key ? styles.activeTabText : styles.tabText}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View >
          {activeTab === 'live' && <Text style={styles.container2}> Classes </Text>}
          {activeTab === 'upcoming' && <Text style={styles.containerupclass}> Classes </Text>}
          {activeTab === 'completed' && <Text style={styles.container2}>Completed  </Text>}
        </View>
      </View>

      <View style={styles.container1}>
        {activeTab === 'live' && liveClasses.map((item, index) => (
          <ClassCard key={index} item={item} />
        ))}

        {activeTab === 'upcoming' && upcomingClasses.map((item, index) => (''
          // <ClassCard key={index} item={item} />
        ))}

        {activeTab === 'completed' && completeClasses.map((item, index) => (
          <CompletedClassCard key={index} item={item} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Classcards;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  wrapper: {
    marginBottom: 16,
  },
  tabContainer: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#E6ECF3',
    marginHorizontal: 6,
    
  },
  activeTab: {
    backgroundColor: '#7B00FF',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  value: {
    color: '#222',
    fontSize: 14,
  },
  value1: {
    color: '#3366FF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  joinButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ebeff3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  },
  container1: {
    backgroundColor: '#f1f6fc',
    padding: 16,
    borderRadius: 16,
  },
  container2: {
    fontSize: 18,
    borderRadius: 20,
    padding: 10,
    fontWeight: '500',
    color: '#333',
  },
  containerupclass: {
    fontSize: 18,
    borderRadius: 20,
    padding: 10,
    height: 600,
    fontWeight: '500',
    color: '#333',
  },
});
