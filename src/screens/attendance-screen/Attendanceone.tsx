import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/shared/Header";
import { COLORS } from "~/constants";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "~/store/store";
import { getStudentattendance } from "~/features/Attendanceone/reducers/thunks";
import { selectAttendance } from "~/features/Attendanceone/reducers/selectors";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth * 0.85;

const MinimalWave = ({
  percentage,
  color,
  cardId,
}: {
  percentage: number;
  color: string;
  cardId: number;
}) => {
  const waveHeight = 45;
  const waveWidth = cardWidth - 80;

  
  const waterLevel = waveHeight * (1 - percentage / 100);

  const amplitude = 4;
  const frequency = 0.05;

 
  const path = `M0,${waterLevel} ${Array.from({ length: 100 }, (_, i) => {
    const x = (waveWidth / 100) * i;
    const y = waterLevel + Math.sin(x * frequency) * amplitude;
    return `L${x},${y}`;
  }).join(" ")} L${waveWidth},${waveHeight} L0,${waveHeight} Z`;

  return (
    <View
      style={{
        height: waveHeight,
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Svg height={waveHeight} width={waveWidth}>
        <Defs>
          <LinearGradient
            id={`minimal${cardId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <Stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

      
        <Path d={path} fill={`url(#minimal${cardId})`} />
      </Svg>
    </View>
  );
};

const Attendanceone = () => {
  const dispatch = useDispatch<AppDispatch>();
  const attendance = useSelector(selectAttendance);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const today = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  useEffect(() => {
    const fetchAttendance = async () => {
      const payload = {
        userId: "60d59242-f922-4c34-8974-ea207acadeec",
        month: selectedMonth,
        year: selectedYear,
        instituteId: "973195c0-66ed-47c2-b098-d8989d3e4529",
      };
      await dispatch(getStudentattendance(payload));
    };

    fetchAttendance();
  }, [selectedMonth, selectedYear, dispatch]);

  console.log("Payload sent:", {
  month: selectedMonth,
  year: selectedYear
});

console.log("Payload sent (+1):", {
  month: selectedMonth + 1,
  year: selectedYear
});
useEffect(() => {
  console.log("Attendance raw from Redux:", attendance);

  if (attendance?.data) {
    console.log("Attendance data structure:", attendance.data);
    console.log("Total Working Days:", attendance.data.totalWorkingDays);
    console.log("Attended:", attendance.data.attendedClassCount);
  }
}, [attendance]);
  const cards = [
    {
      id: 1,
      title: "Classes Attended",
      attended: attendance?.data?.attendedClassCount ?? 0,
      total: attendance?.data?.totalWorkingDays ?? 0,
      color: "#6366F1",
    },
    {
      id: 2,
      title: "Present Days",
      attended: attendance?.data?.totalPresentDays ?? 0,
      total: attendance?.data?.totalWorkingDays ?? 0,
      color: "#059669",
    },
    {
      id: 3,
      title: "Absent Days",
      attended: attendance?.data?.totalAbsentDays ?? 0,
      total: attendance?.data?.totalWorkingDays ?? 0,
      color: "#DC2626",
    },
  ];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={["top"]} style={styles.container}>
        <Header />

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Ionicons name="filter" size={20} color="#555" />
          </TouchableOpacity>
        </View>

         {showFilter && (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setShowMonthDropdown(true)}
            >
              <Text style={styles.dropdownText}>{monthNames[selectedMonth]}</Text>
              <Ionicons name="chevron-down" size={16} color="#555" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setShowYearDropdown(true)}
            >
              <Text style={styles.dropdownText}>{selectedYear}</Text>
              <Ionicons name="chevron-down" size={16} color="#555" />
            </TouchableOpacity>
          </View>
        )}

      
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
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

      
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
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={{ paddingHorizontal: 5 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {cards.map((card) => {
            const percentage =
              card.total > 0 ? (card.attended / card.total) * 100 : 0;
            return (
              <View key={card.id} style={[styles.card]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </View>

                <View style={styles.attendedRow}>
                  <Text style={[styles.attendedText, { color: card.color }]}>
                    {card.attended}
                  </Text>
                  <Text style={styles.totalText}>/ {card.total}</Text>
                </View>

                <MinimalWave
                  percentage={percentage}
                  color={card.color}
                  cardId={card.id}
                />

                <View style={styles.percentageContainer}>
                  <Text style={[styles.percentageText, { color: card.color }]}>
                    {Math.round(percentage)}%
                  </Text>
                </View>

               
              </View>
            );
          })}
        </ScrollView>

        
        <Text style={styles.calendarTitle}>Calendar</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.calendarCard}>
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
                }}
              >
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
                }}
              >
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </TouchableOpacity>
            </View>

           
            <View style={styles.weekRow}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

          
            <View style={styles.datesGrid}>

              {(() => {
                const totalSlots = firstDay + daysInMonth;
                const totalWeeks = Math.ceil(totalSlots / 7);
                const weeks = [];

                for (let w = 0; w < totalWeeks; w++) {
                  const currentWeek: React.ReactElement[] = [];

                  for (let d = 0; d < 7; d++) {
                    const cellIndex = w * 7 + d;

                    if (cellIndex < firstDay || cellIndex >= firstDay + daysInMonth) {
                      
                      currentWeek.push(
                        <View key={`empty-${cellIndex}`} style={styles.dateCell} />
                      );
                    } else {
                      const date = cellIndex - firstDay + 1;
                      const isToday =
                        date === today.getDate() &&
                        selectedMonth === today.getMonth() &&
                        selectedYear === today.getFullYear();

                      currentWeek.push(
                        <TouchableOpacity
                          key={date}
                          style={[styles.dateCell, isToday && styles.selectedDate]}
                        >
                          <Text
                            style={[
                              styles.dateText,
                              isToday && styles.selectedDateText,
                            ]}
                          >
                            {date}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  }

                 weeks.push(
  <View key={w} style={styles.weekRowDates}>
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

const styles = StyleSheet.create({
 container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.white,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },
  filterBtn: {
    backgroundColor: "#f4f5f7",
    padding: 10,
    borderRadius: 12,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  card: {
    width: cardWidth,
    height: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
  },
  attendedRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  attendedText: {
    fontSize: 22,
    fontWeight: '700',
  },
  totalText: {
    fontSize: 14,
    color: '#94A3B8',
    alignSelf: 'flex-end',
  },
  percentageContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 22,
    fontWeight: '800',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  calendarCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  weekDay: {
    flex: 1,
    aspectRatio: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "600",
    color: "#555",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  datesGrid: {
    flexDirection: "column",
  },
  weekRowDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dateCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    margin: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDate: {
    backgroundColor: "#7B2FF7",
    borderColor: "#7B2FF7",
  },
  selectedDateText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default Attendanceone;