import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

// --- Slice + Reducer ---
const ActivitySlice = createSlice({
  name: 'ActivitySlice',
  initialState: { data: [] },
  reducers: {
    setActivity: (state, action) => {
      state.data = action.payload;
    },
  },
});
const { setActivity } = ActivitySlice.actions;

// --- Store ---
const store = configureStore({
  reducer: { ActivitySlice: ActivitySlice.reducer },
});

// --- Mock API function (replace with your Client.student.activity.get) ---
const getActivityData = async () => {
  return Promise.resolve({
    data: [
      { id: '1', title: 'Login', email: 'john@example.com', timestamp: '2025-09-01T09:00:00' },
      { id: '2', title: 'Logout', email: 'john@example.com', timestamp: '2025-09-01T10:00:00' },
      { id: '3', title: 'Update Profile', email: 'john@example.com', timestamp: '2025-09-01T11:30:00' },
    ],
  });
};

// --- Component ---
const ActivityComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const logs = useSelector((state: any) => state.ActivitySlice.data);

  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);

  const pageSize = 5;
  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  const loadData = async () => {
    const response = await getActivityData();
    dispatch(setActivity(response.data));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const applyFilter = () => {
    if (!fromDate || !toDate) {
      setFilteredLogs(logs);
      setShowFilterForm(false);
      return;
    }
    const from = new Date(fromDate.split('-').reverse().join('-'));
    const to = new Date(toDate.split('-').reverse().join('-'));
    const result = logs.filter((log: any) => {
      const logDate = new Date(log.timestamp);
      return logDate >= from && logDate <= to;
    });
    setFilteredLogs(result);
    setCurrentPage(1);
    setShowFilterForm(false);
  };

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      <StatusBar backgroundColor="#f2f6fa" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={22} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Activity Log</Text>
          <TouchableOpacity onPress={() => setShowFilterForm(!showFilterForm)}>
            <Ionicons name="menu-outline" size={26} color="black" />
          </TouchableOpacity>
        </View>

        {showFilterForm && (
          <View style={styles.filterBox}>
            <TextInput
              style={styles.input}
              placeholder="From Date (DD-MM-YYYY)"
              value={fromDate}
              onChangeText={setFromDate}
            />
            <TextInput
              style={styles.input}
              placeholder="To Date (DD-MM-YYYY)"
              value={toDate}
              onChangeText={setToDate}
            />
            <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={paginatedLogs}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No logs found</Text>}
        />

        {filteredLogs.length > 0 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}
              onPress={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Text style={styles.pageText}>Prev</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.pageBtn, currentPage === totalPages && styles.disabledBtn]}
              onPress={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.pageText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

// --- Wrap with Provider ---
export default function AppWrapper() {
  return (
    <Provider store={store}>
      <ActivityComponent />
    </Provider>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f6fa', paddingHorizontal: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  header: { fontSize: 18, fontWeight: '600', color: '#111827' },
  filterBox: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  applyBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', marginBottom: 24 },
  timeline: { width: 30, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#16a34a', zIndex: 1 },
  line: { position: 'absolute', top: 14, bottom: 0, width: 2, backgroundColor: '#16a34a' },
  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: '500', marginBottom: 6, color: '#111827' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  email: { fontSize: 12, color: '#16a34a', marginBottom: 6 },
  date: { fontSize: 11, color: '#6b7280', textAlign: 'right' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },
  pageBtn: {
    padding: 10,
    backgroundColor: '#2563eb',
    borderRadius: 5,
    width: '25%',
  },
  disabledBtn: { backgroundColor: '#6b7280' },
  pageText: { color: '#fff', textAlign: 'center', fontWeight: '500' },
  pageInfo: { fontSize: 14, color: '#111827' },
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 50 },
});
