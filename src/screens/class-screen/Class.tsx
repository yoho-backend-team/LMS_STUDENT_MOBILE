import {  StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { COLORS } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header';
import Live from '~/components/Classes/Live';

function Class() {
  const navigation = useNavigation<any>();

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        {/* code inside the view section*/}
        <View>
          <Live />
        </View>
      </SafeAreaView>
    </>
  );
}

export default Class;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
});
