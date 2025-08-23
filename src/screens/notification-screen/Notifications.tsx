import { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, icons } from '~/constants';
import Header from '~/components/shared/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotificationsThunk } from '~/features/notification/reducers/thunks';
import { selectNotifications } from '~/features/notification/reducers/selectors';
import { deleteNotification, updateNotificationStatus } from '~/features/notification/services';
import toast from '~/utils/toasts';


const Notifications = () => {
  const navigation = useNavigation();
  const dispatch: any = useDispatch();

  
  const notifications = useSelector(selectNotifications);

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  useEffect(() => {
    dispatch(getAllNotificationsThunk({})); 
  }, [dispatch]);

console.log(notifications,'notification')

  const filteredNotifications = notifications.filter((n: any) => {
    const matchTab = activeTab === 'All' ? true : n.status === activeTab.toLowerCase();
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.desc.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleNotificationPress = async (item: any) => {
 
  setSelectedNotification(item);

  
  if (item.status === "unread") {
    try {
      await updateNotificationStatus({
        uuid: item.uuid,
        status: "read",
      });

     
      dispatch(getAllNotificationsThunk({}));
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  }
};
console.log(handleNotificationPress,'updated status ')

  const handleDelete = async (id: string) => {
  try {
    const response = await deleteNotification({ uuid: id });
    console.log(response, "Response from delete notification");

    toast.success("Success", "Notification deleted successfully!"
    );

  
    setSelectedNotification(null);

    
    dispatch(getAllNotificationsThunk({}));
  } catch (error) {
    console.error( "Error deleting notification:", error);
    toast.error("error","Failed to delete notification.", 
    
  );
  }
};
console.log (handleDelete,'delete notification')


  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        {/* Header */}
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
            {notifications.filter((n: any) => n.status === 'unread').length} Unread
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
            filteredNotifications.map((item: any) => (
              <Pressable
                key={item.uuid}
                onPress={() => handleNotificationPress(item)}
                style={[styles.card, styles.neumorphicCard]}>
                <View style={[styles.iconWrapper, styles.neumorphicCard]}>
                  <Text>🔔</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[item.status === 'unread' ? styles.unreadTitle : styles.readTitle]}>
                    {item.title}
                  </Text>
                   <Text style={[styles.cardDesc, item.status === 'read' && styles.readDesc]}>
        {item.body}  
      </Text>
                </View>
              </Pressable>
            ))
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

          {/* ✅ Show Date & Time */}
          <Text style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>
            {new Date(selectedNotification.createdAt).toLocaleString()}
          </Text>
                  <View style={styles.modalActions}>
                    <Pressable
                      style={[styles.modalBtn, { backgroundColor: '#e5e7eb' }]}
                      onPress={() => setSelectedNotification(null)}>
                      <Text style={{ color: '#000' }}>Close</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.modalBtn, { backgroundColor: '#ef4444' }]}
                      onPress={() => handleDelete(selectedNotification.uuid)}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}>🗑 Delete</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
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
    gap: 5,
    justifyContent: 'space-between',
  },
  activeTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    height: 60,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
  inactiveTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
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
    color: '#6b7280',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: '#000',
  },
  readDesc: {
    color: '#6b7280',
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
    height:'50%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
     marginTop: 30,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
