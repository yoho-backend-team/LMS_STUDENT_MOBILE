import { useNavigation } from '@react-navigation/native';
import { Car, Scroll } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FeesDetails from '~/components/payment/FeeDetails';
import { COLORS } from '~/constants';
import { selectPaymentData } from '~/features/payments/reducer/selectors';
import { getPaymentthunks } from '~/features/payments/reducer/thunks';

const Payment = () => {
  const navigation = useNavigation<any>();

  const dispatch = useDispatch();
  const paymentData = useSelector(selectPaymentData);
  console.log('data', paymentData)
    useEffect(() => {
      dispatch(getPaymentthunks({}) as any);
    }, [dispatch]);

  const statsCards = [
    {
      title: 'Courses Fees',
      value: paymentData?.course_price||'₹0',
      icon: require('../../assets/home/card1icon.png'),
      color: '#22D3EE',
      bgColor: COLORS.white,
    },
    {
      title: 'Amount Paid',
      value: paymentData?.paid_amount||'₹0',
      icon: require('../../assets/home/card1icon.png'),
      color: '#6366F1',
      bgColor: COLORS.white,
    },
    {
      title: 'Pending Payment',
      value: paymentData?.balance||'₹0',
      icon: require('../../assets/home/card1icon.png'),
      color: '#10B981',
      bgColor: COLORS.white,
    },
     {
      title: 'Status',
      value:
        (paymentData?.balance > 0 && paymentData?.paid_amount === 0)
          ? 'Pending'
          : (paymentData?.balance > 0 && paymentData?.paid_amount > 0)
          ? 'Partially Paid'
          : (paymentData?.balance === 0 && paymentData?.paid_amount > 0)
          ? 'Paid'
          : '-',
      icon: require('../../assets/home/card1icon.png'),
      color: '#EC4899',
      bgColor: COLORS.white,
    },
    {
      title: 'Payment Method',
      value:paymentData?.payment_method||'-',
      icon: require('../../assets/home/card1icon.png'),
      color: '#8B5CF6',
      bgColor: COLORS.white,
    },
  ];
  
  

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* Header */}
<ScrollView>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
          </TouchableOpacity>
          <Text style={styles.header}>Payment</Text>
        </View>

     <View style={styles.cardsbg}>
         {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {statsCards.map((item, index) => (
            <View key={index} style={[styles.statsCard, { backgroundColor: item.bgColor }]}>
              <View style={styles.statsHeader}>
                {/* Icon tinted with same color */}
                <Image source={item.icon} style={[styles.statsIcon, { tintColor: item.color }]} />
                {/* Title */}
                <Text style={styles.statsTitle}>{item.title}</Text>
              </View>
              {/* Value with same color */}
              <Text style={[styles.statsValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>
     </View>
          {/* Courses */}
     <View>
      <Text style={styles.header2 }>
        Courses Details
      </Text>
      <View style={styles.cardsbg}>
         <View style={styles.cardsbg}><Image source={require('../../assets/payment/paymentimg.png')} style={styles.img}/>
          </View>
          <Text style={{...styles.header, fontSize:16, marginTop:8}}>{paymentData?.course_name ||'Full Stack Development'}</Text>
          <Text style={{...styles.header, fontSize:12, marginTop:4, color:'#716F6F'}}>Anna University RO Tiruchurappali</Text>
         <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.row}>
        {/* Left: Icon + Text */}
        <View style={styles.row}>
          <Image
            source={require("../../assets/payment/icon1.png")}
            style={styles.icon}
          />
          <Text style={styles.modules}>6 Modules</Text>
        </View>

        {/* Right: Rating */}
        <View style={styles.row}>
          <Image
            source={require("../../assets/payment/Star 1.png")} // ⭐ icon
            style={styles.star}
          />
          <Text style={styles.rating}>4.5</Text>
        </View>
      </View>

      {/* Bottom Value */}
      <Text style={styles.bottomValue}>₹500,000</Text>
    </View>

      </View>
     </View>
     {/* feedetails */}
     <FeesDetails paymentData={paymentData} />
          </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: COLORS.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  header: {
    fontFamily: 'QuicksandBold',
    fontSize: 22,
      fontWeight: "700",

  },
  backbutton: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginTop: 5,
  },
  // Stats Grid Styles
  
     // Shadow effect
  cardsbg:{
   width: '90%',
    padding: 12,
    borderRadius: 12,
    marginLeft:18,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statsCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    marginTop:8,
    backgroundColor: COLORS.white,
    // Shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statsIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  statsTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    flexShrink: 1,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'right',
  },
  // course
   header2: {
    fontFamily: 'QuicksandBold',
    fontSize: 22,
      fontWeight: "700",
      marginLeft:10,
      marginTop:20,
      marginBottom:10,
  },
  img:{
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  card: {
   marginTop:20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  modules: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  star: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  bottomValue: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500",
     textAlign: 'right',
     color: '#10B981',
  },
});
