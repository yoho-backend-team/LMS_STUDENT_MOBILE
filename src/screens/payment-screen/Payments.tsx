import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PaymentScreens = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Payment</Text>
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <Ionicons name="wallet" size={22} color="#2ecc71" />
          <Text style={styles.label}>Courses Fees</Text>
          <Text style={styles.valueGreen}>₹100000</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="cash" size={22} color="#27ae60" />
          <Text style={styles.label}>Amount Paid</Text>
          <Text style={styles.valueGreen}>₹10000</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="alert-circle" size={22} color="#e74c3c" />
          <Text style={styles.label}>Pending Payment</Text>
          <Text style={styles.valueRed}>₹90000</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="time" size={22} color="#9b59b6" />
          <Text style={styles.label}>Status</Text>
          <Text style={styles.valuePurple}>Payment Pending</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="card" size={22} color="#e67e22" />
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.valueOrange}>Offline</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Courses Details</Text>
      <View style={styles.courseCard}>
        <View style={styles.imageBox}>
          <Ionicons name="desktop" size={40} color="#bdc3c7" />
        </View>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>MERN STACK</Text>
          <Text style={styles.courseSubtitle}>Anna University RO Tiruchirappalli</Text>
          <View style={styles.courseMeta}>
            <Text style={styles.modules}>📘 6 Modules</Text>
            <Text style={styles.rating}>⭐ 4.5</Text>
          </View>
          <Text style={styles.price}>₹500,000</Text>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fees Details</Text>
        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadText}>Download Receipt</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feesBox}>
        <View style={styles.rowBetween}>
          <Text style={styles.boldText}>Student :</Text>
          <Text>Elon Musk</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.boldText}>Category :</Text>
          <Text>MEAN Stack 2024</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.boldText}>Enrolled Date :</Text>
          <Text>12 June 2025</Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Description</Text>
          <Text style={styles.tableHeaderText}>Amount (INR)</Text>
        </View>

        <View style={styles.tableRow}>
          <Text>Tuition Amount</Text>
          <Text>₹100000 INR</Text>
        </View>
        <View style={styles.tableRow}>
          <Text>Software Cost</Text>
          <Text>₹13,000 INR</Text>
        </View>
        <View style={styles.tableRow}>
          <Text>GST Tax</Text>
          <Text>₹1,800 INR</Text>
        </View>
        <View style={styles.tableRow}>
          <Text>Paid Amount</Text>
          <Text>₹10000 INR</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ color: "#e74c3c", fontWeight: "bold" }}>Pending</Text>
          <Text style={{ color: "#e74c3c", fontWeight: "bold" }}>₹90000 INR</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Payment History</Text>
      <View style={styles.historyBox}>
        <View style={styles.rowBetween}>
          <Text>View PDF</Text>
          <TouchableOpacity style={styles.pdfBtn}>
            <Text style={{ fontWeight: "bold" }}>View PDF</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 5 }}>21 June 2025</Text>

        <View style={[styles.rowBetween, { marginTop: 15 }]}>
          <Text>Pay Due</Text>
          <Text style={{ color: "#7f8c8d" }}>No Pending Payments</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 15 },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  cardWrapper: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    marginVertical: 8,
    elevation: 3,
  },
  label: { fontSize: 14, marginTop: 5, color: "#555" },
  valueGreen: { fontSize: 16, fontWeight: "bold", color: "#2ecc71" },
  valueRed: { fontSize: 16, fontWeight: "bold", color: "#e74c3c" },
  valuePurple: { fontSize: 16, fontWeight: "bold", color: "#9b59b6" },
  valueOrange: { fontSize: 16, fontWeight: "bold", color: "#e67e22" },

  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: "bold" },
  courseSubtitle: { fontSize: 13, color: "#7f8c8d", marginVertical: 3 },
  courseMeta: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
  modules: { fontSize: 13, color: "#2c3e50" },
  rating: { fontSize: 13, color: "#f39c12" },
  price: { fontSize: 16, fontWeight: "bold", color: "#27ae60" },

  downloadBtn: {
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  downloadText: { fontWeight: "600", fontSize: 13 },

  feesBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  boldText: { fontWeight: "bold" },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  tableHeaderText: { fontWeight: "bold", color: "#6c5ce7" },
  tableRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },

  historyBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
  pdfBtn: {
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default PaymentScreens;
