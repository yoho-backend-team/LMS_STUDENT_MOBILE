import { useEffect, useState, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS, FONTS } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { getStudentcourse } from '~/features/Courses/Reducers/thunks';
import { selectCourse } from '~/features/Courses/Reducers/selectors';
import { getImageUrl } from '~/utils/imageUtils';
import { Ionicons } from '@expo/vector-icons';
import { getStudentData } from '~/utils/storage';
import { getStudentProfileThunk } from '~/features/Profile/reducer/thunks';
import { selectProfile } from '~/features/Profile/reducer/selectors';

const Courses = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const coursedata = useSelector(selectCourse);
  const course = coursedata?.data;
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const profileDetails = useSelector(selectProfile)?.data;

  useEffect(() => {
    (async () => {
      const data = await getStudentData();
      dispatch(getStudentProfileThunk({}));
      setStudent(data);
    })();
  }, [dispatch]);

  const fetchData = useCallback(async () => {
    if (student) {
      try {
        const params = {
          instituteId: student?.institute_id?._id,
          courseId: student?.userDetail?.course
            ? student?.userDetail?.course
            : profileDetails?.userDetail?.course?._id,
          branchId: student?.branch_id?._id,
        };
        await dispatch(getStudentcourse(params));
      } catch (error) {
        console.error('Course fetch error:', error);
      }
    }
  }, [student, profileDetails]);

  useEffect(() => {
    if (student) {
      fetchData();
    }
  }, [fetchData, student]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <View style={styles.container}>
        {/* <Header /> */}

        <ScrollView
          style={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Text style={styles.heading}>Courses</Text>

          {course ? (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('CourseViewScreen', { course })}>
              <View style={styles.card}>
                <Image
                  source={{ uri: getImageUrl(course?.image) }}
                  style={styles.courseImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title}>{course.course_name}</Text>
              <Text style={styles.description}>
                {course.description ?? 'No description available'}
              </Text>

              <View style={styles.footer}>
                <View style={styles.footerItem}>
                  <Image
                    source={require('../../assets/courses/modules.png')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.footerText}>
                    {course.coursemodules?.length ?? '0'} modules
                  </Text>
                </View>

                <View style={styles.footerItem}>
                  <Image
                    source={require('../../assets/courses/Alarm.png')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.footerText}>{course.duration ?? 'N/A'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="book-outline" size={60} color="#9CA3AF" />
              <Text style={styles.noDataText}>No courses available</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 18,
    marginTop: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    padding: 16,
    marginBottom: 22,
  },
  courseImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.bg_Colour,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#716F6F',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#716F6F',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    marginTop: 150,
  },
  noDataText: {
    marginTop: 12,
    fontWeight: '500',
    color: COLORS.text_desc,
    ...FONTS.body3,
  },
});
