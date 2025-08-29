import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/shared/Header';
import { COLORS } from '../../constants';
import Svg, { Circle } from 'react-native-svg';
import CoursesProgressChart from '~/components/home/CourseProgress';
import AttendanceChart from '~/components/home/Attendance';
import PaymentCard from '~/components/home/Payment';
import AssessmentsChart from '~/components/home/Assesments';
import UpdatesScreen from '~/components/home/UpdateScreen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectDashboardData } from '~/features/home/reducer/selectors';
import { getDashboardthunks } from '~/features/home/reducer/thunks';
import { getImageUrl } from '~/utils/imageUtils';
import { Ionicons } from '@expo/vector-icons';

// Custom Progress Circle Component
type ProgressCircleProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

const ProgressCircle = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = '#8A2BE2',
}: ProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.progressText, { width: size, height: size }]}>
        <Text style={[styles.percentageText, { color }]}>{percentage}</Text>
      </View>
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getDashboardthunks({}) as any);
  }, [dispatch]);

  // Refresh function
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getDashboardthunks({}) as any)
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, [dispatch]);

  const classStats = dashboardData?.classes?.[0] || {};

  const statsCards = [
    {
      title: 'Total Classes',
      value: classStats?.total || '0',
      icon: require('../../assets/home/card1icon.png'),
      color: '#22D3EE',
      bgColor: COLORS.white,
    },
    {
      title: 'Total Completed Claas',
      value:
        (classStats?.online_class?.completed || 0) + (classStats?.offline_class?.completed || 0),
      icon: require('../../assets/home/card6img.png'),
      color: '#6366F1',
      bgColor: COLORS.white,
    },
    {
      title: 'Completed (Liveclass)',
      value: classStats?.online_class?.completed || '0',
      icon: require('../../assets/home/card2icon.png'),
      color: '#10B981',
      bgColor: COLORS.white,
    },
    {
      title: 'Completed (Offline)',
      value: classStats?.offline_class?.completed || '0',
      icon: require('../../assets/home/card4img.png'),
      color: '#EC4899',
      bgColor: COLORS.white,
    },
    {
      title: 'Pending (LiveClass)',
      value: classStats?.online_class?.pending || '0',
      icon: require('../../assets/home/card3img.png'),
      color: '#8B5CF6',
      bgColor: COLORS.white,
    },

    {
      title: 'Pending (Offline)',
      value: classStats?.offline_class?.pending || '0',
      icon: require('../../assets/home/card5img.png'),
      color: '#F59E0B',
      bgColor: COLORS.white,
    },
  ];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.black]}
              tintColor={COLORS.black}
            />
          }>
          <View style={styles.headerBox}>
            <Text style={styles.header}>Classes</Text>

            {/* Profile Card */}
            <View style={styles.card}>
              <Image
                source={
                  dashboardData?.user?.image
                    ? { uri: getImageUrl(dashboardData?.user.image) }
                    : require('../../assets/home/profile.png')
                }
                style={styles.imageStyle}
              />

              <View style={styles.info}>
                <Text style={styles.name}>
                  {dashboardData?.user?.full_name ||
                    `${dashboardData?.user?.first_name} ${dashboardData?.user?.last_name}`}
                </Text>
                <Text style={styles.id}>Student ID: {dashboardData?.user?.roll_no || 'N/A'}</Text>
              </View>

              <Pressable
                onPress={() => navigation.navigate('Profile' as never)}
                style={styles.button}>
                <Text style={styles.buttonText}>View Profile</Text>
              </Pressable>
            </View>

            {/* Stats Cards Grid */}
            <View style={styles.statsGrid}>
              {statsCards.map((item, index) => (
                <View key={index} style={[styles.statsCard, { backgroundColor: item.bgColor }]}>
                  <View style={styles.statsHeader}>
                    <Text style={styles.statsTitle}>{item.title}</Text>
                  </View>
                  <View style={styles.iconcontent}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                      <Image source={item.icon} style={styles.statsIcon} />
                    </View>
                  </View>
                  <View style={styles.progress}>
                    <ProgressCircle
                      percentage={parseInt(item.value)}
                      size={60}
                      strokeWidth={8}
                      color={item.color}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Course Progress Section */}
          <CoursesProgressChart />
          {/* attendance */}
          <AttendanceChart />
          {/* payment */}
          <PaymentCard />
          {/* assessments */}
          <AssessmentsChart />
          {/* update */}
          <UpdatesScreen />
          <View style={{ marginBottom: 30 }}></View>
        </ScrollView>
        <TouchableOpacity
          style={styles.chatbotBtn}
          onPress={() => navigation.navigate('ChatbotScreen')}>
          <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: 10,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerBox: {
    backgroundColor: '#BDC2C740',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingLeft: 12,
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  imageStyle: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  id: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconcontent: {
    position: 'absolute',
    top: 50,
    left: 15,
  },
  progress: {
    paddingLeft: 80,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
  },

  // Progress Section Styles
  progressText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatbotBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#7B00FF',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
