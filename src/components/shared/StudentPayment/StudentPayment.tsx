import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';

const PaymentScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Main Card Container */}
        <View style={styles.mainCard}>
          {/* First Row */}
          <View style={styles.row}>
            {/* Courses Fees Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Courses Fees</Text>
              <Text style={[styles.cardValue, styles.coursesFeesValue]}>100000</Text>
            </View>
            
            {/* Amount Paid Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Amount Paid</Text>
              <Text style={[styles.cardValue, styles.amountPaidValue]}>10000</Text>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.row}>
            {/* Pending Payment Card */}
            <View style={[styles.card, styles.pendingPaymentCard]}>
              <Text style={styles.cardLabel}>Pending Payment</Text>
              <View style={styles.pendingPaymentContainer}>
                <Text style={[styles.cardValue, styles.pendingPaymentValue]}>900000</Text>
              </View>
            </View>
            
            {/* Status Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Status</Text>
              <Text style={[styles.cardValue, styles.statusText]}>Payment Pending</Text>
            </View>
          </View>

          {/* Third Row - Payment Method */}
          <View style={[styles.fullWidthCard, styles.paymentMethodCard]}>
            <Text style={styles.cardLabel}>Payment Method</Text>
            <View style={styles.paymentMethodContainer}>
              <Text style={[styles.cardValue, styles.paymentMethodValue]}>Offline</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  mainCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    marginHorizontal: 4,
  },
  fullWidthCard: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#000', // Changed to black
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Changed to black
  },
  // Courses Fees - Light Blue
  coursesFeesValue: {
    color: '#7B00FF',
  },
  // Amount Paid - Light Green
  amountPaidValue: {
    color: '#11A21E',
  },
  // Pending Payment - Right aligned with Light Red
  pendingPaymentCard: {
    justifyContent: 'space-between',
  },
  pendingPaymentContainer: {
    alignItems: 'flex-end',
  },
  pendingPaymentValue: {
    color: '#C63028',
  },
  // Status - Smaller font with Purple
  statusText: {
    color: '#A32AF3',
    fontSize: 14,
  },
  // Payment Method - Right aligned with Light Orange
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodContainer: {
    alignItems: 'flex-end',
  },
  paymentMethodValue: {
    color: '#E67123',
  },
});

export default PaymentScreen;