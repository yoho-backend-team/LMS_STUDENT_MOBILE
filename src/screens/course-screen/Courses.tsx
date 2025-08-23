import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/store/store';
import { getStudentcourse } from '~/features/Courses/Reducers/thunks';


// 1. Define your stack params
type RootStackParamList = {
  Courses: undefined;
  CourseViewScreen: { course: Course };
};

// 2. Define course type
type Course = {
  id: number;
  title: string;
  description: string;
  modules: string;
  duration: string;
  image: any;
};

// 3. Tell TS what navigation type this screen uses
type CoursesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Courses'
>;

const Courses = () => {
  const navigation = useNavigation<CoursesScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const courses: Course[] = [
    {
      id: 1,
      title: 'MERN STACK',
      description:
        'A MERN Stack Developer Is Responsible For Front-End And Back-End Development, Database Management, Integration And Deployment, Bug Fixing, And Working With Cross-Functional Teams.',
      modules: '1 Modules',
      duration: '30 Days Hours',
      image: require('../../assets/courses/course grp.png'),
    },
    {
      id: 2,
      title: 'PYTHON',
      description:
        'A Python Developer Is Responsible For Back-End Development,Bug Fixing, And Working With Cross-Functional Teams.',
      modules: '3 Modules',
      duration: '35 Days Hours',
      image: require('../../assets/courses/course grp.png'),
    },
  ];




  useEffect(() => {
		const fetchData = async () => {
			const instituteId = GetLocalStorage('instituteId');
			const branchId = GetLocalStorage('branchId');
			try {
				const params = {
					instituteuuid: instituteId,
					branchuuid: branchId,
					courseId: '67a0bd83a0af9570a36c499d',
				};
				await dispatch(getStudentcourse(params));
			} catch (error) {
				console.error('Course fetch error:', error);
			}
		};

		fetchData();
	}, [dispatch]);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.heading}>Courses</Text>

          {courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('CourseViewScreen', { course })
              }
            >
              <View style={styles.card}><Image
                source={course.image}
                style={styles.courseImage}
                resizeMode="contain"
              />
               </View>
              <Text style={styles.title}>{course.title}</Text>
              <Text style={styles.description}>{course.description}</Text>

              <View style={styles.footer}>
                <View style={styles.footerItem}>
                 <Image source={require("../../assets/courses/modules.png")} style={{width:24,height:24}}/>
                                   <Text style={styles.footerText}>{course.modules}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Image source={require("../../assets/courses/Alarm.png")} style={{width:24,height:24}}/>
                  <Text style={styles.footerText}>{course.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ marginTop: 70 }}></View>
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
    backgroundColor: "#ebeff3",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ebeff3', // light gray
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
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
    // backgroundColor: '#E5E7EB',
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
