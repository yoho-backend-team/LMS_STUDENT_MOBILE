import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { COLORS } from '~/constants';

const { height } = Dimensions.get('window');

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

type PaymentSlipProps = {
  onClose: () => void;
  paymentData: any;
  visible: boolean;
};

const PaymentSlip = ({ onClose, paymentData, visible }: PaymentSlipProps) => {
  const currentPendingLength = paymentData?.payment_history?.length;
  const currentPending = paymentData?.payment_history[currentPendingLength - 1];

  const htmlContent = `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 30px; }
      .title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
      .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      .table th, .table td { padding: 10px; border: 1px solid #ccc; text-align: left; }
      .table th { background-color: #f5f5f5; font-weight: bold; }
      .footer { text-align: center; font-size: 14px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="title">Payment Slip</div>
    <table class="table">
      <tr><th>Student Name</th><td>${paymentData?.fees?.[0]?.student?.full_name || 'N/A'}</td></tr>
      <tr><th>Student ID</th><td>${paymentData?.fees?.[0]?.student?.id || 'N/A'}</td></tr>
      <tr><th>Payment Date</th><td>${currentPending?.payment_date ? formatDate(currentPending?.payment_date) : 'N/A'}</td></tr>
      <tr><th>Paid Amount</th><td>${currentPending?.paid_amount || '0'}</td></tr>
      <tr><th>Pending Amount</th><td>${currentPending?.balance || '0'}</td></tr>
    </table>
    <div class="footer">Thank you for your service!</div>
  </body>
  </html>`;

  const generatePDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Payment Slip</Text>

          {paymentData ? (
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={styles.label}>Student Name:</Text>
                <Text style={styles.value}>
                  {paymentData?.fees?.[0]?.student?.full_name || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Student ID:</Text>
                <Text style={styles.value}>{paymentData?.fees?.[0]?.student?.id || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Date:</Text>
                <Text style={styles.value}>
                  {currentPending?.payment_date ? formatDate(currentPending?.payment_date) : 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Paid Amount:</Text>
                <Text style={styles.value}>{`₹${currentPending?.paid_amount}` || '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pending Amount:</Text>
                <Text style={styles.value}>{`₹${currentPending?.balance}` || '0'}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No payment data available</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Text style={styles.backButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.downloadButton, !paymentData && styles.disabledButton]}
              onPress={generatePDF}
              disabled={!paymentData}>
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PaymentSlip;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: 20, paddingTop: 50 },
  closeButton: {
    backgroundColor: COLORS.bg_Colour,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: { color: COLORS.text_title, fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 20, alignItems: 'center', minHeight: height - 150 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', flex: 1 },
  value: { fontSize: 16, color: '#000', flex: 1, textAlign: 'right' },
  noDataContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  noDataText: { fontSize: 16, color: '#666' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
    width: '100%',
  },
  backButton: {
    backgroundColor: COLORS.bg_Colour,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 0.2,
  },
  backButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  downloadButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#ccc' },
  downloadButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
