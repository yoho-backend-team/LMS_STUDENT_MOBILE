import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '~/constants';

const Profile = () => {
	return (
		 <>
			  <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
			  <SafeAreaView edges={['top']} style={styles.container}>
				{/* code inside the view section*/}
				<View>
					
				</View>
			  </SafeAreaView>
			</>
	);
};

export default Profile;

const styles = StyleSheet.create({
	  container: {
		flex: 1,
		paddingTop: 10,
		backgroundColor: COLORS.white,
	  },
});
