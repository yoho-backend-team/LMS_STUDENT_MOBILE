import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const items = [
  {
    title: "HTML, CSS,\nJavascript",
    icon: require("../../assets/courses/module1.png"),
    iconSide: "left",
    active: true,
  },
  {
    title: "Mongodb,\nExpress, Nodejs",
    icon: require("../../assets/courses/react1.png"),
    iconSide: "right",
    active: false,
  },
  {
    title: "React",
    icon: require("../../assets/courses/angular1.png"),
    iconSide: "left",
    active: true,
  },
  {
    title: "Angular",
    icon: require("../../assets/courses/google1.png"),
    iconSide: "right",
    active: false,
  },
  {
    title: "Google Developer",
    icon: require("../../assets/courses/js1.png"),
    iconSide: "left",
    active: true,
  },
  {
    title: "Javascript",
    icon: require("../../assets/courses/python1.png"),
    iconSide: "right",
    active: false,
  },
];

const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#292D32';
const TEXT_MUTED = '#6B6E76';

const SHADOW = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 6 },
  }),
};

const Courses: React.FC = () => {
  
  const navigation = useNavigation<any>();

  
  const instituteId = '67f3a26df4b2c530acd16419';
  const branchId   = '67f3a26ef4b2c530acd16425';
  const courseId   = '67f3b7fcb8d2634300cc87b6';

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
            <Image
              source={require("../../assets/courses/arrow.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          {/* Tabs */}
          <View style={styles.tabsWrap}>
            <View style={styles.tabsBg}>
              
              <View style={styles.inactiveTab}>
                <Text style={styles.inactiveTabText}>Task & Projects</Text>
              </View>

              
              <TouchableOpacity
                style={styles.activeTab}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('CourseById', {
                    instituteId,
                    branchId,
                    courseId,
                  })
                  
                }
              >
                <Text style={styles.activeTabText}>Course Track</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.screenTitle}>Course Tracks</Text>

        {/* Banner */}
        <View style={styles.bannerCard}>
          <Image
            source={require("../../assets/courses/image1.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Timeline Card */}
        <View style={styles.card}>
          <View style={styles.spine} />
          {items.map((row, idx) => (
            <View key={idx} style={styles.row}>
              {/* LEFT SIDE */}
              <View style={styles.side}>
                {row.iconSide === 'right' && (
                  <Text style={styles.sideText} numberOfLines={2}>
                    {row.title}
                  </Text>
                )}
                {row.iconSide === 'left' && (
                  <View style={styles.sideInner}>
                    <View style={styles.curvedIconWrap}>
                      <Image source={row.icon} style={styles.curvedIcon} />
                    </View>
                  </View>
                )}
              </View>

              {/* DOT */}
              <View style={styles.dotWrap}>
                <Image
                  source={
                    row.active
                      ? require("../../assets/courses/Vector.png")
                      : require("../../assets/courses/Vector 1.png")
                  }
                  style={styles.dotImage}
                />
              </View>

              {/* RIGHT SIDE */}
              <View style={styles.side}>
                {row.iconSide === 'left' && (
                  <Text style={styles.sideText} numberOfLines={2}>
                    {row.title}
                  </Text>
                )}
                {row.iconSide === 'right' && (
                  <View style={styles.sideInner}>
                    <View style={styles.curvedIconWrap}>
                      <Image source={row.icon} style={styles.curvedIcon} />
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Courses;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EBEFF3' },
  container: { flex: 1, paddingHorizontal: 14, paddingTop: 14 },

  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    ...SHADOW,
  },
  backIcon: { width: 18, height: 18, resizeMode: 'contain' },

  tabsWrap: { flex: 1 },
  tabsBg: {
    flexDirection: 'row',
    backgroundColor: '#EDEDF3',
    padding: 4,
    borderRadius: 16,
  },
  inactiveTab: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  inactiveTabText: { color: TEXT_MUTED, fontSize: 12.5, fontWeight: '700' },
  activeTab: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#8E2DE2',
  },
  activeTabText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },

  screenTitle: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 18.5,
    fontWeight: '800',
    color: TEXT_DARK,
  },

  bannerCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: CARD_BG,
    ...SHADOW,
  },
  bannerImage: { width: '100%', height: width * 0.36 },

  card: {
    marginTop: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#F3F4F8',
    ...SHADOW,
  },
  spine: {
    position: 'absolute',
    left: '50%',
    width: 2,
    top: 18,
    bottom: 18,
    backgroundColor: '#D3D6DE',
    transform: [{ translateX: -1 }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  side: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sideInner: { alignItems: 'center', justifyContent: 'center' },
  curvedIconWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 8,
  },
  curvedIcon: { width: 90, height: 90, resizeMode: 'contain' },
  sideText: {
    color: TEXT_DARK,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  dotWrap: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
  },
  dotImage: { width: 24, height: 24 },
});


// import React, { useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   Platform,
//   ImageSourcePropType,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';

// import { getCourseById } from '~/features/Courses/Reducers/thunks';
// import { selectCourseState } from '~/features/Courses/Reducers/selectors';

// const { width } = Dimensions.get('window');

// type Item = {
//   title: string;
//   icon: ImageSourcePropType;
//   iconSide: 'left' | 'right';
//   active: boolean;
// };

// const items: Item[] = [
//   {
//     title: 'HTML, CSS,\nJavascript',
//     icon: require('../../assets/courses/module1.png'),
//     iconSide: 'left',
//     active: true,
//   },
//   {
//     title: 'Mongodb,\nExpress, Nodejs',
//     icon: require('../../assets/courses/react1.png'),
//     iconSide: 'right',
//     active: false,
//   },
//   {
//     title: 'React',
//     icon: require('../../assets/courses/angular1.png'),
//     iconSide: 'left',
//     active: true,
//   },
//   {
//     title: 'Angular',
//     icon: require('../../assets/courses/google1.png'),
//     iconSide: 'right',
//     active: false,
//   },
//   {
//     title: 'Google Developer',
//     icon: require('../../assets/courses/js1.png'),
//     iconSide: 'left',
//     active: true,
//   },
//   {
//     title: 'Javascript',
//     icon: require('../../assets/courses/python1.png'),
//     iconSide: 'right',
//     active: false,
//   },
// ];

// const CARD_BG = '#FFFFFF';
// const TEXT_DARK = '#292D32';
// const TEXT_MUTED = '#6B6E76';

// const SHADOW = {
//   ...Platform.select({
//     ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
//     android: { elevation: 6 },
//   }),
// };

// // avoid empty-string image uri warning
// const safeUri = (v: unknown) => {
//   const s = String(v ?? '').trim();
//   return s.length ? s : null;
// };

// const Courses: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const dispatch = useDispatch<any>();

//   // Fixed IDs (உங்க values)
//   const instituteId = '67f3a26df4b2c530acd16419';
//   const branchId = '67f3a26ef4b2c530acd16425';
//   const courseId = '67f3b7fcb8d2634300cc87b6';

//   // Redux state { data, loading, error } - selector நீங்கள் முன்னாடி உருவாக்கியதே
//   const { data, loading } = useSelector(selectCourseState);

//   // mount ஆனவுடன் ஒரே API call
//   useEffect(() => {
//     dispatch(getCourseById({ instituteId, branchId, courseId }));
//   }, [dispatch, instituteId, branchId, courseId]);

  
//   const bannerSource = useMemo(() => {
//     const uri =
//       safeUri((data as any)?.banner) ||
//       safeUri((data as any)?.image) ||
//       safeUri((data as any)?.thumbnail);
//     return uri ? { uri } : require('../../assets/courses/image1.png'); 
//   }, [data]);

//   return (
//     <View style={styles.root}>
//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={{ paddingBottom: 32 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.headerRow}>
//           <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
//             <Image source={require('../../assets/courses/arrow.png')} style={styles.backIcon} />
//           </TouchableOpacity>

//           {/* Tabs */}
//           <View style={styles.tabsWrap}>
//             <View style={styles.tabsBg}>
//               <View style={styles.inactiveTab}>
//                 <Text style={styles.inactiveTabText}>Task & Projects</Text>
//               </View>

//               <TouchableOpacity
//                 style={styles.activeTab}
//                 activeOpacity={0.9}
//                 onPress={() =>
//                   navigation.navigate('CourseById', {
//                     instituteId,
//                     branchId,
//                     courseId,
//                   })
//                 }
//               >
//                 <Text style={styles.activeTabText}>Course Track</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Title */}
//         <Text style={styles.screenTitle}>Course Tracks</Text>

//         {/* Banner (API or fallback) */}
//         <View style={styles.bannerCard}>
//           <Image source={bannerSource} style={styles.bannerImage} resizeMode="cover" />
//         </View>

        
//         <View style={styles.card}>
//           <View style={styles.spine} />
//           {items.map((row, idx) => (
//             <View key={idx} style={styles.row}>
//               {/* LEFT SIDE */}
//               <View style={styles.side}>
//                 {row.iconSide === 'right' ? (
//                   <Text style={styles.sideText} numberOfLines={2}>
//                     {row.title}
//                   </Text>
//                 ) : (
//                   <View style={styles.sideInner}>
//                     <View style={styles.curvedIconWrap}>
//                       <Image source={row.icon} style={styles.curvedIcon} />
//                     </View>
//                   </View>
//                 )}
//               </View>

//               {/* DOT */}
//               <View style={styles.dotWrap}>
//                 <Image
//                   source={
//                     row.active
//                       ? require('../../assets/courses/Vector.png')
//                       : require('../../assets/courses/Vector 1.png')
//                   }
//                   style={styles.dotImage}
//                 />
//               </View>

//               {/* RIGHT SIDE */}
//               <View style={styles.side}>
//                 {row.iconSide === 'left' ? (
//                   <Text style={styles.sideText} numberOfLines={2}>
//                     {row.title}
//                   </Text>
//                 ) : (
//                   <View style={styles.sideInner}>
//                     <View style={styles.curvedIconWrap}>
//                       <Image source={row.icon} style={styles.curvedIcon} />
//                     </View>
//                   </View>
//                 )}
//               </View>
//             </View>
//           ))}
//         </View>

//         {loading ? (
//           <Text style={{ textAlign: 'center', marginTop: 10, color: TEXT_MUTED }}>Loading…</Text>
//         ) : null}
//       </ScrollView>
//     </View>
//   );
// };

// export default Courses;

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#EBEFF3' },
//   container: { flex: 1, paddingHorizontal: 14, paddingTop: 14 },

//   headerRow: { flexDirection: 'row', alignItems: 'center' },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: CARD_BG,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//     ...SHADOW,
//   },
//   backIcon: { width: 18, height: 18, resizeMode: 'contain' },

//   tabsWrap: { flex: 1 },
//   tabsBg: {
//     flexDirection: 'row',
//     backgroundColor: '#EDEDF3',
//     padding: 4,
//     borderRadius: 16,
//   },
//   inactiveTab: {
//     flex: 1,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//   },
//   inactiveTabText: { color: TEXT_MUTED, fontSize: 12.5, fontWeight: '700' },
//   activeTab: {
//     flex: 1,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//     backgroundColor: '#8E2DE2',
//   },
//   activeTabText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },

//   screenTitle: {
//     marginTop: 14,
//     marginBottom: 10,
//     fontSize: 18.5,
//     fontWeight: '800',
//     color: TEXT_DARK,
//   },

//   bannerCard: {
//     borderRadius: 14,
//     overflow: 'hidden',
//     backgroundColor: CARD_BG,
//     ...SHADOW,
//   },
//   bannerImage: { width: '100%', height: width * 0.36 },

//   card: {
//     marginTop: 16,
//     paddingVertical: 18,
//     paddingHorizontal: 12,
//     borderRadius: 18,
//     backgroundColor: '#F3F4F8',
//     ...SHADOW,
//   },

//   spine: {
//     position: 'absolute',
//     left: '50%',
//     width: 2,
//     top: 18,
//     bottom: 18,
//     backgroundColor: '#D3D6DE',
//     transform: [{ translateX: -1 }],
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     minHeight: 140,
//   },
//   side: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   sideInner: { alignItems: 'center', justifyContent: 'center' },
//   curvedIconWrap: {
//     width: 80,
//     height: 80,
//     alignItems: 'center',
//     justifyContent: 'center',
    
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//     marginBottom: 8,
//   },
//   curvedIcon: { width: 90, height: 90, resizeMode: 'contain' },
//   sideText: { color: TEXT_DARK, fontSize: 13, fontWeight: '600', textAlign: 'center' },
//   dotWrap: { width: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -20 },
//   dotImage: { width: 24, height: 24 },
// });

