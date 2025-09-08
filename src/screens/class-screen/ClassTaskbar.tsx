import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '~/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { getClassIdDetail } from '~/features/classid/reducers/thunks';
import { useRoute } from '@react-navigation/native';
import ClassDetails from '~/components/Classes/Complete';

const ClassTaskbar = () => {
  const route = useRoute<any>();
  const { classData } = route?.params || {};
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (classData?.uuid) {
      dispatch(
        getClassIdDetail({
          id: classData?.uuid,
          course: classData?.course_uuid || '',
          classType: 'online',
        })
      );
    }
  }, [classData, dispatch]);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{ flex: 1 }}>
          <ClassDetails />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ClassTaskbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: COLORS.white,
  },
});
