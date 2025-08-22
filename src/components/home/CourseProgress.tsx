import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { COLORS } from '~/constants';

const CHART_COLORS = {
  primary: '#7B00FF',
  secondary: '#B200FF',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#999999',
  white: '#FFFFFF',
  gray: '#E0E0E0',
  lightGray: '#F0F0F0',
};

interface CourseProgressData {
  progress: number; // Progress percentage (0-100)
  batchName: string;
}

interface CoursesProgressChartProps {
  data?: CourseProgressData;
}

const CoursesProgressChart: React.FC<CoursesProgressChartProps> = ({
  data = {
    progress: 50,
    batchName: 'Batch A',
  },
}) => {
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - (data.progress / 100) * circumference;

  // Calculate sun and moon positions
  const centerX = size / 2;
  const centerY = size / 2;

  // Sun position (start - top of circle) - on the progress line
  const sunAngle = -Math.PI / 2; // -90 degrees (top)
  const sunX = centerX + radius * Math.cos(sunAngle);
  const sunY = centerY + radius * Math.sin(sunAngle);

  // Moon position (based on progress) - on the progress line
  const progressAngle = -Math.PI / 2 + (data.progress / 100) * 2 * Math.PI;
  const moonX = centerX + radius * Math.cos(progressAngle);
  const moonY = centerY + radius * Math.sin(progressAngle);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Courses Progress</Text>

      {/* Circular Progress Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.progressContainer}>
          <Svg width={size + 40} height={size + 40}>
            {/* Background circle */}
            <Circle
              cx={(size + 40) / 2}
              cy={(size + 40) / 2}
              r={radius}
              stroke={CHART_COLORS.lightGray}
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress circle */}
            <Circle
              cx={(size + 40) / 2}
              cy={(size + 40) / 2}
              r={radius}
              stroke={CHART_COLORS.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${(size + 40) / 2} ${(size + 40) / 2})`}
            />
          </Svg>

          {/* Sun Icon */}
          <View
            style={[
              styles.iconContainer,
              styles.sunContainer,
              {
                left: sunX + 20 - 16,
                top: sunY + 20 - 16,
              },
            ]}>
            <Image
              source={require('../../assets/home/moon.png')}
              style={{ width: 30, height: 30 }}
            />
          </View>

          {/* Moon Icon */}
          <View
            style={[
              styles.iconContainer,
              styles.moonContainer,
              {
                left: moonX + 20 - 16,
                top: moonY + 20 - 16,
              },
            ]}>
            <Image
              source={require('../../assets/home/sun.png')}
              style={{ width: 30, height: 30 }}
            />
          </View>

          {/* Center Content */}
          <View style={styles.centerContent}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{data.progress}%</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.batchButton}>
          <Text style={styles.batchText}>{data.batchName}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CHART_COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  chartContainer: {
    alignItems: 'center',
  },
  progressContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  sunContainer: {},
  moonContainer: {},
  sunIcon: {
    fontSize: 16,
    color: COLORS.white,
  },
  moonIcon: {
    fontSize: 16,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: CHART_COLORS.lightText,
    marginBottom: 4,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: CHART_COLORS.primary,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchButton: {
    paddingVertical: 8,
  },
  batchText: {
    fontSize: 18,
    fontWeight: '600',
    color: CHART_COLORS.primary,
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  registerText: {
    fontSize: 16,
    color: CHART_COLORS.lightText,
    fontWeight: '500',
  },
});

export default CoursesProgressChart;
