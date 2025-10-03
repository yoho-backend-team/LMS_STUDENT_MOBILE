import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '~/utils/formatDate';
import { getImageUrl } from '~/utils/imageUtils';

const PlacementViewScreen = ({ route, navigation }: any) => {
  const { placement } = route?.params;

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Image
              source={require('../../assets/icons/Placement/back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.header}>Placement</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <Image
            source={
              placement?.company?.image
                ? { uri: getImageUrl(placement?.company?.image) }
                : require('../../assets/icons/Placement/placementimg.png')
            }
            style={styles.image}
          />

          {/* Company Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Company Details</Text>
            <Row label="Company Name" value={placement?.company?.name} />
            <Row label="Company Address" value={placement?.company?.address} />
            <Row label="Contact Email" value={placement?.company?.email} />
            <Row label="Contact Number" value={placement?.company?.phone} />
          </View>

          {/* Job Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <Row label="Job Name" value={placement?.job?.name} />
            <Row label="Job Description" value={placement?.job?.description} />
            <Row label="Skills" value={placement?.job?.skills?.join(', ') || 'N/A'} />
          </View>

          {/* Interview Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Interview Details</Text>
            <Row label="Interview Date" value={formatDate(placement?.schedule?.interviewDate)} />
            <Row label="Venue" value={placement?.schedule?.venue} />
            <Row label="Address" value={placement?.schedule?.address} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default PlacementViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f6f8fb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backBtn: {
    padding: 5,
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginLeft: -2,
    color: '#000',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
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
