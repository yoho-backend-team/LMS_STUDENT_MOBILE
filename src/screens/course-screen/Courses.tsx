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
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { getStudentcourse } from '~/features/Courses/Reducers/thunks';
import { selectCourse } from '~/features/Courses/Reducers/selectors';
import { getImageUrl } from '~/utils/imageUtils';

type RootStackParamList = {
  Courses: undefined;
  CourseViewScreen: { course: Course };
};

type Course = {
  id: number;
  title: string;
  description: string;
  modules: string;
  duration: string;
  image: any;
};

type CoursesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Courses'>;

const Courses = () => {
  const navigation = useNavigation<CoursesScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const coursedata = useSelector(selectCourse);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          courseId: '67f3b7fcb8d2634300cc87b6',
        };
        await dispatch(getStudentcourse(params));
      } catch (error) {
        console.error('Course fetch error:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const course = coursedata?.data;
  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.heading}>Courses</Text>

          {course && (
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
                    {course.coursemodules.length ?? '0'} modules
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
          )}

          <View style={{ marginTop: 70 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#ebeff3',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ebeff3',
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
    backgroundColor: '#ebeff3',
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
});
