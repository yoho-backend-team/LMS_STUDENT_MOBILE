import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import Classcards from '~/components/Classes/Onlineclasses';
import CompleteClassDetails from '~/components/Classes/Completedclass';

const ClassById = () => {
	 return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        {/* code inside the view section*/}
        <View>
     <CompleteClassDetails />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ClassById;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
});

