import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS, FONTS, icons } from '~/constants';
import { formatDateandTime } from '~/utils/formatDate';
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
  {
    id: '5',
    message: 'Dashboard Logout Successfully',
    email: 'Musk@Gmail.Com',
    date: '2025-06-25T09:40:00',
  },
  {
    id: '6',
    message: 'Dashboard Logout Successfully',
    email: 'Musk@Gmail.Com',
    date: '2025-06-25T09:40:00',
  },
  {
    id: '7',
    message: 'Dashboard Logout Successfully',
    email: 'Musk@Gmail.Com',
    date: '2025-06-25T09:40:00',
  },
  {
    id: '8',
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
  const navigation = useNavigation();
  const toggleFilter = () => setFilterVisible((prev) => !prev);

  const dispatch = useDispatch<any>();
  const getActivtiy = useSelector(ActivitySelector)?.data?.data;

  console.log("Activity Data",getActivtiy);

  useEffect (() => {
   dispatch(getAllActivityData({}))
  },[])

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

  const filteredLogs = getActivtiy?.filter((log: any) => {
    const logDate: any = new Date(log.timestamp);
    if (fromDate && logDate < fromDate) return false;
    if (toDate && logDate > toDate) return false;
    return true;
  });

  const renderItem = ({ item }: { item: Log }) => {
    const logDate: any = new Date(item.date);
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
              <Text style={styles.email}>
                {item.title} {item.user?.email}
              </Text>
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
        {/* code inside the view section*/}
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
                <Text style={{ ...FONTS.h5 }}>
                  {fromDate ? formatDateandTime(fromDate) : 'From Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setPickerMode('to');
                  setShowPicker(true);
                }}>
                <Text style={{ ...FONTS.h5 }}>
                  {toDate ? formatDateandTime(toDate) : 'To Date'}
                </Text>
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
            showsVerticalScrollIndicator={false}
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
    marginRight: 8,
    flex: 1,
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
});
