import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header'; // Remove if it still uses openDrawer

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<'All' | 'Read' | 'Unread'>('All');
  const [searchText, setSearchText] = useState('');

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Payment Successfully!',
      subtitle: 'Lorem Ipsum is placeholder text commonly used in the graphic',
      icon: '💳',
      isRead: false,
      createdAt: '2025-08-20T10:00:00Z',
    },
    {
      id: '2',
      title: '30% Special Discount!',
      subtitle: 'Lorem Ipsum is placeholder text commonly used in the graphic',
      icon: '🏷️',
      isRead: true,
      createdAt: '2025-08-18T14:30:00Z',
    },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'Read') return item.isRead;
    if (filter === 'Unread') return !item.isRead;
    return true;
  });

  const FilterButton = ({
    option,
    onPress,
    isSelected,
  }: {
    option: 'All' | 'Read' | 'Unread';
    onPress: () => void;
    isSelected: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isSelected ? styles.filterButtonSelected : styles.filterButtonDefault,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.filterButtonText,
          isSelected ? styles.filterButtonTextSelected : styles.filterButtonTextDefault,
        ]}>
        {option}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Remove Header if it depends on openDrawer */}
       <Header /> 

      <ScrollView style={styles.scrollView}>
        {/* Notification Header with Back Button on the left */}
        <View style={styles.notificationHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <ArrowLeft size={22} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.notificationTitle}>Notification</Text>
          </View>
          <Text style={styles.messageCount}>
            {notifications.length} Message / {notifications.filter((n) => !n.isRead).length} Unread
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['All', 'Read', 'Unread'] as const).map((option) => (
            <FilterButton
              key={option}
              option={option}
              onPress={() => setFilter(option)}
              isSelected={filter === option}
            />
          ))}
        </View>

        {/* Today Label */}
        <Text style={styles.todayLabel}>Today</Text>

        {/* Notification List */}
        <View style={styles.notificationsContainer}>
          {filteredNotifications.length > 0 ? (
            <View style={styles.notificationsList}>
              {filteredNotifications.map((item) => (
                <View key={item.id} style={styles.notificationCard}>
                  <View style={styles.notificationContent}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.iconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.notificationTitleText}>{item.title}</Text>
                      <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notifications found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollView: { flex: 1 },

  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationTitle: { fontSize: 18, fontWeight: '600', color: '#374151' },
  messageCount: { fontSize: 14, color: '#6B7280' },

  searchContainer: { paddingHorizontal: 16, marginBottom: 16 },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  filterContainer: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 24 },
  filterButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonDefault: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonSelected: { backgroundColor: '#9333EA' },
  filterButtonText: { fontWeight: '500', fontSize: 14 },
  filterButtonTextDefault: { color: '#6B7280' },
  filterButtonTextSelected: { color: 'white' },

  todayLabel: { fontSize: 14, color: '#6B7280', marginBottom: 16,
      backgroundColor: '#f2f2f2', // light gray background
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8, // rounded corners
    alignSelf: 'flex-start', // shrink to content size
    marginVertical: 10,
   },

  notificationsContainer: { paddingHorizontal: 16, paddingTop: 0 },
  notificationsList: { gap: 12 },
  notificationCard: {
    backgroundColor: '#d5e2f1ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d5e2f1ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconText: { fontSize: 18 },
  textContainer: { flex: 1 },
  notificationTitleText: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  notificationSubtitle: { fontSize: 12, color: '#6B7280', lineHeight: 18 },

  emptyState: { padding: 48, alignItems: 'center' },
  emptyStateText: { color: '#6B7280', fontSize: 16 },
});
