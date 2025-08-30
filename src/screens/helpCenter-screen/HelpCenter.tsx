import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { Entypo } from '@expo/vector-icons';
import Header from '~/components/shared/Header';
import { COLORS, FONTS } from '~/constants';

type HelpItem = {
  id: string;
  question: string;
  answer: string;
  videolink?: string;
  category: string;
};

const helpItems1 = [
  { id: '1', question: 'How to Reset password', answer: 'go to settings', videolink: 'http://ww.google.com', category: 'Profile' },
  { id: '2', question: 'Class Enrollment Issue', answer: 'go to settings', videolink: 'http://ww.google.com', category: 'Mail' },
  { id: '3', question: 'Payment Methods', answer: 'go to settings', videolink: 'http://ww.google.com', category: 'Mail' },
  { id: '4', question: 'Attendance Tracking', answer: 'go to settings', videolink: 'http://ww.google.com', category: 'Mail' },
  { id: '5', question: 'Email Notifications', answer: 'go to settings', videolink: 'http://ww.google.com', category: 'Mail' },
  { id: '6', question: 'Profile Not Updating', answer: 'go to settings', videolink: 'http://ww.google.com', category: 'Profile' },
];


const HelpCenter = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const tabData1 = ['Mail', 'Profile', 'Classes', 'Password', 'Attedance', 'Payment', 'Login and Signup',].map((category) => ({
    key: category,
    category,
    data: helpItems1.filter((item) => item.category === category),
  }));

  const filteredData = tabData1[selectedTab]?.data.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasData = filteredData.length > 0;

  const scrollToTab = (index: number) => {
    const tabWidth = 200;
    const screenOffset = index * tabWidth - tabWidth;
    scrollViewRef.current?.scrollTo({
      x: screenOffset > 0 ? screenOffset : 0,
      animated: true,
    });
  };

  if (selectedItem) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
        <ScrollView style={styles.container}>
          {/* Header with back button */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(null);
                setShowVideo(false);
              }}
              style={styles.backIcon}>
              <Image
                source={require('./../../assets/icons/backarrow.png')}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <Text style={{ ...FONTS.h1, color: COLORS.text_title }}>Learning Resources</Text>
          </View>

          {/* Additional Info */}
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.subtitle}>
            This section contains some dummy content. You can replace this with any relevant
            information you want to display above the video link. You can replace this with any
            relevant information you want to display above the video link
          </Text>

          {/* Video */}
          {selectedItem.videolink && (
            <View style={styles.videoCard}>
              {showVideo ? (
                <WebView
                  style={styles.webview}
                  javaScriptEnabled
                  allowsFullscreenVideo
                  source={{ uri: selectedItem.videolink }}
                />
              ) : (
                <>
                  <Image
                    source={{
                      uri: `https://i.ytimg.com/vi/${selectedItem.videolink?.split('=')[1]}/hqdefault.jpg`,
                    }}
                    style={styles.videoImage}
                  />
                  <TouchableOpacity style={styles.playBtn} onPress={() => setShowVideo(true)}>
                    <Entypo name="controller-play" size={24} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <Header />

      <View>
        <Text style={styles.headerText}>Help Centre</Text>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {tabData1?.map(({ key, category, data }, index) => {
            const count = data.length;
            const isActive = selectedTab === index;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSelectedTab(index);
                  pagerRef.current?.setPage(index);
                  scrollToTab(index);
                }}
                activeOpacity={0.9}>
                {isActive ? (
                  <LinearGradient
                    colors={['#7B00FF', '#B200FF']}
                    start={{ x: 0.134, y: 0.021 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeBoxGradient}>
                    <Text style={[styles.boxText, styles.activeBoxText]}>{key}</Text>
                    <View style={[styles.countBadge, styles.activeBadge]}>
                      <Text style={[styles.countText, styles.activeCountText]}>{count}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={[styles.box, styles.inactiveBox]}>
                    <Text style={[styles.boxText, styles.inactiveBoxText]}>{key}</Text>
                    <View style={[styles.countBadge, styles.inactiveBadge]}>
                      <Text style={[styles.countText, styles.inactiveCountText]}>{count}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

{/* ..Card view................................ */}
      {hasData ? (
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={selectedTab}
          onPageSelected={(e) => {
            const index = e.nativeEvent.position;
            setSelectedTab(index);
            scrollToTab(index);
          }}>
          {tabData1.map((tab, index) => {
            const filteredData = tab.data.filter(
              (item) =>
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer?.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <ScrollView key={index} style={styles.contentArea}>
                {filteredData.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{item.category}</Text>
                    </View>
                    <Text style={styles.title}>{item.question}</Text>
                    {item.answer && <Text style={styles.subtitle}>{item.answer}</Text>}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.buttonContainer}
                      onPress={() => setSelectedItem(item)}>
                      <LinearGradient
                        colors={['#7B00FF', '#B200FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}>
                        <Text style={styles.buttonText}>View Details</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            );
          })}
        </PagerView>
      ) : (
        <View>
          <Text style={styles.noDataText}>Help Centre</Text>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="How to Reset password"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Class Enrollment Issue"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Payment Method"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Attendence Tracking"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Email Notifications"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#cfdeedff' },
  headerText: { paddingHorizontal: 20, paddingVertical: 10, fontSize: 22, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 10, gap: 10 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    width: 200,
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  activeBoxGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    width: 200,
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  inactiveBox: {
    backgroundColor: '#EBEFF3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
    width: 200,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  boxText: { fontSize: 16, fontWeight: '600' },
  activeBoxText: { color: '#FFF' },
  inactiveBoxText: { color: '#333' },
  countBadge: {
    marginLeft: 8,
    minWidth: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  activeBadge: { backgroundColor: '#FFF' },
  inactiveBadge: { backgroundColor: '#EBEFF3' },
  countText: { fontSize: 12, fontWeight: 'bold' },
  activeCountText: { color: '#B200FF' },
  inactiveCountText: { color: '#333' },
  contentArea: { flex: 1, padding: 15 },
  searchContainer: { paddingHorizontal: 15, marginVertical: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e4e2e2ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#EBEFF3',
  },
  card: {
    backgroundColor: '#EBEFF3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  tagText: { fontSize: 13, color: '#333', fontWeight: '500' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#111' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
  buttonContainer: { alignSelf: 'flex-end' },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backIcon: { marginRight: 10, padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#111' },
  videoCard: {
    marginTop: 10,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoImage: { width: '100%', height: '100%' },
  playBtn: { position: 'absolute', top: '40%', left: '45%' },
  webview: { width: '100%', height: '100%' },
});

