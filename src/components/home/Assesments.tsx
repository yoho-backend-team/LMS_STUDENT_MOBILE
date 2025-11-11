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
  const [activeTab, setActiveTab] = useState<'Total' | 'Pending' | 'Completed'>('Total');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const storedStudent = await AsyncStorage.getItem('StudentData');
        if (storedStudent) {
          const parsedStudent = JSON.parse(storedStudent);
          const id = parsedStudent?._id;
          const courseId = parsedStudent?.userDetail?.course;

          dispatch(getdashboardassementthunk({ studentId: id, courseId: courseId }) as any);
        }
      } catch (error) {
        console.log('Error fetching Student Data:', error);
      }
    };

    fetchStudentData();
  }, [dispatch]);

  // ✅ Destructure with safe fallback
  const total = assessmentData?.total ?? 0;
  const pending = assessmentData?.pending ?? 0;
  const completed = assessmentData?.completed ?? 0;

  // Calculate display values based on active tab
  const { displayValue, displayLabel, progress, activeColor } = useMemo(() => {
    const totalVal = assessmentData?.total ?? 0;
    const pendingVal = assessmentData?.pending ?? 0;
    const completedVal = assessmentData?.completed ?? 0;

    if (activeTab === 'Total') {
      return {
        displayValue: totalVal,
        displayLabel: 'Total',
        progress: 100, // Always 100% for total
        activeColor: CHART_COLORS.primary,
      };
    }

    if (activeTab === 'Pending') {
      const percentage = totalVal > 0 ? Math.round((pendingVal / totalVal) * 100) : 0;
      return {
        displayValue: pendingVal,
        displayLabel: 'Pending',
        progress: percentage,
        activeColor: CHART_COLORS.secondary,
      };
    }

    if (activeTab === 'Completed') {
      const percentage = totalVal > 0 ? Math.round((completedVal / totalVal) * 100) : 0;
      return {
        displayValue: completedVal,
        displayLabel: 'Completed',
        progress: percentage,
        activeColor: CHART_COLORS.blue,
      };
    }

    return {
      displayValue: 0,
      displayLabel: '-',
      progress: 0,
      activeColor: CHART_COLORS.primary,
    };
  }, [assessmentData, activeTab]);

  // Generate chart points based on active tab percentage
  const chartWidth = width - 80;
  const chartHeight = 120;
  const chartPoints = useMemo(() => {
    // Use the progress percentage from active tab
    const progressPercentage = progress / 100;

    const baseHeight = 90; // Start from bottom
    const maxVariation = 60; // How much the line can vary

    // Create points that reflect the current progress percentage
    // The line height will scale with the progress percentage
    return [
      { x: 30, y: baseHeight - progressPercentage * 10 },
      { x: 70, y: baseHeight - progressPercentage * 25 },
      { x: 110, y: baseHeight - progressPercentage * 15 },
      { x: 150, y: baseHeight - progressPercentage * 35 },
      { x: 190, y: baseHeight - progressPercentage * 45 },
      { x: 230, y: baseHeight - progressPercentage * 55 },
      { x: 270, y: baseHeight - progressPercentage * maxVariation },
    ];
  }, [progress]); // Only depend on progress

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

  // Get gradient colors based on active tab
    const getGradientColors = (): readonly [string, string] => {
      switch (activeTab) {
        case 'Total':
          return ['#00BFA5', '#40E0D0'] as const;
        case 'Completed':
          return ['#2196F3', '#64B5F6'] as const;
        case 'Pending':
          return ['#40E0D0', '#2196F3'] as const;
        default:
          return ['#00BFA5', '#40E0D0'] as const;
      }
    };

  // Get background gradient colors based on active tab
    const getBackgroundGradient = (): readonly [string, string] => {
      switch (activeTab) {
        case 'Total':
          return ['#F8FDFC', '#E0F7FA'] as const;
        case 'Completed':
          return ['#F3F9FF', '#E3F2FD'] as const;
        case 'Pending':
          return ['#F0FDFA', '#E0F7FA'] as const;
        default:
          return ['#F8FDFC', '#E0F7FA'] as const;
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessments</Text>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <LinearGradient
          colors={getBackgroundGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chartBackground}
        />

        <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
          {/* Chart line with dynamic color based on active tab */}
          <Path
            d={generatePath(chartPoints)}
            stroke={activeColor}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Chart points with dynamic color */}
          {chartPoints.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={5}
              fill={CHART_COLORS.white}
              stroke={activeColor}
              strokeWidth={3}
            />
          ))}
        </Svg>

        {/* Progress Percentage Circle with dynamic color */}
        <View style={styles.percentageContainer}>
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{progress}%</Text>
            <Text style={styles.percentageLabel}>{displayLabel}</Text>
          </LinearGradient>
        </View>

        {/* Data summary overlay */}
        <View style={styles.dataOverlay}>
          <View style={styles.dataPoint}>
            <Text style={[styles.dataValue, activeTab === 'Total' && { color: activeColor }]}>
              {total}
            </Text>
            <Text style={styles.dataLabel}>Total</Text>
          </View>
          <View style={styles.dataPoint}>
            <Text style={[styles.dataValue, activeTab === 'Completed' && { color: activeColor }]}>
              {completed}
            </Text>
            <Text style={styles.dataLabel}>Completed</Text>
          </View>
          <View style={styles.dataPoint}>
            <Text style={[styles.dataValue, activeTab === 'Pending' && { color: activeColor }]}>
              {pending}
            </Text>
            <Text style={styles.dataLabel}>Pending</Text>
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
            colors={activeTab === 'Total' ? getGradientColors() : (['#B2DFDB', '#E0F7FA'] as const)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image source={require('../../assets/home/chart.png')} style={styles.profileicon} />
            <Text
              style={[styles.categoryText, activeTab !== 'Total' && { color: CHART_COLORS.text }]}>
              Total ({total})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Completed */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('Completed')}>
          <LinearGradient
            colors={activeTab === 'Completed' ? getGradientColors() : (['#C5CAE9', '#E8EAF6'] as const)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image
              source={require('../../assets/home/task-square.png')}
              style={styles.profileicon}
            />
            <Text
              style={[
                styles.categoryText,
                activeTab !== 'Completed' && { color: CHART_COLORS.text },
              ]}>
              Completed ({completed})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Pending */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('Pending')}>
          <LinearGradient
            colors={activeTab === 'Pending' ? getGradientColors() : (['#BBDEFB', '#E3F2FD'] as const)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image
              source={require('../../assets/home/clipboard-text.png')}
              style={styles.profileicon}
            />
            <Text
              style={[
                styles.categoryText,
                activeTab !== 'Pending' && { color: CHART_COLORS.text },
              ]}>
              Pending ({pending})
            </Text>
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
    height: 160,
    marginBottom: 20,
    position: 'relative',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  chartBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  svg: {
    position: 'absolute',
    top: 25,
    left: 20,
  },
  percentageContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  percentageCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  percentageText: {
    color: CHART_COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  percentageLabel: {
    color: CHART_COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginTop: -2,
  },
  dataOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataPoint: {
    alignItems: 'center',
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CHART_COLORS.lightText,
  },
  dataLabel: {
    fontSize: 10,
    color: CHART_COLORS.lightText,
    marginTop: -2,
    fontWeight: '500',
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: CHART_COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileicon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

export default AssessmentsChart;
