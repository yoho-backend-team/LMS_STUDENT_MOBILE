import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, icons, screens } from '~/constants';
import { formatDate, formatTime } from '~/utils/formatDate';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import { Download } from 'lucide-react-native';
import WebView from 'react-native-webview';
import { getFileUrl } from '~/utils/imageUtils';
import { Ionicons } from '@expo/vector-icons';

interface ClassDataProps {
  classData: any;
}

const CompleteClassDetails: React.FC<ClassDataProps> = ({ classData }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const [showVideo, setShowVideo] = useState(false);

  const classInfoData = [
    { label: 'Date', value: formatDate(classData?.start_date) },
    { label: 'Start At', value: formatTime(classData?.start_time, false) },
    { label: 'End At', value: formatTime(classData?.end_time, false) },
    { label: 'Duration', value: classData?.duration },
  ];

  const sessionNotes: string[] = classData?.notes || [];
  const studyMaterials: string[] = classData?.study_materials || [];

  const handleDownload = (url: string) => {
    if (url) {
      const fullURL = getFileUrl(url);
      Linking.openURL(fullURL);
    }
  };

  const extractVideoId = (url: string) => {
    if (!url) return '';
    const regex = /(?:embed\/|v=)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/profile/back.png')} style={styles.backbutton} />
        </TouchableOpacity>
        <Text style={styles.title}>{classData?.class_name}</Text>
      </View>

      <View style={styles.container1}>
        <Text style={styles.batchTitle}>Batch No : #{classData?.batch?.id || '1'}</Text>

        <LinearGradient
          colors={['#7B00FF', '#B200FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}>
          {classInfoData?.map((item, index) => (
            <View key={index} style={styles.column}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </LinearGradient>

        <Text style={styles.notesubTitle}>
          Make sure your presence in this class & if you are unable to attend, please inform the
          Coordinator.
        </Text>

        <TouchableOpacity
          style={styles.notesCard}
          onPress={() => {
            navigation.goBack();
            dispatch(setSelectedTab(screens.attendance));
          }}>
          <Text style={styles.noteText1}>Check Attendance</Text>
        </TouchableOpacity>

        <Text style={styles.notesubTitle}>If any issue in attendance please raise a ticket</Text>
      </View>

      {/* uploaded video */}
      <View style={styles.videoCard}>
        <Text style={styles.sectionTitle}>Class Video</Text>
        {showVideo && classData?.video_url ? (
          <WebView
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            source={{
              uri: classData?.video_url,
            }}
          />
        ) : (
          <>
            <Image
              source={{
                uri: classData?.video_url
                  ? `https://i.ytimg.com/vi/${extractVideoId(classData?.video_url)}/hqdefault.jpg`
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

      {/* Session Notes */}
      <View style={{ marginTop: 15 }}>
        <Text style={styles.noteTitle}>Session Notes</Text>
        {sessionNotes.length > 0 ? (
          sessionNotes.map((url: any, idx) => (
            <View key={idx} style={styles.notesCard1}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <Image source={icons.pdf} style={{ width: 20, height: 25 }} />
                <View>
                  <Text style={styles.noteText}>{url?.title}</Text>
                  <Text style={styles.noteText2}>{url?.description}</Text>
                </View>
                <TouchableOpacity
                  style={{ flex: 1, alignItems: 'flex-end' }}
                  onPress={() => handleDownload(url?.file)}>
                  <Download size={18} color={COLORS.text_title} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <TouchableOpacity style={styles.notesCard1}>
            <Text style={styles.noteText}>No session notes available</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Study Materials */}
      <View style={styles.container2}>
        <Text style={styles.noteTitle}>Study Materials</Text>
        {studyMaterials.length > 0 ? (
          studyMaterials.map((url: any, idx) => (
            <View key={idx} style={styles.notesCard1}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <Image source={icons.pdf} style={{ width: 20, height: 25 }} />
                <View>
                  <Text style={styles.noteText}>{url?.title}</Text>
                  <Text style={styles.noteText2}>{url?.description}</Text>
                </View>
                <TouchableOpacity
                  style={{ flex: 1, alignItems: 'flex-end' }}
                  onPress={() => handleDownload(url)}>
                  <Download size={18} color={COLORS.text_title} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <TouchableOpacity style={styles.notesCard1}>
            <Text style={styles.noteText}>No study materials available</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  batchTitle: {
    color: '#7B00FF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#EBF0F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  linkLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B00FF',
    marginBottom: 24,
    marginTop: 8,
  },
  subText: {
    fontSize: 17,
    color: '#333',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  joinButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#7B00FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 6,
    shadowColor: '#7B00FF',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  joinText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noteTitle: {
    fontSize: 16,
    color: COLORS.text_title,
    marginBottom: 8,
    fontWeight: 600,
  },
  notesubTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  notesCard1: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: COLORS.bg_Colour,
    borderRadius: 14,
    padding: 16,
    // Inset shadow to mimic “inner” effect
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  notesCard: {
    backgroundColor: COLORS.light_blue,
    alignSelf: 'flex-start',
    borderRadius: 16,
    padding: 16,
    // Inset shadow to mimic “inner” effect
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.text_title,
    fontWeight: 500,
    textAlign: 'center',
  },
  noteText2: {
    fontSize: 12,
    color: COLORS.text_desc,
  },
  noteText1: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: 500,
  },
  container1: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#3b3030ff',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  container2: {
    flex: 1,
    borderRadius: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: COLORS.white,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: COLORS.bg_Colour,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginVertical: 12,
  },
  videoCard: {
    height: 280,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
  column: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    margin: 1,
  },
});

export default CompleteClassDetails;
