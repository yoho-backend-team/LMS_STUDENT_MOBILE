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
import { getImageUrl } from '~/utils/imageUtils';

const { height } = Dimensions.get('window');

type PaymentSlipProps = {
  onClose: () => void;
  paymentData: any;
  visible: boolean;
};

const PaymentSlip = ({ onClose, paymentData, visible }: PaymentSlipProps) => {
  const currentPendingLength = paymentData?.payment_history?.length;
  const currentPending = paymentData?.payment_history?.[currentPendingLength - 1];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  // Full HTML content styled like your sample
  const htmlContent = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-height: 80px; margin-bottom: 10px; }
    .institute-name { font-size: 22px; font-weight: bold; margin: 5px 0; }
    .address { font-size: 14px; color: #555; line-height: 1.4; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: bold; text-align: center; margin: 20px 0; text-decoration: underline; }
    .details { margin: 20px 0; }
    .details p { margin: 6px 0; font-size: 14px; }
    .details b { display: inline-block; width: 130px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th, .table td { padding: 10px; border: 1px solid #ccc; text-align: left; }
    .table th { background-color: #f5f5f5; font-weight: bold; }
    .total-row td { font-weight: bold; }
    .footer { margin-top: 40px; font-size: 13px; text-align: center; color: #444; }
  </style>
</head>
<body>
  <div class="header">
    <img class="logo" src="${getImageUrl(paymentData?.fees?.[0]?.institute_id?.image)}" alt="Logo" />
    <div class="institute-name">${paymentData?.fees?.[0]?.institute_id?.institute_name || 'N/A'}</div>
    <div class="address">
      ${paymentData?.fees?.[0]?.institute_id?.contact_info?.address?.address1 || ''} 
      ${paymentData?.fees?.[0]?.institute_id?.contact_info?.address?.address2 || ''}, 
      ${paymentData?.fees?.[0]?.institute_id?.contact_info?.address?.city || ''}, 
      ${paymentData?.fees?.[0]?.institute_id?.contact_info?.address?.state || ''} 
      - ${paymentData?.fees?.[0]?.institute_id?.contact_info?.address?.pincode || ''}
    </div>
  </div>

  <div class="title">Payment Receipt</div>

  <div class="details">
    <p><b>Date:</b> ${currentPending?.payment_date ? formatDate(currentPending?.payment_date) : 'N/A'}</p>
    <p><b>Receipt No.:</b> ${paymentData?.receipt_no || '123'}</p>
    <p><b>Student Name:</b> ${paymentData?.fees?.[0]?.student?.full_name || 'N/A'}</p>
    <p><b>Student ID:</b> ${paymentData?.fees?.[0]?.student?.id || '-'}</p>
    <p><b>Payment Type:</b> ${currentPending?.payment_type || 'Cash'}</p>
  </div>

  <table class="table">
    <tr>
      <th>Description</th>
      <th>Amount (₹)</th>
    </tr>
    <tr>
      <td>Tuition Fee</td>
      <td>${currentPending?.paid_amount || '0'}</td>
    </tr>
    <tr>
      <td>Course Amount</td>
      <td>${paymentData?.course_fees || '0'}</td>
    </tr>
    <tr>
      <td>Payment Status</td>
      <td>${paymentData?.payment_status || '0'}</td>
    </tr>
    <tr class="">
    <td>Paid Amount</td>
    <td>${currentPending?.paid_amount || '0'}</td>
    </tr>
    <tr>
    <td>Payment Method</td>
    <td>${currentPending?.payment_method || '0'}</td>
    </tr>
    <tr>
      <td>Pending Amount</td>
      <td>${currentPending?.balance || '0'}</td>
    </tr>
  </table>

  <div class="footer">
    Thank you for your payment.<br/>
    For inquiries, contact us at <b>${paymentData?.fees?.[0]?.institute_id?.email || 'N/A'}</b><br/>
    Phone: <b>${paymentData?.fees?.[0]?.institute_id?.contact_info?.phone_no || 'N/A'} / ${paymentData?.fees?.[0]?.institute_id?.contact_info?.alternate_no || 'N/A'}</b>
  </div>
</body>
</html>
  `;

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
            <View style={styles.tablePreview}>
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
                <Text style={styles.value}>₹{currentPending?.paid_amount || '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pending Amount:</Text>
                <Text style={styles.value}>₹{currentPending?.balance || '0'}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 50,
  },
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
  tablePreview: {
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
