import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, icons } from '~/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { getFileUrl, getImageUrl } from '~/utils/imageUtils';
import { formatDateMonthandYear } from '~/utils/formatDate';
import { Linking, Alert } from 'react-native';
import TaskCard from '../../components/courses/TaskCard';

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

const CourseById: React.FC<Props> = ({ route, navigation }) => {
  const [showVideo, setShowVideo] = useState(false);
  const { course } = route?.params;
  const [activeTab, setActiveTab] = useState<'about' | 'notes' | 'tasks' | 'track'>('about');

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

  const tasksData = [
    {
      id: 1,
      instructorname: 'Kamal',
      task: 'for dashboard we need schema',
      taskname: 'Creat schema',
      deadline: '26-06-2025',
      status: 'Completed',
      question: 'why we use mongo db insted of sql',
      score: '8',
      localFilePath: 'IMG-202033885599',
    },
    {
      id: 2,
      instructorname: 'Abishek',
      task: 'Creat Api for integration',
      taskname: 'API',
      deadline: '26-06-2025',
      status: 'Pending',
      question: 'why we use reacenative  insted of java',
      score: '',
    },
    {
      id: 3,
      instructorname: 'Prakash',
      task: 'Need auth for login,logout ',
      taskname: 'Auth',
      deadline: '26-06-2025',
      status: 'Completed',
      question: 'what is the future scope of mongo db',
      score: '8',
    },
    {
      id: 4,
      instructorname: 'Ram',
      task: 'Creat scocket for conversation',
      taskname: 'Creat scocket',
      deadline: '26-06-2025',
      status: 'Completed',
      question: 'what is the future scope of react native',
      score: '8',
    },
  ];

  const steps = [
    {
      id: 1,
      left: { kind: 'icon', src: require('../../assets/courses/css.png') },
      right: { kind: 'text', text: 'HTML, CSS, Javascript' },
      dot: 'purple',
    },
    {
      id: 2,
      left: { kind: 'text', text: 'MongoDB, Express, Node.js' },
      right: { kind: 'icon', src: require('../../assets/courses/react (2).png') },
      dot: 'gray',
    },
    {
      id: 3,
      left: { kind: 'icon', src: require('../../assets/courses/angular (2).png') },
      right: { kind: 'text', text: 'React' },
      dot: 'purple',
    },
    {
      id: 4,
      left: { kind: 'text', text: 'Angular' },
      right: { kind: 'icon', src: require('../../assets/courses/google.png') },
      dot: 'gray',
    },
    {
      id: 5,
      left: { kind: 'icon', src: require('../../assets/courses/css.png') },
      right: { kind: 'text', text: 'Google Developer' },
      dot: 'purple',
    },
    {
      id: 6,
      left: { kind: 'text', text: 'Javascript' },
      right: { kind: 'icon', src: require('../../assets/courses/python.png') },
      dot: 'gray',
    },
  ];

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
                    {' '}
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

        {activeTab === 'notes' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes & Materials</Text>
            {course?.notes?.length ? (
              course?.notes?.map((note: any) => (
                <View key={note.id} style={styles.noteCard}>
                  {/* Name Row */}
                  <View style={styles.textRow}>
                    <Text style={styles.labelText}>File</Text>
                    <Image source={icons.pdf} />
                  </View>

                  {/* Date Row */}
                  <View style={styles.textRow}>
                    <Text style={styles.labelText}>Date</Text>
                    <Text style={styles.valueText}>{formatDateMonthandYear(note?.createdAt)}</Text>
                  </View>

                  {/* Chapter Row */}
                  <View style={styles.textRow}>
                    <Text style={styles.labelText}>Chapter</Text>
                    <Text style={styles.valueText}>{note?.title}</Text>
                  </View>

                  {/* Download Row */}
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
            {tasksData?.map((task: any) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => navigation.navigate('TaskCard', { task })}>
                <View style={styles.textRow}>
                  <Text style={styles.taskText}>Name</Text>
                  <Text style={styles.taskValue}>{task.instructorname}</Text>
                </View>

                <View style={styles.textRow}>
                  <Text style={styles.taskText}>Task Name</Text>
                  <Text style={styles.taskValue}>{task.taskname}</Text>
                </View>

                <View style={styles.textRow}>
                  <Text style={styles.taskText}>Deadline</Text>
                  <Text style={styles.taskValue}>{task.deadline}</Text>
                </View>

                <View style={styles.textRow}>
                  <Text style={styles.taskText}>Action</Text>
                  <View
                    style={[
                      styles.statusButton,
                      task.status === 'Completed' ? styles.completed : styles.pending,
                    ]}>
                    <Text style={styles.statusText}>{task.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'track' && (
          <View>
            <Text style={styles.sectionTitle}>Course Tracks</Text>
            <View style={styles.videoCard}>
              {showVideo ? (
                <WebView
                  style={styles.webview}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsFullscreenVideo={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  source={{
                    html: `
                     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Video Player</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            color: #fff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            max-width: 1000px;
            width: 100%;
            padding: 20px;
        }

        .video-container {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            margin-bottom: 30px;
        }
        
        .video-wrapper {
            position: relative;
            width: 100%;
        }
        
        #youtube-iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="video-container">
                <iframe id="youtube-iframe" 
                    src="https://www.youtube.com/embed/FYErehuSuuw?si=m7kiymCdWWUcCxYA" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen>
                </iframe>
        </div>

    <script>
        const iframe = document.getElementById('youtube-iframe');
        let player;
        
        // Inject YouTube API script
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // Initialize YouTube player
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('youtube-iframe', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
        
        function onPlayerReady(event) {
            console.log('Player is ready');
        }
        
        function onPlayerStateChange(event) {
            // Handle player state changes if needed
        }
        
        function playVideo() {
            if (player && player.playVideo) {
                player.playVideo();
            }
        }
        
        function pauseVideo() {
            if (player && player.pauseVideo) {
                player.pauseVideo();
            }
        }
        
        function stopVideo() {
            if (player && player.stopVideo) {
                player.stopVideo();
            }
        }
        
        function toggleFullscreen() {
            const container = document.querySelector('.video-container');
            
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    </script>
</body>
</html>
                    `,
                  }}
                />
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://i.ytimg.com/vi_webp/FYErehuSuuw/hqdefault.webp' }}
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
                  {/* Left column */}
                  <View style={[styles.sideCol, { alignItems: 'flex-start' }]}>
                    {step.left.kind === 'icon' && (
                      <View style={styles.bubble}>
                        <Image source={step.left.src} style={styles.bubbleIcon} />
                      </View>
                    )}
                    {step.left.kind === 'text' && (
                      <Text style={[styles.sideText, { textAlign: 'left' }]}>{step.left.text}</Text>
                    )}
                  </View>

                  {/* Center */}
                  <View style={styles.centerCol}>
                    <View
                      style={[
                        styles.dot,
                        step.dot === 'purple' ? styles.dotPurple : styles.dotGray,
                      ]}
                    />
                  </View>

                  {/* Right column */}
                  <View style={[styles.sideCol, { alignItems: 'flex-end' }]}>
                    {step.right.kind === 'icon' && (
                      <View style={styles.bubble}>
                        <Image source={step.right.src} style={styles.bubbleIcon} />
                      </View>
                    )}
                    {step.right.kind === 'text' && (
                      <Text style={[styles.sideText, { textAlign: 'right' }]}>
                        {step.right.text}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={{ marginTop: 40 }}></View>
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
  noteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  noteText: { fontSize: 14, color: '#4B5563' },
  downloadButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
  },

  taskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOW,
  },
  taskText: { fontSize: 18, color: '#716F6F', marginBottom: 6, width: '50%' },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
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

  webview: {
    flex: 1,
  },

  videoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 40,
  },

  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  downloadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    marginRight: 8,
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
    padding: 12,
    ...SHADOW,
  },
  bubbleIcon: { width: 40, height: 40, resizeMode: 'contain' },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  taskValue: {
    fontSize: 18,
    color: '#716F6F',
  },
  labelText: {
    fontSize: 18,
    color: '#716F6F',
    width: '50%',
  },
  valueText: {
    fontSize: 18,
    color: '#716F6F',
  },
});
