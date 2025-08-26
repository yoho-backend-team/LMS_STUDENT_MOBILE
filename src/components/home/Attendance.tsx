import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectDashboardData } from '~/features/home/reducer/selectors';
import { getDashboardthunks } from '~/features/home/reducer/thunks';

// Colors
const CHART_COLORS = {
  primary: '#00BFA5',
  secondary: '#2196F3',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
};

const AttendanceChart: React.FC = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData);

  useEffect(() => {
    dispatch(getDashboardthunks({}) as any);
  }, [dispatch]);

  // Extract latest attendance entry (or default if empty)
  const latestAttendance = dashboardData?.attendance?.[0] || {
    present: { percentage: 0 },
    absent: { percentage: 0 },
    total: { percentage: 0 },
  };

  const overallAttendance = latestAttendance.total.percentage || 0;
  const daysAbsent = latestAttendance.absent.percentage || 0;
  const remainingAttendance =
   (latestAttendance.present.percentage || 0);

  // Calculate bar heights dynamically
  const getBarHeight = (value: number, maxValue: number = 100) => {
    return Math.max((value / maxValue) * 80, 8);
  };

  const barHeights = [
    getBarHeight(overallAttendance),
    getBarHeight(remainingAttendance),
    getBarHeight(daysAbsent),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>

      {/* Main Row → Chart on left, Stats on right */}
      <View style={styles.mainRow}>
        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <View style={styles.barsContainer}>
            {barHeights.map((height, index) => (
              <View key={index} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: height,
                      backgroundColor:
                        index === 0
                          ? CHART_COLORS.primary
                          : index === 1
                          ? CHART_COLORS.secondary
                          : '#00BFA5', // red for absent
                    },
                  ]}
                />
                <View
                  style={[
                    styles.baseCircle,
                    {
                      backgroundColor:
                        index === 0
                          ? CHART_COLORS.primary
                          : index === 1
                          ? CHART_COLORS.secondary
                          : '#00BFA5',
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {/* Overall Attendance */}
          <View style={styles.statItem}>
            <Image
              source={require('../../assets/home/attendance1.png')}
              style={styles.iconSquare}
            />
            <Text style={styles.statLabel}>
              Overall {overallAttendance}%
            </Text>
          </View>

          {/* Remaining Attendance */}
          <View style={styles.statItem}>
            <Image
              source={require('../../assets/home/attendance2.png')}
              style={styles.iconSquare}
            />
            <Text style={styles.statLabel}>
              {remainingAttendance}% Remaining
            </Text>
          </View>

          {/* Days Absent */}
          <View style={styles.statItem}>
            <Image
              source={require('../../assets/home/attendance3.png')}
              style={styles.iconSquare}
            />
            <Text style={styles.statLabel}>{daysAbsent}% Absent</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CHART_COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 15,
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
    marginBottom: 16,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartContainer: {
    height: 120,
    width: 100,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  baseCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  statsContainer: {
    flex: 1,
    marginLeft: 40,
    justifyContent: 'space-between',
    height: 120,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  iconSquare: {
    width: 35,
    height: 35,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  statLabel: {
    fontSize: 14,
    color: CHART_COLORS.lightText,
    fontWeight: '500',
  },
});

export default AttendanceChart;
