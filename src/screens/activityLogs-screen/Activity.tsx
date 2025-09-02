import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getAllActivityData } from '~/features/Activity/reducer/ActivityThunk';
import { ActivitySelector } from '~/features/Activity/reducer/ActivitySelector';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const COLORS = {
  bg_Colour: '#f2f6fa',
  white: '#ffffff',
  green_text: '#16a34a',
  text_title: '#111827',
  text_desc: '#6b7280',
  blue_01: '#2563eb',
  blue_02: '#cbd5e1',
};

const formatDateandTime = (ts: string) => {
  const d = new Date(ts);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB');
};

const Activity = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const { logs = [] } = useSelector(ActivitySelector); // ✅ safe destructure

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 States for date filter
  const [filterVisible, setFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'from' | 'to'>('from');

  const pageSize = 3;
  const totalPages = Math.ceil(logs.length / pageSize);

  useEffect(() => {
    dispatch(getAllActivityData({}));
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllActivityData({}));
    setRefreshing(false);
  };

  const loadNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const loadPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const resetFilter = () => {
    setFromDate(null);
    setToDate(null);
  };

  // 🔹 Apply filter if dates are selected
  const filteredLogs = logs.filter((item: any) => {
    const itemDate = new Date(item.timestamp);
    if (fromDate && itemDate < fromDate) return false;
    if (toDate && itemDate > toDate) return false;
    return true;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View style={styles.dot} />
        <View style={styles.line} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.card}>
          <Text style={styles.email}>Successfully {item.email}</Text>
          <Text style={styles.date}>{formatDateandTime(item.timestamp)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.bg_Colour} barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/profile/back.png')}
              style={styles.backbutton}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Activity Log</Text>

          {/* Filter toggle */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterVisible(!filterVisible)}>
            <Ionicons name="filter" size={24} color={COLORS.text_title} />
          </TouchableOpacity>
        </View>

        {/* Date filter section */}
        {filterVisible && (
          <View style={styles.dateFilter}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                setPickerMode('from');
                setShowPicker(true);
              }}>
              <Text style={styles.dateText}>
                {fromDate ? formatDate(fromDate) : 'From : DD-MM-YYYY'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                setPickerMode('to');
                setShowPicker(true);
              }}>
              <Text style={styles.dateText}>
                {toDate ? formatDate(toDate) : 'To : DD-MM-YYYY'}
              </Text>
            </TouchableOpacity>

            {(fromDate || toDate) && (
              <TouchableOpacity onPress={resetFilter} style={styles.resetBtn}>
                <Ionicons name="refresh" size={18} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Date Picker */}
        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                if (pickerMode === 'from') setFromDate(selectedDate);
                else setToDate(selectedDate);
              }
            }}
          />
        )}

        <FlatList
          data={paginatedLogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No activity logs found</Text>
            </View>
          }
        />

        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={loadPrevPage}
            disabled={currentPage === 1}
            style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}>
            <Text style={styles.pageText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Page {currentPage} of {totalPages || 1}
          </Text>

          <TouchableOpacity
            onPress={loadNextPage}
            disabled={currentPage === totalPages || logs.length === 0}
            style={[
              styles.pageBtn,
              (currentPage === totalPages || logs.length === 0) &&
                styles.disabledBtn,
            ]}>
            <Text style={styles.pageText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Activity;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg_Colour, paddingHorizontal: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'space-between',
  },
  header: { fontSize: 22, fontWeight: '600', color: COLORS.text_title },
  filterBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    elevation: 3,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dateInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  dateText: { fontSize: 14, color: COLORS.text_title, textAlign: 'center' },
  resetBtn: {
    padding: 10,
    backgroundColor: COLORS.blue_01,
    borderRadius: 8,
    marginLeft: 8,
  },
  row: { flexDirection: 'row', marginBottom: 24 },
  timeline: { width: 30, alignItems: 'center' },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.green_text,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 14,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.green_text,
  },
  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: '500', marginBottom: 6, color: COLORS.text_title },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  email: { fontSize: 12, color: COLORS.green_text, marginBottom: 6 },
  date: { fontSize: 11, color: COLORS.text_desc, textAlign: 'right' },
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
  disabledBtn: { backgroundColor: COLORS.text_desc },
  pageText: { color: COLORS.white, textAlign: 'center', fontWeight: '500' },
  pageInfo: { fontSize: 14, color: COLORS.text_title },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 185 },
  emptyText: { fontSize: 16, color: COLORS.text_desc, textAlign: 'center' },
});
