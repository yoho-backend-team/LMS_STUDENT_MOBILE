import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import placementimg from '../../assets/icons/Placement/placementimg.png';

const Placement = () => {
  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Page Title */}
          <Text style={styles.header}>Placement</Text>

          {/* Image */}
          <Image source={placementimg} style={styles.image} />

          {/* Company Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Company Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Company Name</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>Yoho Tech</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Company Address</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>2, Main Road Chennai</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Email</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>yohotech@gmail.com</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>8975894567</Text>
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Job Name</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>UI Developer</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Job Description</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>Front - End Developer</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Skills</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>Figma</Text>
            </View>
          </View>

          {/* Interview Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Interview Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Interview Date</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>28-08-2025</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Venue</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>wewjuioc/.mnb</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>OMR, Chennai</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Placement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f6f8fb',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  colon: {
    marginHorizontal: 5,
    fontSize: 13,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#111',
  },
});
