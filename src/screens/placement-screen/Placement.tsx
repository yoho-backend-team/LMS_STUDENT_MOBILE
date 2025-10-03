import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacementthunks } from '~/features/placements/reducer/thunks';
import { selectPlacementData } from '~/features/placements/reducer/selectors';
import { getStudentData } from '~/utils/storage';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '~/constants';

const ITEMS_PER_PAGE = 10;

const Placement = ({ navigation }: any) => {
  const [student, setStudent] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const placementData: any = useSelector<any>(selectPlacementData);

  // fetch logged student
  useEffect(() => {
    (async () => {
      const data = await getStudentData();
      setStudent(data);
    })();
  }, []);

  // fetch placements once student available
  const fetchPlacements = useCallback(() => {
    if (student) {
      dispatch(getPlacementthunks({ studentId: student?._id }) as any);
    }
  }, [dispatch, student]);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  // pagination logic
  const totalPages = Math.ceil((placementData?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = placementData?.slice(startIndex, endIndex) || [];

  const renderItem = ({ item }: any) => {
    const interviewDate = dayjs(item?.schedule?.interviewDate);
    const today = dayjs();
    const isExpired = interviewDate.isBefore(today, 'day'); // check only by day

    return (
      <View style={styles.card}>
        <Row label="Job Name" value={item?.job?.name} />
        <Row label="Job Description" value={item?.job?.description} />
        <Row label="Interview Date" value={interviewDate.format('DD-MM-YYYY')} />
        <Row label="Company Name" value={item?.company?.name} />
        <Row label="Venue" value={item?.schedule?.venue} />

        {/* Conditional Button */}
        {isExpired ? (
          <View style={[styles.viewBtn, { backgroundColor: COLORS.bg_Colour }]}>
            <Text style={[styles.viewText, { color: COLORS.text_desc }]}>Expired</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate('PlacementViewScreen', { placement: item })}>
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // load next / prev
  const loadNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const loadPrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    fetchPlacements();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headercontent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require('../../assets/icons/Placement/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.header}>Placement Details</Text>
      </View>

      {currentData?.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No Placement Available</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Pagination at Bottom */}
      <View style={styles.pagination}>
        <LinearGradient
          colors={currentPage === 1 ? ['#E0E0E0', '#E0E0E0'] : ['#7B00FF', '#B200FF']}
          start={{ x: 0.134, y: 0.021 }}
          end={{ x: 1, y: 1 }}
          style={styles.pageGradient}>
          <TouchableOpacity
            onPress={loadPrevPage}
            disabled={currentPage === 1}
            style={styles.buttonInner}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages || 1}
        </Text>

        <LinearGradient
          colors={currentPage === totalPages ? ['#E0E0E0', '#E0E0E0'] : ['#7B00FF', '#B200FF']}
          start={{ x: 0.134, y: 0.021 }}
          end={{ x: 1, y: 1 }}
          style={styles.pageGradient}>
          <TouchableOpacity
            onPress={loadNextPage}
            disabled={currentPage === totalPages}
            style={styles.buttonInner}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default Placement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
    paddingTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  colon: {
    marginHorizontal: 4,
    fontSize: 13,
    color: '#666',
  },
  value: {
    flex: 2,
    fontSize: 13,
    fontWeight: '500',
    color: '#111',
  },
  backBtn: {
    padding: 5,
  },
  viewBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#7B00FF',
    alignItems: 'center',
  },
  viewText: {
    color: '#fff',
    fontWeight: 700,
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  headercontent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  pageInfo: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pageGradient: {
    borderRadius: 6,
    overflow: 'hidden',
    minWidth: 90,
    marginHorizontal: 5,
  },
  buttonInner: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});
