// Payment.tsx (updated)
import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '~/constants';
import StudentPayment from '~/components/shared/StudentPayment/StudentPayment';

const Payment = () => {
  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.content}>
          <StudentPayment />
        </View>
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
  content: {
    flex: 1,
  },
});