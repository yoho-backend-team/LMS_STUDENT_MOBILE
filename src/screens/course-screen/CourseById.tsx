
// import  { useMemo } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// const CARD_BG = '#FFFFFF';
// const TEXT_DARK = '#292D32';

// const SHADOW = {
//   ...Platform.select({
//     ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
//     android: { elevation: 6 },
//   }),
// };


// const safeUri = (v: any) => {
//   const s = String(v ?? '').trim();
//   return s.length ? s : null;
// };

// export default function CourseByIdScreen() {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();

  
//   const course = route?.params?.course ?? null;

//   const title = useMemo(
//     () =>
//       course?.course_name ||
//       course?.title ||
//       course?.name ||
//       'Course Details',
//     [course]
//   );

  
//   const bannerUri =
//     safeUri(course?.image) ||
//     safeUri(course?.thumbnail) ||
//     safeUri(course?.banner) ||
//     safeUri(course?.coverUrl) ||
//     null;

//   return (
//     <View style={styles.root}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <TouchableOpacity
//           style={styles.backBtn}
//           activeOpacity={0.8}
//           onPress={() => navigation.goBack()}
//         >
//           <Image source={require('../../assets/courses/arrow.png')} style={styles.backIcon} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{title}</Text>
//       </View>

      
//       <View style={styles.bannerCard}>
//         <Image
//           source={
//             bannerUri
//               ? { uri: bannerUri }
//               : require('../../assets/courses/image2.png') 
//           }
//           style={styles.bannerImage}
//           resizeMode="cover"
//         />
//       </View>

      
//       {course?.description ? (
//         <View style={styles.descCard}>
//           <Text style={styles.descTitle}>Overview</Text>
//           <Text style={styles.descText}>{course.description}</Text>
//         </View>
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#EBEFF3', padding: 16 },

//   headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
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
//   headerTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },

//   bannerCard: {
//     borderRadius: 14,
//     overflow: 'hidden',
//     backgroundColor: CARD_BG,
//     ...SHADOW,
//   },
//   bannerImage: { width: '100%', height: width * 0.55 },

//   descCard: {
//     marginTop: 16,
//     padding: 14,
//     borderRadius: 14,
//     backgroundColor: CARD_BG,
//     ...SHADOW,
//   },
//   descTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK, marginBottom: 6 },
//   descText: { fontSize: 14, color: '#6B6E76', lineHeight: 20 },
// });

import React, { useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseById } from '~/features/Courses/Reducers/thunks';
import { selectCourseState } from '~/features/Courses/Reducers/selectors';

const { width } = Dimensions.get('window');
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#292D32';

const SHADOW = {
  ...Platform.select({ ios:{shadowColor:'#000',shadowOpacity:0.08,shadowRadius:12,shadowOffset:{width:0,height:6}}, android:{elevation:6} }),
};

const safeUri = (v: any) => { const s = String(v ?? '').trim(); return s.length ? s : null; };

export default function CourseByIdScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch<any>();

  const { instituteId, branchId, courseId } = route.params || {};
  const { data, loading, error } = useSelector(selectCourseState);

  useEffect(() => {
    if (instituteId && branchId && courseId) {
      console.log("🚀 dispatching getCourseById with:", { instituteId, branchId, courseId });
      dispatch(getCourseById({ instituteId, branchId, courseId }));
    } else {
      console.warn("⚠ Missing IDs in route.params", route.params);
    }
  }, [dispatch, instituteId, branchId, courseId]);

  const course = useMemo(() => (data?.course ? data.course : data) ?? null, [data]);

  const title = useMemo(
    () => course?.course_name || course?.title || course?.name || (loading ? 'Loading…' : 'Course Details'),
    [course, loading]
  );

  const bannerUri =
    safeUri(course?.image) ||
    safeUri(course?.thumbnail) ||
    safeUri(course?.banner) ||
    safeUri(course?.coverUrl) ||
    null;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/courses/arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {error ? <Text style={{ color: 'crimson', marginBottom: 8 }}>{error}</Text> : null}

      {/* Banner */}
      <View style={styles.bannerCard}>
        <Image
          source={bannerUri ? { uri: bannerUri } : require('../../assets/courses/image2.png')}
          style={styles.bannerImage}
          resizeMode="cover"
          onError={(e) => console.log('🚫 Banner load failed:', e?.nativeEvent)}
        />
      </View>

      {/* Overview */}
      {course?.description ? (
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>Overview</Text>
          <Text style={styles.descText}>{course.description}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EBEFF3', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: CARD_BG, alignItems: 'center', justifyContent: 'center', marginRight: 10, ...SHADOW },
  backIcon: { width: 18, height: 18, resizeMode: 'contain' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  bannerCard: { borderRadius: 14, overflow: 'hidden', backgroundColor: CARD_BG, ...SHADOW },
  bannerImage: { width: '100%', height: width * 0.55 },
  descCard: { marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: CARD_BG, ...SHADOW },
  descTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK, marginBottom: 6 },
  descText: { fontSize: 14, color: '#6B6E76', lineHeight: 20 },
});