import React from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/shared/Header';
import { COLORS, FONTS } from '../../constants';
import Svg, { Circle } from "react-native-svg"
import CoursesProgress from '~/components/home/CourseProgress';
import CoursesProgressChart from '~/components/home/CourseProgress';
import AttendanceChart from '~/components/home/Attendance';
import PaymentCard from '~/components/home/Payment';
import AssessmentsChart from '~/components/home/Assesments';
import UpdatesScreen from '~/components/home/UpdateScreen';
import { useNavigation } from '@react-navigation/native';


// Custom Progress Circle Component
type ProgressCircleProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

const ProgressCircle = ({ percentage, size = 80, strokeWidth = 8, color = "#8A2BE2" }: ProgressCircleProps) => {
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
  const navigation = useNavigation(); 
  // Sample data for the cards
  const statsCards = [
    {
      title: "Total Classes",
      value: "19",
      icon: require("../../assets/home/card1icon.png"),
      color: "#22D3EE",
      bgColor: "#fff"
    },
    {
      title: "Completed",
      value: "12", //value inside graph
      icon: require("../../assets/home/card2icon.png"),
      color: "#10B981",
      bgColor: "#fff"
    },
    {
      title: "Pending",
      value: "04",
      icon: require("../../assets/home/card3img.png"),
      color: "#8B5CF6",
      bgColor: "#fff"
    },
    {
      title: "Live Class",
      value: "08",
      icon: require("../../assets/home/card4img.png"),
      color: "#EC4899",
      bgColor: "#fff"
    },
    {
      title: "Online Class",
      value: "11",
      icon: require("../../assets/home/card5img.png"),
      color: "#6366F1",
      bgColor: "#fff"
    },
    {
      title: "Offline Class",
      value: "11",
      icon: require("../../assets/home/card6img.png"),
      color: "#F59E0B",
      bgColor: "#fff"
    }
  ];

  const classData = [
    { day: "Day", topic: "HTML", link: "Www.Google.Com", duration: "45 Min", action: "Join Now" },
    { day: "Day 1", topic: "HTML", link: "Www.Google.Com", duration: "45 Min", action: "Join Now" },
    { day: "Day 1", topic: "HTML", link: "Www.Google.Com", duration: "45 Min", action: "Join Now" }
  ];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerBox}>
            <Text style={styles.header}>Classes</Text>
            
            {/* Profile Card */}
            <View style={styles.card}>
              <Image
                source={require("../../assets/home/profile.png")}
                style={styles.imageStyle}
              />
              <View style={styles.info}>
                <Text style={styles.name}>Albert Einstein</Text>
                <Text style={styles.id}>Trainee ID: LMS1234</Text>
              </View>
              <Pressable onPress={()=>{navigation.navigate("Profile" as never)}} style={styles.button}>
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
                   <View style={[styles.iconContainer,{ backgroundColor: item.color }]}>
                    <Image source={item.icon} style={styles.statsIcon} />
                  </View>
                  </View>
                  <View style={styles.progress}>
                    <ProgressCircle 
                  percentage={parseInt(item.value) * 3} 
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
          <CoursesProgressChart/>
          {/* attendance */}
          <AttendanceChart/>
          {/* payment */}
          <PaymentCard/>
          {/* assessments */}
          <AssessmentsChart/>
          {/* update */}
          <UpdatesScreen/>
          <View style={{ marginBottom:30}}>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
   
  },
  headerBox: {
    backgroundColor: "#BDC2C740",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    paddingLeft: 12,
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  imageStyle: {
    width: 62,
    height: 62,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  id: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  
  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statsCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
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
    marginBottom: 5,
  },
  iconcontent:{
    position:'absolute',
    top:50,
    left:15
  },
  progress:{
    paddingLeft:80,//progreess graph position
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
 
});