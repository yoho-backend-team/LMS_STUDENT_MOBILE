import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '~/constants';
import Header from '~/components/shared/Header';

// Redux imports
import { getAllNotificationsThunk } from '~/features/notification/reducers/thunks';
import { selectNotifications } from '~/features/notification/reducers/selectors';
import { deleteNotification, updateNotificationStatus } from '~/features/notification/services';
import toast from '~/utils/toasts';
import { formatDateandTime, formatMessageDate } from '~/utils/formatDate';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const dispatch: any = useDispatch();
  const notifications = useSelector(selectNotifications);

  const [filter, setFilter] = useState<'All' | 'Read' | 'Unread'>('All');
  const [searchText, setSearchText] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  // load notifications
  const loadNotifications = () => {
    dispatch(getAllNotificationsThunk({}));
  };

  useEffect(() => {
    loadNotifications();
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getAllNotificationsThunk({}))
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchText]);

  // Filtering
  const filteredNotifications =
    notifications?.filter((n: any) => {
      const matchTab = filter === 'All' ? true : n.status === filter.toLowerCase();
      const matchSearch =
        (n.title?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (n.body?.toLowerCase() || '').includes(searchText.toLowerCase());
      return matchTab && matchSearch;
    }) || [];

  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = filteredNotifications?.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleNotificationPress = async (item: any) => {
    setSelectedNotification(item);
    if (item.status === 'unread') {
      try {
        await updateNotificationStatus({ uuid: item.uuid, status: 'read' });
        loadNotifications();
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification({ uuid: id });
      toast.success('Success', 'Notification deleted successfully!');
      setSelectedNotification(null);
      loadNotifications();
    } catch (error) {
      toast.error('Error', 'Failed to delete notification.');
    }
  };

  // Filter button component
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
      {/* Keep Header if it doesn’t depend on openDrawer */}
      <Header />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.black]}
            tintColor={COLORS.black}
          />
        }>
        {/* Notification Header with Back Button */}
        <View style={styles.notificationHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <ArrowLeft size={22} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.notificationTitle}>Notification</Text>
          </View>
          <Text style={styles.messageCount}>
            {notifications?.length || 0} Message /{' '}
            {notifications?.filter((n: any) => n.status === 'unread').length || 0} Unread
          </Text>
        </View>

        {/* Search */}
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

        {/* Notifications List */}
        <View style={styles.notificationsContainer}>
          {currentNotifications?.length > 0 ? (
            <View style={styles.notificationsList}>
              {currentNotifications.map((item: any) => (
                <TouchableOpacity
                  key={item.uuid}
                  style={styles.notificationCard}
                  onPress={() => handleNotificationPress(item)}>
                  <View style={styles.notificationContent}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.iconText}>{item.status === 'unread' ? '🔔' : '🔕'}</Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.notificationTitleText,
                          item.status === 'read' && { color: '#6B7280' },
                        ]}>
                        {item.title}
                      </Text>
                      <Text style={styles.notificationSubtitle}>{item.body}</Text>
                      <Text style={styles.dateText}>{formatMessageDate(item.createdAt)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notifications found</Text>
            </View>
          )}
        </View>

        {/* Pagination */}
        {filteredNotifications.length > notificationsPerPage && (
          <View style={styles.paginationContainer}>
            <Pressable
              style={[styles.pageButton, currentPage === 1 && styles.disabledPage]}
              onPress={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}>
              <Text style={styles.pageButtonText}>Previous</Text>
            </Pressable>

            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>

            <Pressable
              style={[styles.pageButton, currentPage === totalPages && styles.disabledPage]}
              onPress={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}>
              <Text style={styles.pageButtonText}>Next</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!selectedNotification} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                <Text style={styles.modalDesc}>{selectedNotification.body}</Text>
                <Text style={styles.modalDate}>
                  {formatDateandTime(selectedNotification.createdAt)}
                </Text>
                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.modalBtn, { backgroundColor: '#e5e7eb' }]}
                    onPress={() => setSelectedNotification(null)}>
                    <Text style={{ color: '#000', fontWeight: '600' }}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalBtn, { backgroundColor: '#ef4444' }]}
                    onPress={() => handleDelete(selectedNotification.uuid)}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
  filterButtonDefault: { backgroundColor: 'white', elevation: 2 },
  filterButtonSelected: { backgroundColor: '#9333EA' },
  filterButtonText: { fontWeight: '500', fontSize: 14 },
  filterButtonTextDefault: { color: '#6B7280' },
  filterButtonTextSelected: { color: 'white' },

  todayLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
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
  },
  iconText: { fontSize: 18 },
  textContainer: { flex: 1 },
  notificationTitleText: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  notificationSubtitle: { fontSize: 12, color: '#6B7280', lineHeight: 18 },
  dateText: { fontSize: 12, color: '#9CA3AF', textAlign: 'right', marginTop: 4 },

  emptyState: { padding: 48, alignItems: 'center' },
  emptyStateText: { color: '#6B7280', fontSize: 16 },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#7B00FF',
    borderRadius: 8,
  },
  disabledPage: { backgroundColor: '#9ca3af' },
  pageButtonText: { color: '#fff', fontWeight: '600' },
  pageInfo: { fontWeight: '600', fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalDesc: { fontSize: 14, color: '#374151', marginBottom: 20 },
  modalDate: { marginTop: 8, color: '#6b7280', fontSize: 12, textAlign: 'right' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
});
