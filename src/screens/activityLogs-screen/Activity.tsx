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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getAllActivityData } from '~/features/Activity/reducer/ActivityThunk';
import { ActivitySelector } from '~/features/Activity/reducer/ActivitySelector';
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

const Activity = () => {
  const dispatch = useDispatch<any>();
  const logs = useSelector(ActivitySelector); 

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

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

  const paginatedLogs = logs.slice(
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
          <Ionicons name="arrow-back-outline" size={22} color="black" />
          <Text style={styles.header}>Activity Log</Text>
          <Ionicons name="menu" size={22} color="black" />
        </View>
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
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  header: { fontSize: 18, fontWeight: '600', color: COLORS.text_title },
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
