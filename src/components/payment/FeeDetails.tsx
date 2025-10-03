import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import PaymentSlip from '../../components/payment/Paymentslip';
import { formatDate } from '../../utils/formatDate';
import { COLORS } from '~/constants';

interface PaymentDataProps {
  paymentData: any;
}

const FeesDetails: React.FC<PaymentDataProps> = ({ paymentData }) => {
  const [showPaymentSlip, setShowPaymentSlip] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const handleViewPDF = (paymentItem: any) => {
    setSelectedPayment(paymentItem);
    setShowPaymentSlip(true);
  };

  const handleCloseModal = () => {
    setShowPaymentSlip(false);
  };

  if (showPaymentSlip) {
    return (
      <PaymentSlip
        paymentData={paymentData}
        currentPending={selectedPayment}
        onClose={handleCloseModal}
        visible={true}
      />
    );
  }

  const parseAmount = (amount: string | number) => {
    if (!amount) return 0;
    const num = typeof amount === 'string' ? parseInt(amount.replace(/[^\d-]/g, ''), 10) : amount;
    return Math.abs(num);
  };

  const totalAmount = parseAmount(paymentData?.totalAmount);
  const pendingAmount = parseAmount(paymentData?.pending_payment);
  const paidAmount = totalAmount - pendingAmount;
  // reverse history array
  const paymentHistory = [...(paymentData?.payment_history || [])].reverse();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Fees Details</Text>
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
          <Text style={styles.desc}>Total Amount</Text>
          <Text style={styles.amount}>₹{totalAmount}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.desc}>Paid Amount</Text>
          <Text style={styles.amount}>₹{paidAmount}</Text>
        </View>
        <View style={[styles.tableRow, styles.dashedRow]}>
          <Text style={styles.pending}>Pending</Text>
          <Text style={styles.pendingAmount}>₹{parseAmount(paymentData?.pending_payment)}</Text>
        </View>
      </View>

      {/* Payment History */}
      <Text style={[styles.title, { marginTop: 12 }]}>Payment History</Text>

      {paymentHistory.map((item, index) => (
        <View style={styles.historyCard} key={index}>
          <View style={styles.historyRow}>
            <Text style={styles.historyDate}>
              {item?.duepaymentdate ? formatDate(item?.duepaymentdate) : 'N/A'}
            </Text>
            <TouchableOpacity style={styles.pdfBtn} onPress={() => handleViewPDF(item)}>
              <Text style={styles.pdfText}>View PDF</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyRow}>
            <Text style={styles.dueText}>Paid: ₹{item?.paid_amount || 0}</Text>
            {/* <Text style={styles.noDue}>Balance: ₹{item?.balance || 0}</Text> */}
          </View>
        </View>
      ))}
    </ScrollView>
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
  dashedRow: {
    borderTopWidth: 1,
    borderTopColor: '#555', 
    borderStyle: 'dashed',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    width: '50%',
  },
  pdfBtn: {
    backgroundColor: '#F1F3F6',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    elevation: 2,
    width: '30%',
  },
  pdfText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.purple_01,
    textAlign: 'center',
  },
  dueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#716F6F',
  },
  noDue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#716F6F',
  },
});
