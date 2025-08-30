import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import CompleteClassDetails from '~/components/Classes/Completedclass';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { selectIdClass } from '~/features/classid/reducers/selector';
import { getClassIdDetail } from '~/features/classid/reducers/thunks';
import { useRoute } from '@react-navigation/native';

const ClassById = () => {
  const route = useRoute<any>();
  const { classData } = route?.params;
  const dispatch = useDispatch<AppDispatch>();
  const classIdData = useSelector(selectIdClass);

  useEffect(() => {
    if (classData) {
      dispatch(
        getClassIdDetail({
          id: classData?.uuid,
          course: classData?.uuid,
          classType: 'online',
        })
      );
    }
  }, [classData, dispatch]);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* code inside the view section*/}
        <View>
          <CompleteClassDetails classData={classIdData} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ClassById;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: COLORS.white,
  },
});
