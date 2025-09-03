import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, icons } from '~/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { getFileUrl, getImageUrl } from '~/utils/imageUtils';
import { formatDateMonthandYear } from '~/utils/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import { selectcoursetask } from '~/features/Courses/Reducers/selectors';
import { getStudentTask } from '~/features/Courses/Reducers/thunks';

type RootStackParamList = {
  Courses: undefined;
  CourseViewScreen: { course: any };
  TaskCard: { task: Task };
};

type Task = {
  id: number;
  course_name: string;
  description: string;
  coursemodules: string;
  duration: string;
  class_type: string;
  image: any;
  notes: any;
};

type Props = NativeStackScreenProps<RootStackParamList, 'CourseViewScreen'>;

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

// helper: get first pending module
const getCurrentModule = (modules: any[]) => {
  return modules?.find((m) => m.status === 'pending') || modules?.[0];
};

// helper: map steps
const getSteps = (modules: any[]) => {
  return modules?.map((m, index) => ({
    id: index + 1,
    title: m.title,
    description: m.description,
    status: m.status,
    video: m.video,
    icon: require('../../assets/courses/modules.png'), // default icon
  }));
};

// helper: extract YouTube ID
const extractVideoId = (url: string) => {
  if (!url) return '';
  const regex = /(?:embed\/|v=)([^&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

const CourseById: React.FC<Props> = ({ route, navigation }) => {
  const [showVideo, setShowVideo] = useState(false);
  const { course } = route?.params;
  const [activeTab, setActiveTab] = useState<'about' | 'notes' | 'tasks' | 'track'>('about');
  const dispatch: any = useDispatch();
  const taskData = useSelector(selectcoursetask);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentModule, setCurrentModule] = useState<any>(null);

  useEffect(() => {
    dispatch(getStudentTask({ course: course?._id }));
  }, [dispatch]);

  useEffect(() => {
    if (course?.coursemodules?.length) {
      const stepData = getSteps(course.coursemodules);
      setSteps(stepData);

      const firstPending = getCurrentModule(course.coursemodules);
      setCurrentModule(firstPending);
    }
  }, [course]);

  const downloadPdf = async (fileUrl: string) => {
    const PDF_URL = getFileUrl(fileUrl);
    try {
      const supported = await Linking.canOpenURL(PDF_URL);
      if (supported) {
        await Linking.openURL(PDF_URL);
      } else {
        Alert.alert('Error', 'Cannot open this PDF URL');
      }
    } catch (error) {
      console.error('Linking error:', error);
    }
  };

  const handleBackPress = () => {
    if (showVideo) {
      setShowVideo(false);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Image
            source={require('../../assets/courses/arrow.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={{ flexGrow: 1 }}>
          {['about', 'notes', 'tasks', 'track'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => {
                if (showVideo && tab !== 'track') {
                  setShowVideo(false);
                }
                setActiveTab(tab as any);
              }}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'about'
                  ? 'About'
                  : tab === 'notes'
                    ? 'Notes & Materials'
                    : tab === 'tasks'
                      ? 'Tasks & Projects'
                      : 'Course Track'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>About Course</Text>
              <View style={styles.card}>
                <Image
                  source={{ uri: getImageUrl(course?.image) }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>{course?.course_name}</Text>
              <Text style={styles.description}>{course?.description}</Text>

              <View style={styles.footer}>
                <View style={styles.footerItem}>
                  <Image
                    source={require('../../assets/courses/modules.png')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.footerText}>
                    {course.coursemodules?.length ?? '0'} modules
                  </Text>
                </View>
                <View style={styles.footerItem}>
                  <Image
                    source={require('../../assets/courses/Alarm.png')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.footerText}> {course.duration ?? 'N/A'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Course Name</Text>
                <View style={styles.card1}>
                  <Text style={styles.infoValue}>{course?.course_name ?? ''}</Text>
                </View>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Course Durations</Text>
                <View style={styles.card1}>
                  <Text style={styles.infoValue}> {course?.duration ?? ''}</Text>
                </View>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Class Type</Text>
                <View style={styles.card1}>
                  <Text style={styles.infoValue}>{course?.class_type[0] ?? ''}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes & Materials</Text>
            {course?.notes?.length ? (
              course?.notes?.map((note: any) => (
                <View key={note.id} style={styles.noteCard}>
                  <View style={styles.textRow}>
                    <Text style={styles.labelText}>File</Text>
                    <Image source={icons.pdf} />
                  </View>

                  <View style={styles.textRow}>
                    <Text style={styles.labelText}>Date</Text>
                    <Text style={styles.valueText}>{formatDateMonthandYear(note?.createdAt)}</Text>
                  </View>

                  <View style={styles.textRow}>
                    <Text style={styles.labelText}>Chapter</Text>
                    <Text style={styles.valueText}>{note?.title}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.downloadRow}
                    onPress={() => downloadPdf(note?.file)}>
                    <Text style={styles.labelText}>PDF Download</Text>
                    <Image source={icons.download} style={{ width: 55, height: 55 }} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View>
                <Text style={{ textAlign: 'center', marginTop: 200, marginBottom: 350 }}>
                  "No notes and materials available"
                </Text>
              </View>
            )}
          </View>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tasks & Projects</Text>
            {taskData?.length ? (
              taskData?.map((task: any) => (
                <TouchableOpacity
                  key={task._id}
                  style={styles.taskCard}
                  onPress={() => navigation.navigate('TaskCard', { task })}>
                  <View style={styles.textRow}>
                    <Text style={styles.taskText}>Task Name</Text>
                    <Text style={styles.taskValue}>{task.task_name.substring(0, 15)}</Text>
                  </View>

                  <View style={styles.textRow}>
                    <Text style={styles.taskText}>Deadline</Text>
                    <Text style={styles.taskValue}>{formatDateMonthandYear(task?.deadline)}</Text>
                  </View>

                  <View style={styles.textRow}>
                    <Text style={styles.taskText}>Action</Text>
                    <View
                      style={[
                        styles.statusButton,
                        task.status === 'completed' ? styles.completed : styles.pending,
                      ]}>
                      <Text style={styles.statusText}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 100 }}>"No tasks available"</Text>
            )}
          </View>
        )}

        {/* TRACK TAB */}
        {activeTab === 'track' && (
          <View>
            <Text style={styles.sectionTitle}>Course Tracks</Text>
            <View style={styles.videoCard}>
              {showVideo && currentModule?.video ? (
                <WebView
                  style={styles.webview}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsFullscreenVideo={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  source={{
                    uri: currentModule.video,
                  }}
                />
              ) : (
                <>
                  <Image
                    source={{
                      uri: currentModule?.video
                        ? `https://i.ytimg.com/vi/${extractVideoId(
                            currentModule.video
                          )}/hqdefault.jpg`
                        : 'https://via.placeholder.com/300x200?text=No+Video',
                    }}
                    style={styles.videoImage}
                  />
                  <TouchableOpacity style={styles.playBtn} onPress={() => setShowVideo(true)}>
                    <Ionicons name="play" size={24} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Timeline */}
            <View style={styles.trackCard}>
              <View style={styles.verticalLine} />

              {steps.map((step) => (
                <View key={step.id} style={styles.stepRow}>
                  <View style={[styles.sideCol, { alignItems: 'flex-start' }]}>
                    <View style={styles.bubble}>
                      <Image
                        source={{ uri: getImageUrl(course?.image) }}
                        style={styles.bubbleIcon}
                      />
                    </View>
                  </View>

                  <View style={styles.centerCol}>
                    <View
                      style={[
                        styles.dot,
                        step.status === 'pending' ? styles.dotGray : styles.dotPurple,
                      ]}
                    />
                  </View>

                  <View style={[styles.sideCol, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.sideText, { textAlign: 'right' }]}>{step.title}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={{ marginTop: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CourseById;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ebeff3' },
  scroll: { padding: 16 },
  backButton: { marginBottom: 10 },

  tabScroll: { marginBottom: 16 },
  tabButton: {
    flex: 1,
    minWidth: 130,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  activeTab: { backgroundColor: '#7B00FF' },
  tabText: { color: '#374151', fontSize: 14 },
  activeTabText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  card: {
    backgroundColor: '#ebeff3',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    ...SHADOW,
  },
  card1: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
  },
  image: { width: '100%', height: 140, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#2A2A2A' },
  description: { fontSize: 16, color: '#716F6F', marginBottom: 16 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { marginLeft: 4, fontSize: 12, color: '#716F6F' },

  infoCard: {
    backgroundColor: '#ebeff3',
    borderRadius: 12,
    padding: 12,
  },
  infoLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#2A2A2A' },
  infoValue: { fontSize: 14, color: '#716F6F' },

  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...SHADOW,
    marginBottom: 12,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  labelText: {
    fontSize: 16,
    color: '#716F6F',
    width: '50%',
  },
  valueText: {
    fontSize: 16,
    color: '#716F6F',
  },

  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  taskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOW,
  },
  taskText: { fontSize: 18, color: '#716F6F', marginBottom: 6, width: '50%' },
  taskValue: { fontSize: 16, color: '#716F6F' },
  statusButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completed: { backgroundColor: '#4ADE80' },
  pending: { backgroundColor: '#9CA3AF' },
  statusText: { color: '#fff', fontWeight: 'bold' },

  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },

  videoCard: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#ebeff3',
    ...SHADOW,
  },
  webview: { flex: 1 },
  videoImage: { width: '100%', height: '100%', borderRadius: 12 },
  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 40,
  },

  trackCard: {
    backgroundColor: '#ebeff3',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    ...SHADOW,
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '53%',
    width: 4,
    backgroundColor: '#E5E7EB',
    transform: [{ translateX: -1.5 }],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 90,
  },
  centerCol: { width: 36, alignItems: 'center', justifyContent: 'center' },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  dotPurple: { backgroundColor: '#8B5CF6' },
  dotGray: { backgroundColor: '#9CA3AF' },

  sideCol: { flex: 1, justifyContent: 'center' },
  sideText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  bubble: {
    backgroundColor: '#F9FAFB',
    borderRadius: 40,
    padding: 5,
    ...SHADOW,
  },
  bubbleIcon: { width: 35, height: 35, borderRadius: 50 },
});
