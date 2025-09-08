import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import PagerView from "react-native-pager-view";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/shared/Header";

const TABS = [
  { key: "mail", title: "Mail", count: 5 },
  { key: "profile", title: "Profile", count: 1 },
  { key: "classes", title: "Classes", count: 2 },
  { key: "password", title: "Password", count: 5 },
  { key: "attendance", title: "Attendance", count: 5 },
  { key: "payment", title: "Payment", count: 5 },
  { key: "login", title: "Log In & Sign Up", count: 5 },
];

const CONTENT: Record<string, any[]> = {
  classes: [
    {
      id: "1",
      title: "How to learn?",
      subtitle: "Sample Video",
      button: "View Details",
      videolink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: "2",
      title: "Introduction to Classes",
      subtitle: "Demo Video",
      button: "View Details",
      videolink: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    },
  ],
  mail: [
    { id: "1", title: "How to Reset password" },
    { id: "2", title: "Class Enrollment Issue" },
    { id: "3", title: "Payment Methods" },
    { id: "4", title: "Attendance Tracking" },
    { id: "5", title: "Email Notifications" },
  ],
  profile: [
    {
      id: "1",
      title: "Profile",
      subtitle: "ASDF\nZCV",
      button: "View Details",
      videolink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ],
  password: [
     { id: "1", title: "How to Reset password" },
    { id: "2", title: "Class Enrollment Issue" },
    { id: "3", title: "Payment Methods" },
    { id: "4", title: "Attendance Tracking" },
    { id: "5", title: "Email Notifications" },
  ],
  attendance: [
    { id: "1", title: "How to Reset password" },
    { id: "2", title: "Class Enrollment Issue" },
    { id: "3", title: "Payment Methods" },
    { id: "4", title: "Attendance Tracking" },
    { id: "5", title: "Email Notifications" },
  ],
  payment: [
     { id: "1", title: "How to Reset password" },
    { id: "2", title: "Class Enrollment Issue" },
    { id: "3", title: "Payment Methods" },
    { id: "4", title: "Attendance Tracking" },
    { id: "5", title: "Email Notifications" },
  ],
  login: [
    { id: "1", title: "How to Reset password" },
    { id: "2", title: "Class Enrollment Issue" },
    { id: "3", title: "Payment Methods" },
    { id: "4", title: "Attendance Tracking" },
    { id: "5", title: "Email Notifications" },
  ],
};

export default function HelpCentre() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTab = (index: number) => {
    const tabWidth = 160;
    const screenOffset = index * tabWidth - tabWidth / 2;
    scrollViewRef.current?.scrollTo({
      x: screenOffset > 0 ? screenOffset : 0,
      animated: true,
    });
  };
  if (selectedItem) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem(null);
            setShowVideo(false);
          }}
          style={{ marginBottom: 10 }}
        >
          <Ionicons name="arrow-back" size={40} color="#333" />
        </TouchableOpacity>
           <Text style={styles.header}>Learning Resources</Text>
         <Text style={styles.header}>{selectedItem.title}</Text>
        <Text style={{ marginBottom: 15, color: "#666" }}>
          This section contains some additional information about{" "}
          {selectedItem.title}.
        </Text>
          {selectedItem.videolink && (
          <View style={styles.videoCard}>
            {showVideo ? (
              <WebView
                style={{ flex: 1 }}
                javaScriptEnabled
                allowsFullscreenVideo
                source={{ uri: selectedItem.videolink }}
              />
            ) : (
              <>
                <Image
                  source={{
                    uri: `https://i.ytimg.com/vi/${
                      selectedItem.videolink.split("v=")[1]
                    }/hqdefault.jpg`,
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
                <TouchableOpacity
                  style={styles.playBtn}
                  onPress={() => setShowVideo(true)}
                >
                  <Entypo name="controller-play" size={40} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  }
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header />
      <Text style={styles.header}>Help Centre</Text>
      <View style={styles.topSection}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>
        {TABS.map((tab, index) => {
            const isActive = selectedTab === index;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => {
                  setSelectedTab(index);
                  pagerRef.current?.setPage(index);
                  scrollToTab(index);
                }}
                activeOpacity={0.8}
                style={{ marginRight: 8 }}>
              {isActive ? (
                  <LinearGradient
                    colors={["#7B00FF", "#B200FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeTab}>
                <Text style={styles.activeTabText}>{tab.title}</Text>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeCountText}>{tab.count}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveTab}>
                    <Text style={styles.inactiveTabText}>{tab.title}</Text>
                    <View style={styles.inactiveBadge}>
                      <Text style={styles.inactiveCountText}>{tab.count}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
         <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}/>
        </View>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={selectedTab}
        onPageSelected={(e) => {
          const index = e.nativeEvent.position;
          setSelectedTab(index);
          scrollToTab(index);
        }}>
       {TABS.map((tab, index) => {
          const filtered = CONTENT[tab.key].filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase())
          );
          return (
            <ScrollView
              key={index}
              style={{ flex: 1, paddingHorizontal: 10 }}
              contentContainerStyle={{ paddingBottom: 10 }}>
              {filtered.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  )}
                  {item.button && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setSelectedItem(item)}>
                     <Text style={styles.buttonText}>{item.button}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          );
        })}
      </PagerView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fc", paddingHorizontal: 10 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 8 },

  topSection: { paddingHorizontal: 10, marginBottom: 10 },
  tabsContainer: { alignItems: "center", paddingVertical: 5 },

  activeTab: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    justifyContent: "space-between",
    minWidth: 140,
  },
  inactiveTab: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    justifyContent: "space-between",
    backgroundColor: "#eee",
    minWidth: 140,
  },
  activeTabText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  inactiveTabText: { fontSize: 14, fontWeight: "500", color: "#444" },

  activeBadge: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  inactiveBadge: {
    backgroundColor: "#EBEFF3",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  activeCountText: { fontSize: 12, fontWeight: "bold", color: "#B200FF" },
  inactiveCountText: { fontSize: 12, fontWeight: "bold", color: "#333" },

  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  cardSubtitle: { fontSize: 14, marginBottom: 10, color: "#555" },

  button: {
    alignSelf: "flex-end",
    backgroundColor: "#7b2ff7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },

  videoCard: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  playBtn: { position: "absolute", top: "40%", left: "45%" },
});
