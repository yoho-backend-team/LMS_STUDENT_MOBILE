import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';



const Classcards = () => {
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
        <TouchableOpacity onPress={() => navigation.navigate('ClassByIdScreen' as never)}>
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
        <TouchableOpacity onPress={() => Linking.openURL(item.link)} style={styles.joinButton}>
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
  container: { padding: 10, backgroundColor: '#dfe9f3ff' },
  container4: { padding: 16, backgroundColor: '#f2f2f2', height: 860 },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 15, color: '#333' },
  wrapper: { flex: 1, padding: 6, backgroundColor: '#dfe9f3ff' },
  tabContainer: { paddingHorizontal: 0, marginBottom: 5 },
  tab: {
    flex: 1,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    borderRadius: 6,

    backgroundColor: '#E4EBF5',
    alignItems: 'center',
    marginHorizontal: 4,

    shadowColor: '#a02d2dff',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,

  },

  activeTab: { backgroundColor: '#7B00FF' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '400' },
  activeTabText: { fontSize: 16, color: '#ffffffff', fontWeight: '600', },

  card: {
    backgroundColor: '#cfdeedff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3b3030ff',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#716F6F', fontSize: 14 },
    value1: { color: '#5d62f3ff', fontSize: 14 },
  value: { color: '#716F6F', fontSize: 14 },

  joinButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#dae1e8ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    shadowColor: '#a02d2dff',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: { color: '#4f3636ff', fontSize: 14, fontWeight: '500' },
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
    fontSize: 18,
    borderRadius: 20,
    padding: 10,
    fontWeight: '500',
  },
  containerupclass: {
    fontSize: 18,
    borderRadius: 20,
    padding: 10,
    height:600,
    fontWeight: '500',
  },
  activeTabGradient: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
