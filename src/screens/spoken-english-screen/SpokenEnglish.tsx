import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '~/constants';

const SpokenEnglish = () => {
  const navigation = useNavigation<any>();

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* Header */}
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
            </TouchableOpacity>
            <Text style={styles.title}>Learning Path</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SpokenEnglish;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: COLORS.white },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text_title,
    marginBottom: 16,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});
