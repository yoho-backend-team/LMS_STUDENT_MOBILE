import React, { useEffect } from 'react';
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
import placementimg from '../../assets/icons/Placement/placementimg.png';
import backIcon from '../../assets/icons/Placement/back.png';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacementthunks } from '~/features/placements/reducer/thunks';
import { selectPlacementData } from '~/features/placements/reducer/selectors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs'

const Placement = ({ navigation }: any) => {

const fetchPlacement = async ()=>{
        const stuId = JSON.parse(await AsyncStorage.getItem("StudentData") as any)
        console.log(stuId._id, 'student')
        dispatch(getPlacementthunks({studentId:stuId._id}) as any);
}


  const dispatch = useDispatch();
  const placementData:any = useSelector<any>(selectPlacementData);
  console.log('data', placementData)
    useEffect(() => {
      fetchPlacement()
    }, [dispatch]);
  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.header}>Placement</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <Image source={placementimg} style={styles.image} />

          {/* Company Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Company Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Company Name</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.company?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Company Address</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.company?.address}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Email</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.company?.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.company?.phone}</Text>
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Job Name</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.job?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Job Description</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.job?.description}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Skills</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.job?.skils?.join(",")}</Text>
            </View>
          </View>

          {/* Interview Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Interview Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Interview Date</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{}{dayjs(placementData[0]?.schedule?.interviewDate).format("DD-MMM-YYYY")}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Venue</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.schedule?.venue}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{placementData[0]?.schedule?.address}</Text>
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
