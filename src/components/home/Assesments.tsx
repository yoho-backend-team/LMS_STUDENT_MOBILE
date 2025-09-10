import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getdashboardassementthunk } from '~/features/home/reducer/thunks';
import { selectAssessmentData } from '~/features/home/reducer/selectors';

const { width } = Dimensions.get('window');

const CHART_COLORS = {
  primary: '#00BFA5',
  secondary: '#40E0D0',
  blue: '#2196F3',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
  gray: '#E0E0E0',
};

type AssessmentTrack = {
  total: number;
  pending: number;
  completed: number;
};

const AssessmentsChart: React.FC = () => {
  const dispatch = useDispatch();
  const assessmentData = useSelector(selectAssessmentData) as AssessmentTrack | null;
  const [studentID, setStudentID] = useState<string | null>(null);
  const [courseID, setCourseID] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Total' | 'Pending' | 'Completed'>('Total');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const storedStudent = await AsyncStorage.getItem('StudentData');
        if (storedStudent) {
          const parsedStudent = JSON.parse(storedStudent);
          const id = parsedStudent?.uuid;
          const courseId = parsedStudent?.userDetail?.course;

          setStudentID(id);
          setCourseID(courseId);
          dispatch(getdashboardassementthunk({ student: id, course: courseId }) as any);
        }
      } catch (error) {
        console.log('Error fetching Student Data:', error);
      }
    };

    fetchStudentData();
  }, [dispatch]);

  // Calculate totals safely
  const { total, pending, completed, progress } = useMemo(() => {
    const total = assessmentData?.total ?? 0;
    const pending = assessmentData?.pending ?? 0;
    const completed = assessmentData?.completed ?? 0;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, completed, progress };
  }, [assessmentData]);

  // Fake chart points (replace with real API points if needed)
  const chartWidth = width - 80;
  const chartHeight = 120;
  const chartPoints = [
    { x: 20, y: 80 },
    { x: 60, y: 40 },
    { x: 100, y: 60 },
    { x: 140, y: 30 },
    { x: 180, y: 45 },
    { x: 220, y: 25 },
    { x: 260, y: 35 },
  ];

  const generatePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const cpx = (previous.x + current.x) / 2;
      path += ` Q ${cpx} ${previous.y} ${current.x} ${current.y}`;
    }
    return path;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessments</Text>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
          <Path
            d={generatePath(chartPoints)}
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartPoints.map((point, index) => (
            <Circle key={index} cx={point.x} cy={point.y} r={6} fill={CHART_COLORS.primary} />
          ))}
        </Svg>

        {/* Progress Percentage Circle */}
        <View style={styles.percentageContainer}>
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{progress}%</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        style={styles.categoriesContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}>
        {/* Total */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('Total')}>
          <LinearGradient
            colors={activeTab === 'Total' ? ['#00BFA5', '#40E0D0'] : ['#B2DFDB', '#E0F7FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image source={require('../../assets/home/chart.png')} style={styles.profileicon} />
            <Text style={styles.categoryText}>Total ({total})</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Pending */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('Pending')}>
          <LinearGradient
            colors={activeTab === 'Pending' ? ['#40E0D0', '#2196F3'] : ['#BBDEFB', '#E3F2FD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image
              source={require('../../assets/home/clipboard-text.png')}
              style={styles.profileicon}
            />
            <Text style={styles.categoryText}>Pending ({pending})</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Completed */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('Completed')}>
          <LinearGradient
            colors={activeTab === 'Completed' ? ['#2196F3', '#64B5F6'] : ['#C5CAE9', '#E8EAF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image
              source={require('../../assets/home/task-square.png')}
              style={styles.profileicon}
            />
            <Text style={styles.categoryText}>Completed ({completed})</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CHART_COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 20,
  },
  chartContainer: {
    height: 130,
    marginBottom: 20,
    position: 'relative',
    borderRadius: 12,
    padding: 16,
  },
  svg: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  percentageContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  percentageCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: CHART_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  percentageText: {
    color: CHART_COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 5,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: CHART_COLORS.white,
  },
  profileicon: {
    width: 15,
    height: 15,
    borderRadius: 12,
  },
});

export default AssessmentsChart;
