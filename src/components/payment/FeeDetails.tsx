import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PaymentSlip from '../../components/payment/Paymentslip';
import { formatDate } from '../../utils/formatDate';

interface PaymentDataProps {
  paymentData: any;
}

const FeesDetails: React.FC<PaymentDataProps> = ({ paymentData }) => {
  const [showPaymentSlip, setShowPaymentSlip] = useState<any>(false);
  const currentPendingLength = paymentData?.payment_history?.length;
  const currentPending = paymentData?.payment_history[currentPendingLength - 1];

  const handleViewPDF = () => {
    setShowPaymentSlip(true);
  };

  const handleCloseModal = () => {
    setShowPaymentSlip(false);
  };

  if (showPaymentSlip) {
    return <PaymentSlip paymentData={paymentData} onClose={handleCloseModal} visible={true} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Fees Details</Text>
        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadText}>Download Receipt</Text>
        </TouchableOpacity>
      </View>

      {/* Student Info */}
      <View style={styles.feesbg}>
        <View style={styles.infoCard}>
          <View>
            <Text style={styles.infoLabel}>Student :</Text>
            <Text style={styles.infoValue}>
              {paymentData?.fees?.[0]?.student?.full_name || 'N/A'}
            </Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Category :</Text>
            <Text style={styles.infoValue}>{paymentData?.course?.course_name || 'N/A'}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Enrolled Date :</Text>
            <Text style={styles.infoValue}>
              {formatDate(paymentData?.fees?.[0]?.createdAt) || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Description</Text>
          <Text style={styles.tableHeaderText}>Amount (INR)</Text>
        </View>

        {/* Fee Details */}
        <View style={styles.tableRow}>
          <Text style={styles.desc}>Tuition Amount</Text>
          <Text style={styles.amount}>{paymentData?.course_fees || '₹0'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.desc}>GST Tax</Text>
          <Text style={styles.amount}>{`₹${paymentData?.fees?.[0]?.gst}` || '₹0'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.desc}>Other Taxes</Text>
          <Text style={styles.amount}>{`₹${paymentData?.fees?.[0]?.other_taxes}` || '₹0'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.desc}>Paid Amount</Text>
          <Text style={styles.amount}>{`₹${currentPending?.paid_amount}` || '₹0'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.pending}>Pending</Text>
          <Text style={styles.pendingAmount}>{`₹${currentPending?.balance}` || '₹0'}</Text>
        </View>
      </View>

      {/* Payment History */}
      <Text style={[styles.title, { marginTop: 12 }]}>Payment History</Text>

      <View style={styles.historyCard}>
        <View style={styles.historyRow}>
          <Text style={styles.historyDate}>{currentPending?.duepaymentdate}</Text>
          <TouchableOpacity style={styles.pdfBtn} onPress={() => handleViewPDF()}>
            <Text style={styles.pdfText}>View PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Due */}
      <View style={styles.historyCard}>
        <View style={styles.historyRow}>
          <Text style={styles.dueText}>Pay Due</Text>
          <Text style={styles.noDue}>No Pending Payments</Text>
        </View>
      </View>
    </View>
  );
};

export default FeesDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  downloadBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  feesbg: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginTop: 3,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 3,
    marginTop: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B2CF5',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  amount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  pending: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C63028',
  },
  pendingAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C63028',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginTop: 12,
    elevation: 3,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  pdfBtn: {
    backgroundColor: '#F1F3F6',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    elevation: 2,
  },
  pdfText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#716F6F',
  },
  dueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A2A2A',
  },
  noDue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#716F6F',
  },
});
