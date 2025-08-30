import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';


const dummyLogs = [
  { id: '1', title: 'Dashboard Logout Successfully', email: 'Dashboard logout Successfully Musk@Gmail.Com', timestamp: '2025-06-25T09:40:00' },
  { id: '2', title: 'Dashboard Logout Successfully', email: 'Dashboard logout Successfully Musk@Gmail.Com', timestamp: '2025-06-25T09:40:00' },
  { id: '3', title: 'Dashboard Logout Successfully', email: 'Dashboard logout Successfully Musk@Gmail.Com', timestamp: '2025-06-25T09:40:00' },
  { id: '4', title: 'Dashboard Logout Successfully', email: 'Dashboard logout Successfully Musk@Gmail.Com', timestamp: '2025-06-25T09:40:00' },
];

const ActivityLogs = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'from' | 'to'>('from');
  const navigation = useNavigation<any>();

  const toggleFilter = () => setFilterVisible((prev) => !prev);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const handleDateSelect = (day: any) => {
    if (pickerMode === 'from') setFromDate(day.dateString);
    else setToDate(day.dateString);
  };

  const handleOkPress = () => {
    setShowPicker(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.logContainer}>
      <View style={styles.timelineRow}>
        <View style={styles.timeline}>
          <Image source={require('../../assets/icons/green circle.png')} style={styles.dot} />
          <Image source={require('../../assets/icons/barLine.png')} style={styles.barLine} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.message}>{item.title}</Text>
          <View style={styles.logCard}>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.time}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={'#000'} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.container1}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.header}>Activity Log</Text>
          </View>

         
          <TouchableOpacity style={styles.filterBtn} onPress={toggleFilter}>
            <Image source={require('../../assets/icons/Frame.png')} style={{ width: 35, height: 35 }} />
          </TouchableOpacity>

         
          {filterVisible && (
            <View style={styles.dateBoxWrapper}>
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => {
                  setPickerMode('from');
                  setShowPicker(true);
                }}>
                <Text style={styles.dateLabel}>From</Text>
                <Text style={styles.dateValue}>{fromDate ? formatDate(fromDate) : 'DD-MM-YY'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => {
                  setPickerMode('to');
                  setShowPicker(true);
                }}>
                <Text style={styles.dateLabel}>To</Text>
                <Text style={styles.dateValue}>{toDate ? formatDate(toDate) : 'DD-MM-YY'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Logs */}
          <FlatList
            data={dummyLogs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          <Modal visible={showPicker} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  Select {pickerMode === 'from' ? 'From' : 'To'} Date
                </Text>

                <View style={styles.calendarWrapper}>
                  <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={{
                      [fromDate || '']: { selected: true, selectedColor: '#8E2DE2' },
                      [toDate || '']: { selected: true, selectedColor: '#4A90E2' },
                    }}
                    theme={{
                      backgroundColor: '#EBEFF3',
                      calendarBackground: '#EBEFF3',
                      textSectionTitleColor: '#6B7280',
                      dayTextColor: '#111827',
                      todayTextColor: '#8E2DE2',
                      selectedDayBackgroundColor: '#8E2DE2',
                      selectedDayTextColor: '#FFFFFF',
                      monthTextColor: '#111827',
                      arrowColor: '#8E2DE2',
                    }}
                  />
                </View>

               
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPicker(false)}>
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.okBtn} onPress={handleOkPress}>
                    <Text style={styles.okBtnText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ActivityLogs;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: '#EBEFF3' },
  container1: { flex: 1, paddingHorizontal: 15 },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  header: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  backbutton: { width: 48, height: 48, resizeMode: 'contain' },

  filterBtn: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },

  dateBoxWrapper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  dateBox: {
    flex: 1,
    backgroundColor: '#EBEFF3',
    borderRadius: 14,
    paddingVertical: 14,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  dateLabel: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 4 },
  dateValue: { fontSize: 14, color: '#716F6F', fontWeight: '500' },

  logContainer: { marginBottom: 20 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 15 },
  timeline: { width: 30, alignItems: 'center', position: 'relative' },
  dot: { width: 50, height: 50, borderRadius: 50, zIndex: 2 },
  barLine: { position: 'absolute', top: 25, width: 20, height: '100%', resizeMode: 'stretch', zIndex: 1 },
  logCard: {
    backgroundColor: '#EBEFF3',
    padding: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  message: { fontWeight: 'bold', marginBottom: 8, color: '#111827' },
  email: { fontSize: 13, color: 'green', marginBottom: 5 },
  time: { fontSize: 11, color: '#6B7280', textAlign: 'right' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#EBEFF3',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: '#111' },

  calendarWrapper: {
    backgroundColor: '#EBEFF3',
    borderRadius: 16,
    marginVertical: 12,
    padding: 8,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 10,
  },

 
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#EBEFF3',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  okBtn: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#8E2DE2',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  btnText: { color: '#111827', fontWeight: '600', fontSize: 14 },
  okBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});