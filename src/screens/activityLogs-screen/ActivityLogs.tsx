import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS, FONTS, icons } from '~/constants';
import { formatDateandTime, formatDate } from '~/utils/formatDate';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllActivityData } from '~/features/reducer/activitylog/reducers/Thunks';
import { ActivitySelector } from '~/features/reducer/activitylog/reducers/Selector';

type Log = {
  id: string;
  message: string;
  email: string;
  date: string;
  title: string;
  user: any;
  timestamp: any;
};

const ActivityLogs = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'from' | 'to'>('from');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const toggleFilter = () => setFilterVisible((prev) => !prev);
  const dispatch = useDispatch<any>();
  const getActivtiy = useSelector(ActivitySelector);
  const totalPages = getActivtiy?.pagination?.totalPages || 1;
  const allData = getActivtiy?.data || [];

  useEffect(() => {
    dispatch(getAllActivityData({ page: currentPage }));
  }, [currentPage]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getAllActivityData({ page: currentPage })).then(() => {
      setRefreshing(false);
    });
  };

  const handleConfirm = (date: Date) => {
    const dateWithoutTime = new Date(date);
    dateWithoutTime.setHours(0, 0, 0, 0);

    if (pickerMode === 'from') {
      setFromDate(dateWithoutTime);
    } else {
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      setToDate(endOfDay);
    }
    setShowPicker(false);
  };

  const resetFilter = () => {
    setFromDate(null);
    setToDate(null);
  };

  const loadNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const loadPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredLogs = allData.filter((log: any) => {
    if (!fromDate && !toDate) return true;

    const logDate = new Date(log.timestamp);

    if (fromDate && toDate) {
      return logDate >= fromDate && logDate <= toDate;
    } else if (fromDate) {
      return logDate >= fromDate;
    } else if (toDate) {
      return logDate <= toDate;
    }

    return true;
  });

  const renderItem = ({ item }: { item: Log }) => {
    return (
      <View style={styles.logContainer}>
        <Image source={icons.barLine} style={styles.barLine} />
        <View style={styles.timelineRow}>
          <View style={styles.timeline}>
            <Image source={icons.greenCircle} style={styles.dot} />
          </View>
          <View style={{ flex: 1 }}>
            <View>
              <Text style={styles.message}>{item.title}</Text>
            </View>
            <View style={styles.logCard}>
              <Text style={styles.email}>{item.user?.email}</Text>
              <Text style={styles.time}>{formatDateandTime(item.timestamp)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        <View style={styles.container1}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={icons.back_arrow} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
            <Text style={styles.header}>Activity Log</Text>
          </View>

          {/* Filter toggle */}
          <TouchableOpacity style={styles.filterBtn} onPress={toggleFilter}>
            <Image source={icons.filter} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>

          {/* Date filter section */}
          {filterVisible && (
            <View style={styles.dateFilter}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setPickerMode('from');
                  setShowPicker(true);
                }}>
                <Text style={{ ...FONTS.h5, fontWeight: 500, textAlign: 'center' }}>
                  {fromDate ? formatDate(fromDate) : 'From Date: DD-MM-YYYY'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setPickerMode('to');
                  setShowPicker(true);
                }}>
                <Text style={{ ...FONTS.h5, fontWeight: 500, textAlign: 'center' }}>
                  {toDate ? formatDate(toDate) : 'To Date: DD-MM-YYYY'}
                </Text>
              </TouchableOpacity>

              {(fromDate || toDate) && (
                <TouchableOpacity onPress={resetFilter} style={styles.resetBtn}>
                  <Ionicons name="refresh" size={18} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Logs list */}
          <FlatList
            data={filteredLogs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {fromDate || toDate
                    ? 'No logs found for the selected date range'
                    : 'No activity logs found'}
                </Text>
              </View>
            }
          />

          {/* Pagination controls */}
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={loadPrevPage}
              disabled={currentPage === 1}
              style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}>
              <Text style={styles.pageText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              onPress={loadNextPage}
              disabled={currentPage === totalPages}
              style={[styles.pageBtn, currentPage === totalPages && styles.disabledBtn]}>
              <Text style={styles.pageText}>Next</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal */}
          <DateTimePickerModal
            isVisible={showPicker}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setShowPicker(false)}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ActivityLogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: COLORS.bg_Colour,
  },
  container1: { flex: 1, padding: 15 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  header: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 8,
    paddingVertical: 10,
    marginRight: 8,
    flex: 1,
  },
  resetBtn: {
    padding: 5,
    backgroundColor: COLORS.text_desc,
    borderRadius: 50,
  },
  logContainer: { marginBottom: 20 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 15 },
  timeline: {
    width: 20,
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 45,
    height: 35,
    borderRadius: 50,
    marginTop: -7,
  },
  barLine: {
    width: 35,
    position: 'absolute',
    zIndex: -1,
    left: -2,
    top: -550,
  },
  logCard: {
    backgroundColor: COLORS.bg_Colour,
    padding: 10,
    borderRadius: 12,
    flex: 1,
    elevation: 5,
  },
  message: { fontWeight: 'bold', marginBottom: 8, color: COLORS.text_title },
  email: { fontSize: 12, color: COLORS.green_text, marginBottom: 5 },
  time: { fontSize: 10, color: COLORS.text_desc, textAlign: 'right' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.blue_02,
  },
  pageBtn: {
    padding: 10,
    backgroundColor: COLORS.blue_01,
    borderRadius: 5,
    width: '25%',
  },
  disabledBtn: {
    backgroundColor: COLORS.text_desc,
  },
  pageText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 500,
  },
  pageInfo: {
    fontSize: 14,
    color: COLORS.text_title,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 185,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text_desc,
    textAlign: 'center',
  },
});
