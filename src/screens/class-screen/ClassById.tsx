import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import Classcards from '~/components/Classes/Onlineclasses';
import CompleteClassDetails from '~/components/Classes/Completedclass';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { selectIdClass } from '~/features/classid/reducers/selector';
import { getClassIdDetail } from '~/features/classid/reducers/thunks';

const ClassById = () => {

   const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();

	// handle backpage button function

    const classIdData = useSelector(selectIdClass);

    console.log('classIdData:',classIdData);

    useEffect(() => {
		if (id) {
			dispatch(getClassIdDetail({ 
                id,
            course: id,
            classType: 'online', }));
		}
	}, [id, dispatch]);
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

