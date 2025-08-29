import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,

  // ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/shared/Header";
import { COLORS } from "~/constants";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendanceThunk } from "~/features/Attendance/reducers/thunks";
import { selectAllAttendance } from "~/features/Attendance/reducers/selectors";
import { AppDispatch } from "~/store/store";
import { LineChart } from "react-native-chart-kit";


const Attendanceone = () => {
  const dispatch = useDispatch<AppDispatch>();
   const attendanceData = useSelector(selectAllAttendance);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      // setLoading(true);
      // setError("");
      try {
        await dispatch(getAllAttendanceThunk({
          month: selectedMonth + 1,
          year: String(selectedYear),
        }));
      } catch (err) {
        // setError("Failed to fetch attendance data");
        console.log('Error fetching attendance:', err);
      } finally {
        // setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedMonth, selectedYear, dispatch]);

  const cards = [
    {
      id: 1,
      title: "Classes Attended",
      attended: attendanceData?.classesAttended ?? 0,
      total: attendanceData?.totalClasses ?? 0,
    },
    {
      id: 2,
      title: "Present Days",
      attended: attendanceData?.presentDays ?? 0,
      total: attendanceData?.workingDays ?? 0,
    },
    {
      id: 3,
      title: "Absent Days",
      attended: attendanceData?.absentDays ?? 0,
      total: attendanceData?.workingDays ?? 0,
    },
  ];

  const generateChartData = (attended: number, total: number) => {
    const ratio = total > 0 ? attended / total : 0;
    const points = [0, ratio * 0.3, ratio * 0.6, ratio, ratio * 1.05];
    return points.map((p) => Math.max(0, Math.min(total, p * total)));
  };

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <ActivityIndicator size="large" color={COLORS.purple_01} />
  //     </SafeAreaView>
  //   );
  // }

  // if (error) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <Text style={styles.errorText}>{error}</Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={["top"]} style={styles.container}>
        <Header />

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilter((s) => !s)}
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
                keyExtractor={(_, idx) => idx.toString()}
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
          contentContainerStyle={{ paddingVertical: 6 }}
        >
          {cards.map((card, index) => {
            const colors = ["#7B2FF7", "#FF2FBF", "#23D3F7"];
            const chartColor = colors[index % colors.length];

            const chartData = generateChartData(card.attended, card.total);
            const chartWidth = 350;
            const chartHeight = 90;

            const badgeIndex = chartData.length - 1;
            const maxValue = Math.max(...chartData, 1); // Avoid division by zero
            const badgeTop = chartHeight - (chartData[badgeIndex] / maxValue) * chartHeight - 20;

            return (
              <View key={card.id} style={[styles.card, { position: "relative" }]}>
                <View style={styles.row}>
                  <Text style={styles.title}>{card.title}</Text>
                  <Text style={styles.attendanceText}>
                    <Text style={[styles.attended, { color: chartColor }]}>{card.attended}</Text> / {card.total}
                  </Text>
                </View>

                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
                  <LineChart
                    data={{
                      labels: ["", "", "", "", ""],
                      datasets: [{ data: chartData }],
                    }}
                    width={chartWidth}
                    height={chartHeight}
                    chartConfig={{
                      backgroundGradientFrom: "white",
                      backgroundGradientTo: "white",
                      decimalPlaces: 0,
                      color: () => chartColor,
                      propsForDots: { r: "3", strokeWidth: "2", stroke: chartColor, fill: chartColor },
                    }}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLabels={false}
                    withHorizontalLabels={false}
                    withShadow={false}
                    bezier
                    style={{ borderRadius: 12 }}
                  />

                  <View
                    style={{
                      position: "absolute",
                      top: badgeTop,
                      backgroundColor: chartColor,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
                      {card.attended}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <Text style={styles.calendarTitle}>Calendar</Text>
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear((y) => y - 1);
                } else {
                  setSelectedMonth((m) => m - 1);
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
                  setSelectedYear((y) => y + 1);
                } else {
                  setSelectedMonth((m) => m + 1);
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
              const weeks = [];
              let currentWeek = [];

              for (let i = 0; i < totalSlots; i++) {
                if (i < firstDay) {
                  currentWeek.push(<View key={`empty-${i}`} style={styles.dateCell} />);
                } else {
                  const date = i - firstDay + 1;
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
                        style={[styles.dateText, isToday && styles.selectedDateText]}
                      >
                        {date}
                      </Text>
                    </TouchableOpacity>
                  );
                }

                if ((i + 1) % 7 === 0) {
                  weeks.push(
                    <View key={`week-${i}`} style={styles.weekRowDates}>
                      {currentWeek}
                    </View>
                  );
                  currentWeek = [];
                }
              }

              if (currentWeek.length > 0) {
                weeks.push(
                  <View key="last-week" style={styles.weekRowDates}>
                    {currentWeek}
                  </View>
                );
              }

              return weeks;
            })()}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Attendanceone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 25,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: COLORS.black },
  filterBtn: { backgroundColor: "#f4f5f7", padding: 10, borderRadius: 12 },
  filterContainer: { flexDirection: "row", gap: 10, marginBottom: 15 },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dropdownText: { fontSize: 14, fontWeight: "500", color: "#444", marginRight: 6 },

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
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  modalItemText: { fontSize: 16, color: "#333" },

  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginRight: 15,
    height: 175,
    width: 370,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 6,
  },

  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "600" },
  attendanceText: { fontSize: 20, fontWeight: "500", color: "#555" },
  attended: { fontSize: 28, fontWeight: "700" },

  badge: {
    position: "absolute",
    top: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  calendarTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginTop: 1 },

  calendarCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 50,
    height: 382,
    width: 370,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },

  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  calendarHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  monthText: { fontSize: 18, fontWeight: "700", color: "#333", alignItems: 'center' },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  weekDay: {
    width: 40,
    height: 40,
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
  dateText: { fontSize: 14, color: "#333" },
  selectedDate: { backgroundColor: "#7B2FF7", borderColor: "#7B2FF7" },
  selectedDateText: { color: "#fff", fontWeight: "700" },
  weekRowDates: { flexDirection: "row", marginBottom: 4 },
  datesGrid: { flexDirection: "column" },
  dateCell: {
    width: 40,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});