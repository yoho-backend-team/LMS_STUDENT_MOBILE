import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { selectClass } from '~/features/classes/reducers/selector';
import { formatDate, formatTime } from '~/utils/formatDate';

const { width } = Dimensions.get('window');

const UpdatesScreen = () => {
  const [activeTab, setActiveTab] = useState('today');
  const classData = useSelector(selectClass) || { data: [] };
  const classes = classData?.data || [];
  const todayString = new Date().toISOString().split('T')[0];

  const todayClasses = useMemo(() => {
    return classes.filter((c: any) => {
      const classDate = new Date(c.start_date).toISOString().split('T')[0];
      return classDate === todayString;
    });
  }, [classes]);

  const lastThreeClasses = useMemo(() => {
    return [...classes]
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()) // newest → oldest
      .slice(0, 3);
  }, [classes]);

  const renderClassCard = (item: any, index: number) => (
    <View key={index} style={styles.card}>
      <View style={styles.row}>
        <Text>Class</Text>
        <Text>
          {item.class_name?.length > 25 ? item.class_name.slice(0, 25) + '...' : item.class_name}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Start Date</Text>
        <Text>{formatDate(item.start_date)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Time</Text>
        <Text>
          {formatTime(item.start_time, false)} - {formatTime(item.end_time, false)}
        </Text>
      </View>
    </View>
  );

  const renderTodayClasses = () => {
    if (!todayClasses.length) {
      return (
        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/home/update.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.noMsg}>No Classes Today</Text>
          <Text style={styles.subText}>Check back later for updates</Text>
        </View>
      );
    }
    return todayClasses.map(renderClassCard);
  };

  const renderPreviousClasses = () => {
    if (!lastThreeClasses.length) {
      return (
        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/home/update.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.noMsg}>No Previous Classes</Text>
          <Text style={styles.subText}>Any updates will appear here when available</Text>
        </View>
      );
    }
    return lastThreeClasses.map(renderClassCard);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Updates</Text>
        <Text style={styles.newMsg}>0 New Messages</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('today')}>
          {activeTab === 'today' ? (
            <LinearGradient colors={['#a259ff', '#7209b7']} style={styles.activeTab}>
              <Text style={styles.activeTabText}>Today</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.inactiveTab}>Today</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('previous')}>
          {activeTab === 'previous' ? (
            <LinearGradient colors={['#a259ff', '#7209b7']} style={styles.activeTab}>
              <Text style={styles.activeTabText}>Previous</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.inactiveTab}>Previous</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {activeTab === 'today' ? renderTodayClasses() : renderPreviousClasses()}
      </ScrollView>
    </View>
  );
};

// styles remain unchanged...
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 40,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  newMsg: {
    fontSize: 16,
    color: '#aaa',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 20,
    gap: 15,
  },
  activeTab: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  inactiveTab: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.5,
    marginBottom: 20,
  },
  noMsg: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});

export default UpdatesScreen;
