import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import { formatDateandTime } from '~/utils/formatDate';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Log = {
  id: string;
  message: string;
  email: string;
  date: string; // ISO format
};

const logsData: Log[] = [
  {
    id: '1',
    message: 'Dashboard Logout Successfully',
    email: 'Musk@Gmail.Com',
    date: '2025-06-25T09:40:00',
  },
  {
    id: '2',
    message: 'Dashboard Logout Successfully',
    email: 'Musk@Gmail.Com',
    date: '2025-06-25T09:40:00',
  },
  {
    id: '3',
    message: 'Dashboard Logout Successfully',
    email: 'Musk@Gmail.Com',
    date: '2025-06-25T09:40:00',
  },
  {
    id: '4',
    message: 'Dashboard Logout Successfully',
    email: 'Musk@Gmail.Com',
    date: '2025-06-25T09:40:00',
  },
];

const ActivityLogs = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'from' | 'to'>('from');

  const toggleFilter = () => setFilterVisible((prev) => !prev);

  const handleConfirm = (date: Date) => {
    if (pickerMode === 'from') {
      setFromDate(date);
    } else {
      setToDate(date);
    }
    setShowPicker(false);
  };

  const resetFilter = () => {
    setFromDate(null);
    setToDate(null);
  };

  const filteredLogs = logsData.filter((log) => {
    const logDate: any = new Date(log.date);
    if (fromDate && logDate < fromDate) return false;
    if (toDate && logDate > toDate) return false;
    return true;
  });

  const renderItem = ({ item }: { item: Log }) => {
    const logDate: any = new Date(item.date);
    return (
      <View style={styles.logContainer}>
        <Text style={styles.logDate}>{formatDateandTime(logDate)}</Text>
        <View style={styles.timelineRow}>
          <View style={styles.timeline}>
            <View style={styles.dot} />
          </View>
          <View style={styles.logCard}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.email}>Dashboard Logout Successfully {item.email}</Text>
            <Text style={styles.time}>{formatDateandTime(logDate)}</Text>
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
        {/* code inside the view section*/}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.header}>Activity Log</Text>
          </View>

          {/* Filter toggle */}
          <TouchableOpacity style={styles.filterBtn} onPress={toggleFilter}>
            <Ionicons name="filter" size={20} color="black" />
            <Text style={{ marginLeft: 6 }}>Filter</Text>
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
                <Text>{fromDate ? formatDateandTime(fromDate) : 'From Date'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setPickerMode('to');
                  setShowPicker(true);
                }}>
                <Text>{toDate ? formatDateandTime(toDate) : 'To Date'}</Text>
              </TouchableOpacity>
              {(fromDate || toDate) && (
                <TouchableOpacity onPress={resetFilter}>
                  <Ionicons name="refresh" size={24} color="red" />
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
          />

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
    backgroundColor: COLORS.white,
  },
  container1: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  header: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    flex: 1,
  },
  logContainer: { marginBottom: 20 },
  logDate: { fontSize: 12, color: '#666', marginBottom: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timeline: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: 'green',
    borderRadius: 6,
    marginTop: 5,
  },
  logCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    flex: 1,
    elevation: 3,
  },
  message: { fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 12, color: 'green' },
  time: { fontSize: 12, color: '#666' },
});
