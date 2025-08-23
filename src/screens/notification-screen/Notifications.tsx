'use client';

import { useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, icons } from '~/constants';
import Header from '~/components/shared/Header';

const Notifications = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Payment Successfully!',
      desc: 'Your payment has been processed successfully.',
      status: 'read',
    },
    {
      id: '2',
      title: '30% Special Discount!',
      desc: 'Grab your discount before it expires.',
      status: 'unread',
    },
    {
      id: '3',
      title: 'New Message',
      desc: "You've received a new message from support.",
      status: 'unread',
    },
  ]);

  const filteredNotifications = notifications.filter((n) => {
    const matchTab = activeTab === 'All' ? true : n.status === activeTab.toLowerCase();
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.desc.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleNotificationPress = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n)));
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation.goBack()}>
              <Image
                source={icons.back_arrow}
                style={{ width: 25, height: 25, marginRight: 15 }}
                resizeMode="contain"
              />
            </Pressable>
            <Text style={styles.headerTitle}>Notification</Text>
          </View>
          <Text style={styles.headerCount}>
            {notifications.length} Message /{' '}
            {notifications.filter((n) => n.status === 'unread').length} Unread
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, styles.neumorphicBox]}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabWrapper}>
          {['All', 'Read', 'Unread'].map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              {activeTab === tab ? (
                <LinearGradient
                  colors={['#7B00FF', '#9333ea']}
                  style={[styles.activeTab, styles.innerShadow]}>
                  <Text style={styles.activeTabText}>{tab}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.inactiveTab, styles.neumorphicBox, styles.innerShadow]}>
                  <Text style={styles.inactiveTabText}>{tab}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Notifications List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Today</Text>

          {filteredNotifications.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#6b7280' }}>No notifications found</Text>
          ) : (
            filteredNotifications.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleNotificationPress(item.id)}
                style={[styles.card, styles.neumorphicCard]}>
                <View style={[styles.iconWrapper, styles.neumorphicCard]}>
                  {/* icon can go here */}
                </View>
                <View style={styles.cardContent}>
                  <Text style={[item.status === 'unread' ? styles.unreadTitle : styles.readTitle]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.cardDesc, item.status === 'read' && styles.readDesc]}>
                    {item.desc}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  headerCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  searchWrapper: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#374151',
  },
  tabWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
    justifyContent: 'space-between',
  },
  activeTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    height: 60, // Fixed height
    minWidth: 100, // Minimum width
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Equal width for all tabs
    marginHorizontal: 4, //
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  inactiveTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    minWidth: 100,
  },
  inactiveTabText: {
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  unreadTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  readTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280', // Gray color for read messages
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: '#000',
  },
  readDesc: {
    color: '#6b7280', // Gray color for read message descriptions
  },
  neumorphicBox: {
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  neumorphicCard: {
    shadowColor: '#000',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  innerShadow: {
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
