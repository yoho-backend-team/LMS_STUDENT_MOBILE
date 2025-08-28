// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '~/components/shared/Header';
// import { COLORS } from '~/constants';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '~/store/store';
// import { getStudentcourse } from '~/features/Courses/Reducers/thunks';
// import { selectCourse } from '~/features/Courses/Reducers/selectors';
// import { getImageUrl } from '~/utils/imageUtils';
// import { Ionicons } from '@expo/vector-icons';

// type RootStackParamList = {
//   Courses: undefined;
//   CourseViewScreen: { course: Course };
// };

// type Course = {
//   id: number;
//   title: string;
//   description: string;
//   modules: string;
//   duration: string;
//   image: any;
// };

// type CoursesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Courses'>;

// const Courses = () => {
//   const navigation = useNavigation<any>();
//   const dispatch = useDispatch<AppDispatch>();
//   const coursedata = useSelector(selectCourse);

//   const [refreshing, setRefreshing] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       const params = {
//         courseId: '67f3b7fcb8d2634300cc87b6',
//       };
//       await dispatch(getStudentcourse(params));
//     } catch (error) {
//       console.error('Course fetch error:', error);
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchData();
//     setRefreshing(false);
//   };
//   const course = coursedata?.data;

//   return (
//     <>
//       <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
//       <SafeAreaView edges={['top']} style={styles.container}>
//         <Header />

//         <ScrollView
//           style={styles.scrollContainer}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
//           <Text style={styles.heading}>Courses</Text>

//           {course && (
//             <TouchableOpacity
//               style={styles.card}
//               onPress={() => navigation.navigate('CourseViewScreen', { course })}>
//               <View style={styles.card}>
//                 <Image
//                   source={{ uri: getImageUrl(course?.image) }}
//                   style={styles.courseImage}
//                   resizeMode="contain"
//                 />
//               </View>

//               <Text style={styles.title}>{course.course_name}</Text>
//               <Text style={styles.description}>
//                 {course.description ?? 'No description available'}
//               </Text>

//               <View style={styles.footer}>
//                 <View style={styles.footerItem}>
//                   <Image
//                     source={require('../../assets/courses/modules.png')}
//                     style={{ width: 24, height: 24 }}
//                   />
//                   <Text style={styles.footerText}>
//                     {course.coursemodules.length ?? '0'} modules
//                   </Text>
//                 </View>

//                 <View style={styles.footerItem}>
//                   <Image
//                     source={require('../../assets/courses/Alarm.png')}
//                     style={{ width: 24, height: 24 }}
//                   />
//                   <Text style={styles.footerText}>{course.duration ?? 'N/A'}</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           )}
//         </ScrollView>

//         <TouchableOpacity
//           style={styles.chatbotBtn}
//           onPress={() => navigation.navigate('ChatbotScreen')}>
//           <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
//         </TouchableOpacity>
//       </SafeAreaView>
//     </>
//   );
// };

// export default Courses;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//     backgroundColor: '#ebeff3',
//   },
//   scrollContainer: {
//     flex: 1,
//     backgroundColor: '#ebeff3',
//     padding: 18,
//     marginTop: 10,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   card: {
//     backgroundColor: '#ebeff3',
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//     padding: 16,
//     marginBottom: 22,
//   },
//   courseImage: {
//     width: '100%',
//     height: 160,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2A2A2A',
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: '#716F6F',
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   footerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   footerText: {
//     marginLeft: 4,
//     fontSize: 12,
//     color: '#716F6F',
//   },
//   chatbotBtn: {
//     position: 'absolute',
//     bottom: 80,
//     right: 20,
//     backgroundColor: '#7B00FF',
//     padding: 16,
//     borderRadius: 50,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 5,
//   },
// });



// Course.tsx
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

// ======== ASSETS (edit paths to match your project) ========
const ASSETS = {
  back: require("../../assets/icons/back.png"),
  hero: require("../../assets/images/hero.jpg"),

  // left/right skill icons
  htmlcssjs: require("../../assets/icons/htmlcssjs.png"),
  react: require("../../assets/icons/react.png"),
  angular: require("../../assets/icons/angular.png"),
  node: require("../../assets/icons/node.png"),
  google: require("../../assets/icons/google.png"),
  python: require("../../assets/icons/python.png"),
  js: require("../../assets/icons/js.png"),

  // center timeline parts
  dotPurple: require("../../assets/dots/dot-purple.png"), // the small purple dot image
};

// ======== TYPES ========
type Side =
  | { kind: "icon"; icon: ImageSourcePropType; label?: string }
  | { kind: "text"; text: string };

type Step = {
  id: string;
  left: Side;
  right: Side;
  /** Position along the card (0 => top, 1 => bottom) */
  position: number;
};

// ======== DATA (edit labels per your need) ========
const STEPS: Step[] = [
  {
    id: "s1",
    left: { kind: "icon", icon: ASSETS.htmlcssjs },
    right: { kind: "text", text: "HTML, CSS,\nJavascript" },
    position: 0.11,
  },
  {
    id: "s2",
    left: { kind: "text", text: "MongoDB,\nExpress, Node" },
    right: { kind: "icon", icon: ASSETS.react, label: "React" },
    position: 0.30,
  },
  {
    id: "s3",
    left: { kind: "icon", icon: ASSETS.angular, label: "Angular" },
    right: { kind: "text", text: "React" },
    position: 0.50,
  },
  {
    id: "s4",
    left: { kind: "text", text: "Javascript" },
    right: { kind: "icon", icon: ASSETS.google, label: "Google\nDeveloper" },
    position: 0.70,
  },
  {
    id: "s5",
    left: { kind: "icon", icon: ASSETS.js, label: "Javascript" },
    right: { kind: "icon", icon: ASSETS.python, label: "Python" },
    position: 0.89,
  },
];

// ======== LAYOUT CONSTANTS ========
const { width } = Dimensions.get("window");
const SCREEN_PADDING_H = 12;
const CARD_PADDING = 16;
const CARD_HEIGHT = 520; // controls card height & dot positions
const TIMELINE_WIDTH = 10;

export default function Course() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backBtn}
            onPress={() => navigation?.goBack?.()}
          >
            <Image source={ASSETS.back} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>

          <View style={styles.tabs}>
            <TouchableOpacity activeOpacity={0.9} style={styles.tab}>
              <Text style={styles.tabTextDim}>Task & Projects</Text>
            </TouchableOpacity>

            <LinearGradient
              colors={["#8E2DE2", "#4A00E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.tab, styles.tabActive]}
            >
              <Text style={styles.tabTextActive}>Course Track</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Course Tracks</Text>

        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image source={ASSETS.hero} style={styles.hero} resizeMode="cover" />
        </View>

        {/* Track Card */}
        <View style={styles.card}>
          {/* CENTER LINE + DOTS */}
          <View style={styles.timelineWrap}>
            <View style={styles.timelineLine} />
            {STEPS.map((s) => (
              <Image
                key={`dot-${s.id}`}
                source={ASSETS.dotPurple}
                style={[
                  styles.timelineDot,
                  {
                    top: s.position * (CARD_HEIGHT - 2 * CARD_PADDING), // position within the inner area
                  },
                ]}
                resizeMode="contain"
              />
            ))}
          </View>

          {/* LEFT + RIGHT columns */}
          <View style={styles.columns}>
            {/* LEFT */}
            <View style={styles.colLeft}>
              {STEPS.map((s) => (
                <Row key={`l-${s.id}`} side={s.left} />
              ))}
            </View>

            {/* RIGHT */}
            <View style={styles.colRight}>
              {STEPS.map((s) => (
                <Row key={`r-${s.id}`} side={s.right} align="right" />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ======== Row component (left/right items) ========
const Row = ({
  side,
  align = "left",
}: {
  side: Side;
  align?: "left" | "right";
}) => {
  const isIcon = side.kind === "icon";
  return (
    <View
      style={[
        styles.row,
        align === "right"
          ? { justifyContent: "flex-start" }
          : { justifyContent: "flex-end" },
      ]}
    >
      {isIcon ? (
        <View style={styles.iconPill}>
          <Image source={side.icon} style={styles.icon} resizeMode="contain" />
          {/* Optional label under icon */}
          {"label" in side && side.label ? (
            <Text style={styles.iconLabel} numberOfLines={2}>
              {side.label}
            </Text>
          ) : null}
        </View>
      ) : (
        <Text
          style={[
            styles.rowText,
            align === "right" ? { textAlign: "left" } : { textAlign: "right" },
          ]}
          numberOfLines={2}
        >
          {"text" in side ? side.text : ""}
        </Text>
      )}
    </View>
  );
};

// ======== STYLES ========
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  container: { flex: 1, paddingHorizontal: SCREEN_PADDING_H },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabs: { flexDirection: "row", gap: 10, flex: 1 },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  tabActive: {
    shadowOpacity: 0.15,
    elevation: 3,
  },
  tabTextDim: { color: "#7C7C8A", fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: "#fff", fontSize: 12, fontWeight: "700" },

  title: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#202124",
  },

  heroWrap: {
    width: "100%",
    height: (width - SCREEN_PADDING_H * 2) * 0.45,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E9EDF3",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  hero: { width: "100%", height: "100%" },

  card: {
    marginTop: 16,
    width: "100%",
    height: CARD_HEIGHT,
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: CARD_PADDING,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  columns: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  colLeft: {
    width:
      (width - SCREEN_PADDING_H * 2 - CARD_PADDING * 2 - TIMELINE_WIDTH) / 2,
    paddingRight: 10,
    justifyContent: "space-between",
  },
  colRight: {
    width:
      (width - SCREEN_PADDING_H * 2 - CARD_PADDING * 2 - TIMELINE_WIDTH) / 2,
    paddingLeft: 10,
    justifyContent: "space-between",
  },

  // vertical timeline (absolute center)
  timelineWrap: {
    position: "absolute",
    top: CARD_PADDING,
    bottom: CARD_PADDING,
    left:
      (width - SCREEN_PADDING_H * 2) / 2 - // inner content width center
      TIMELINE_WIDTH / 2,
    width: TIMELINE_WIDTH,
    alignItems: "center",
    zIndex: 0,
  },
  timelineLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#E3E3EA",
    borderRadius: 2,
  },
  timelineDot: {
    position: "absolute",
    left: -7,
    width: 24,
    height: 24,
  },

  row: {
    height: 90,
    alignItems: "center",
    flexDirection: "row",
  },
  iconPill: {
    minWidth: 58,
    height: 58,
    borderRadius: 58,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  icon: { width: 34, height: 34 },
  iconLabel: {
    fontSize: 10,
    color: "#4A4E57",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 12,
  },
  rowText: {
    fontSize: 13,
    color: "#4A4E57",
    fontWeight: "600",
    lineHeight: 18,
  },
});
