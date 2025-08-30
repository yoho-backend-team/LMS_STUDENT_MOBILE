import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAttendance, selectAttendanceByDate } from '~/features/Attendance/reducers/selectors';
import { getattendanceByDate, getStudentattendance } from '~/features/Attendance/reducers/thunks';
import { getattendancedata } from '~/features/Attendance/Services';
import AttendanceCards from '~/components/attendance/attCard';

const { width } = Dimensions.get('window');

const Attendance = () => {
  const Navigation = useNavigation<any>();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const dispatch = useDispatch<any>();

  const today = new Date();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const attendance = useSelector(selectAttendance);

  const cards = [
    {
      id: 1,
      title: 'Classes Atten',
      attended: attendance?.data?.attendedClassCount,
      total: attendance?.data?.totalWorkingDays,
      img: require('../../assets/attendace/attengraph1.png'),
    },
    {
      id: 2,
      title: 'Present Days',
      attended: attendance?.data?.totalPresentDays,
      total: attendance?.data?.totalWorkingDays,
      img: require('../../assets/attendace/attengraph2.png'),
    },
    {
      id: 3,
      title: 'Absent Days',
      attended: attendance?.data?.totalAbsentDays,
      total: attendance?.data?.totalWorkingDays,
      img: require('../../assets/attendace/attengraph3.png'),
    },
  ];

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      dispatch(getattendanceByDate({ date: formattedDate }));
    }
  }, [selectedDate, dispatch]);

  useEffect(() => {
    const payload = {
      userId: '60d59242-f922-4c34-8974-ea207acadeec',
      month: selectedMonth,
      year: selectedYear,
      instituteId: '973195c0-66ed-47c2-b098-d8989d3e4529',
    };
    dispatch(getStudentattendance(payload));
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(!showFilter)}>
            <Ionicons name="filter" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Filter */}
        {showFilter && (
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowMonthDropdown(true)}>
              <Text style={styles.dropdownText}>{monthNames[selectedMonth]}</Text>
              <Ionicons name="chevron-down" size={16} color="#555" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowYearDropdown(true)}>
              <Text style={styles.dropdownText}>{selectedYear}</Text>
              <Ionicons name="chevron-down" size={16} color="#555" />
            </TouchableOpacity>
          </View>
        )}

        {/* Month Modal */}
        <Modal visible={showMonthDropdown} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={monthNames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedMonth(index);
                      setShowMonthDropdown(false);
                    }}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Year Modal */}
        <Modal visible={showYearDropdown} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={years}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedYear(item);
                      setShowYearDropdown(false);
                    }}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
            {/* {cards.map((card) => (
              <View key={card.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.title}>{card.title}</Text>
                  <Text style={styles.attendanceText}>
                    <Text style={styles.attended}>{card.attended}</Text>/{card.total}
                  </Text>
                </View>
                <Image source={card.img} style={styles.curveImage} resizeMode="contain" />
              </View>
            ))} */}
            <AttendanceCards attendance={attendance} />
          </ScrollView>
        </View>

        {/* Calendar */}
        <Text style={styles.calendarTitle}>Calendar</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.calendarCard}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.arrowBtn}
                onPress={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(selectedYear - 1);
                  } else {
                    setSelectedMonth(selectedMonth - 1);
                  }
                }}>
                <Ionicons name="chevron-back" size={20} color="#555" />
              </TouchableOpacity>
              <Text style={styles.monthText}>
                {monthNames[selectedMonth]} {selectedYear}
              </Text>

              <TouchableOpacity
                style={styles.arrowBtn}
                onPress={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                }}>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Week Header */}
            <View style={styles.weekRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Dates */}
            {/* Dates */}
            <View style={styles.datesGrid}>
              {(() => {
                const totalSlots = firstDay + daysInMonth;
                const totalWeeks = Math.ceil(totalSlots / 7); // always full rows
                const weeks = [];

                for (let w = 0; w < totalWeeks; w++) {
                  const currentWeek: any[] = [];

                  for (let d = 0; d < 7; d++) {
                    const cellIndex = w * 7 + d;

                    if (cellIndex < firstDay || cellIndex >= firstDay + daysInMonth) {
                      // empty cell
                      currentWeek.push(<View key={`empty-${cellIndex}`} style={styles.dateCell} />);
                    } else {
                      const date = cellIndex - firstDay + 1;
                      const isToday =
                        date === today.getDate() &&
                        selectedMonth === today.getMonth() &&
                        selectedYear === today.getFullYear();

                      currentWeek.push(
                        <TouchableOpacity
                          key={date}
                          style={[styles.dateCell, isToday && styles.selectedDate]}>
                          <Text style={[styles.dateText, isToday && styles.selectedDateText]}>
                            {date}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  }

                  weeks.push(
                    <View key={`week-${w}`} style={styles.weekRowDates}>
                      {currentWeek}
                    </View>
                  );
                }

                return weeks;
              })()}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.white,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  filterBtn: {
    backgroundColor: '#f4f5f7',
    padding: 10,
    borderRadius: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f5f7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },

  // Cards
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginRight: 15,
    height: 175,
    width: width * 0.85, // responsive
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#555',
  },
  attended: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7B2FF7',
  },
  curveImage: {
    width: '100%',
    height: 75,
    marginTop: 30,
  },

  // Calendar
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 16,
    marginTop: 10,
    width: '100%', // responsive
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    aspectRatio: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    color: '#555',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDate: {
    backgroundColor: '#7B2FF7',
    borderColor: '#7B2FF7',
  },
  selectedDateText: {
    color: '#fff',
    fontWeight: '700',
  },
  weekRowDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  datesGrid: {
    flexDirection: 'column',
  },
  dateCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
