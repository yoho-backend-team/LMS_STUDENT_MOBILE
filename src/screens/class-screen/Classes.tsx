import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { COLORS } from '~/constants';
import Classcards from '~/components/Classes/Onlineclasses';
import { useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header';

function Classes() {
  const navigation = useNavigation<any>();

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        {/* code inside the view section*/}
        <View>
          <Classcards />
        </View>
      </SafeAreaView>
    </>
  );
}

export default Classes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
});
