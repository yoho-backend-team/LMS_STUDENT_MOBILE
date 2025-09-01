import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { getClassDetails } from '~/features/classes/reducers/thunks';
import { selectClass } from '~/features/classes/reducers/selector';
import { COLORS, FONTS } from '~/constants';
import { formatDate, formatTime } from '~/utils/formatDate';
import toast from '~/utils/toasts';
import { LinearGradient } from 'expo-linear-gradient';

const Classcards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const classData = useSelector(selectClass) || { data: [] };
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'completed'>('completed');
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = classData?.last_page || 1;
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { key: 'completed', label: 'Completed Class' },
    { key: 'upcoming', label: 'Upcoming Class' },
    { key: 'live', label: 'Live Class' },
  ];

  const fetchClassData = (type: 'live' | 'upcoming' | 'completed', page: number = 1) => {
    dispatch(
      getClassDetails({
        userType: 'online',
        classType: type,
        page: page,
        courseId: '67f3b7fcb8d2634300cc87b6',
      })
    );
  };

  useEffect(() => {
    fetchClassData(activeTab);
  }, [dispatch, activeTab]);

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchClassData(activeTab, 1);
    setRefreshing(false);
  };

  const onTabPress = (key: 'live' | 'upcoming' | 'completed', index: number) => {
    setActiveTab(key);
    scrollRef.current?.scrollTo({ x: index * 120 - 20, animated: true });
    fetchClassData(key);
  };

  const handleOpenLink = (url: string) => {
    if (!url) {
      toast.error('Invalid link', 'No link available for this class.');
      return;
    }
    Linking.openURL(url).catch(() => {
      toast.error('Error', 'Unable to open the link.');
    });
  };

  const ClassCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Topic</Text>
        <Text style={styles.value}>
          {item.topic.length > 20 ? item.topic.substring(0, 20) + '...' : item.topic}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Join Link</Text>
        <TouchableOpacity onPress={() => handleOpenLink(item.link)}>
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
        <TouchableOpacity
          onPress={() => handleOpenLink(item.link)}
          style={[styles.joinButton, { backgroundColor: COLORS.blue_01 }]}>
          <Text style={styles.buttonText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CompletedClassCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        activeTab === 'completed'
          ? navigation.navigate('ClassViewScreen' as never, { classData: item?.classData })
          : null
      }>
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
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>
          {item.StartTime} - {item.EndTime}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{item.duration}</Text>
      </View>
      {activeTab === 'completed' && (
        <View style={styles.row}>
          <Text style={styles.label}>Action</Text>
          <View style={styles.joinButton}>
            <Text style={styles.buttonText}>Completed</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderClasses = () => {
    if (!classData?.data?.length) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No classes available</Text>
        </View>
      );
    }

    if (activeTab === 'live') {
      return classData?.data?.map((item: any, index: number) => (
        <ClassCard
          key={index}
          item={{
            topic: item.class_name,
            link: item.video_url,
            duration: item.duration,
          }}
        />
      ));
    }

    return classData?.data?.map((item: any, index: number) => (
      <CompletedClassCard
        key={index}
        item={{
          Title: item.class_name,
          StartDate: formatDate(item?.start_date),
          StartTime: formatTime(item?.start_time, false),
          EndTime: formatTime(item?.end_time, false),
          duration: item.duration,
          classData: item,
        }}
      />
    ));
  };

  function loadNextPage() {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchClassData(activeTab, nextPage);
    }
  }

  function loadPrevPage() {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchClassData(activeTab, prevPage);
    }
  }

  return (
    <View style={[styles.container, { flex: 1 }]}>
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

        <Text style={styles.sectionTitle}>
          {activeTab === 'live'
            ? 'Live Classes'
            : activeTab === 'upcoming'
            ? 'Upcoming Classes'
            : 'Completed Classes'}
        </Text>
      </View>

      {/* ✅ Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.container1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {renderClasses()}
      </ScrollView>

      {/* ✅ Pagination always pinned at bottom */}
      <View style={styles.pagination}>
        <LinearGradient
          colors={currentPage === 1 ? ['#E0E0E0', '#E0E0E0'] : ['#7B00FF', '#B200FF']}
          start={{ x: 0.134, y: 0.021 }}
          end={{ x: 1, y: 1 }}
          style={styles.pageGradient}>
          <TouchableOpacity
            onPress={loadPrevPage}
            disabled={currentPage === 1}
            style={styles.buttonInner}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>

        <LinearGradient
          colors={currentPage === totalPages ? ['#E0E0E0', '#E0E0E0'] : ['#7B00FF', '#B200FF']}
          start={{ x: 0.134, y: 0.021 }}
          end={{ x: 1, y: 1 }}
          style={styles.pageGradient}>
          <TouchableOpacity
            onPress={loadNextPage}
            disabled={currentPage === totalPages}
            style={styles.buttonInner}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default Classcards;

const styles = StyleSheet.create({
  container: { padding: 5 },
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
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.light_green,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: { color: COLORS.white, fontWeight: '500', fontSize: 14 },
  container1: {
    backgroundColor: '#f1f6fc',
    padding: 16,
    borderRadius: 16,
    minHeight: 300,
    flexGrow: 1,
    justifyContent: 'center',
    
  },
  sectionTitle: { fontSize: 18, fontWeight: '500', color: '#333' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.blue_02,
    // marginTop:50
  },
  pageInfo: {
    fontSize: 14,
    color: COLORS.text_title,
    fontWeight: '500',
    marginTop:30
  },
  pageGradient: {
    borderRadius: 6,
    overflow: 'hidden',
    minWidth: 75,
    marginHorizontal: 1,
    marginTop:30
  },
  buttonInner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
   
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.text_desc,
    ...FONTS.body3,
  },
});
