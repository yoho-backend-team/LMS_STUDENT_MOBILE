import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectPaymentData } from '~/features/payments/reducer/selectors';
import { getPaymentthunks } from '~/features/payments/reducer/thunks';

const PaymentCard = () => {
  const navigation = useNavigation();
    const dispatch = useDispatch();
  const paymentData = useSelector(selectPaymentData);
  console.log('data', paymentData)
    useEffect(() => {
      dispatch(getPaymentthunks({}) as any);
    }, [dispatch]);
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>Payment</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Payment Pending for April</Text>

      {/* Amount Label */}
      <Text style={styles.amountLabel}>Amount to pay :</Text>

      {/* Amount */}
      <Text style={styles.amount}>{paymentData?.balance || '₹0'}</Text>

      {/* Gradient Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonWrapper}
        onPress={() => navigation.navigate('Payment' as never)}>
        <LinearGradient
          colors={['#7B00FF', '#B200FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}>
          <Text style={styles.buttonText}>Check Payments</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Money Bag Icon - Right side */}
      <Image source={require('../../assets/home/money.png')} style={styles.icon} />
    </View>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', // light gray background
    borderRadius: 20,
    padding: 20,
    marginVertical: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
    color: '#000',
  },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    width: 110,
    height: 110,
    position: 'absolute',
    right: 10,
    top: '30%',
    resizeMode: 'contain',
  },
});
