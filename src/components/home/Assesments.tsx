import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

// Chart colors
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

interface AssessmentData {
  percentage: number;
  dataPoints: { x: number; y: number }[];
}

interface AssessmentsChartProps {
  data?: AssessmentData;
}

const AssessmentsChart: React.FC<AssessmentsChartProps> = ({
  data = {
    percentage: 4,
    dataPoints: [
      { x: 20, y: 80 },
      { x: 60, y: 40 },
      { x: 100, y: 60 },
      { x: 140, y: 30 },
      { x: 180, y: 45 },
      { x: 220, y: 25 },
      { x: 260, y: 35 },
    ],
  },
}) => {
  const [activeTab, setActiveTab] = useState<'average' | 'exam' | 'completed'>('average');

  // Generate SVG path for the line chart
  const generatePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];

      // Smooth curves using quadratic bezier
      const cpx = (previous.x + current.x) / 2;
      path += ` Q ${cpx} ${previous.y} ${current.x} ${current.y}`;
    }

    return path;
  };

  const chartWidth = width - 80;
  const chartHeight = 120;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessments</Text>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
          <Path
            d={generatePath(data.dataPoints)}
            stroke={CHART_COLORS.primary}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.dataPoints.map((point, index) => (
            <Circle key={index} cx={point.x} cy={point.y} r="6" fill={CHART_COLORS.primary} />
          ))}
        </Svg>

        {/* Percentage Circle */}
        <View style={styles.percentageContainer}>
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{data.percentage}%</Text>
          </View>
        </View>
      </View>

      {/* Category Buttons with Gradient */}
      <ScrollView
        style={styles.categoriesContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}>
        {/* Average */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('average')}>
          <LinearGradient
            colors={activeTab === 'average' ? ['#00BFA5', '#40E0D0'] : ['#B2DFDB', '#E0F7FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image source={require('../../assets/home/chart.png')} style={styles.profileicon} />
            <Text style={styles.categoryText}>Average</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Exam */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('exam')}>
          <LinearGradient
            colors={activeTab === 'exam' ? ['#40E0D0', '#2196F3'] : ['#BBDEFB', '#E3F2FD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image
              source={require('../../assets/home/clipboard-text.png')}
              style={styles.profileicon}
            />
            <Text style={styles.categoryText}>Exam</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Completed Task */}
        <TouchableOpacity style={styles.categoryWrapper} onPress={() => setActiveTab('completed')}>
          <LinearGradient
            colors={activeTab === 'completed' ? ['#2196F3', '#64B5F6'] : ['#C5CAE9', '#E8EAF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryButton}>
            <Image
              source={require('../../assets/home/task-square.png')}
              style={styles.profileicon}
            />
            <Text style={styles.categoryText}>Completed task</Text>
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
