import React, { useEffect, useState, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchHelpCenterThunk } from "~/features/HelpCenters/Reducers/HelpCentersThunks";
import { selectHelpCenterData } from "~/features/HelpCenters/Reducers/HelpCentersSelector";
import Header from "~/components/shared/Header";

const TABS = [
  { key: "mail", title: "Mail" },
  { key: "profile", title: "Profile" },
  { key: "classes", title: "Classes" },
  { key: "password", title: "Password" },
  { key: "attendance", title: "Attendance" },
  { key: "payment", title: "Payment" },
  { key: "login", title: "Log In & Sign Up" },
];

export default function HelpCentre() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const dispatch = useDispatch();
  const helpData = useSelector(selectHelpCenterData);

  // 👇 Instead of getStudentData, directly hit backend via thunk
  useEffect(() => {
    const instituteid = "12345"; // <-- replace with dynamic value if needed
    dispatch(fetchHelpCenterThunk({ instituteid }) as any);
  }, [dispatch]);

  const scrollToTab = (index: number) => {
    const tabWidth = 160;
    const screenOffset = index * tabWidth - tabWidth / 2;
    scrollViewRef.current?.scrollTo({
      x: screenOffset > 0 ? screenOffset : 0,
      animated: true,
    });
  };

  const groupedData = React.useMemo(() => {
    const grouped: Record<string, any[]> = {};
    helpData?.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [helpData]);

  const getVideoId = (url: string) =>
    url.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] || "";

  // ---------- Detail screen ----------
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
        <Text style={styles.itemTitle}>{selectedItem.question}</Text>
        <Text style={{ marginBottom: 15, color: "#666" }}>
          {selectedItem.answer}
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
                    uri: `https://i.ytimg.com/vi/${getVideoId(
                      selectedItem.videolink
                    )}/hqdefault.jpg`,
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

  // ---------- Main Screen ----------
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header />
      <Text style={styles.header}>Help Centre</Text>
      <View style={styles.topSection}>
        {/* Tabs */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((tab, index) => {
            const isActive = selectedTab === index;
            const count = groupedData[tab.key]?.length || 0;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => {
                  setSelectedTab(index);
                  pagerRef.current?.setPage(index);
                  scrollToTab(index);
                }}
                activeOpacity={0.8}
                style={{ marginRight: 8 }}
              >
                {isActive ? (
                  <LinearGradient
                    colors={["#7B00FF", "#B200FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeTab}
                  >
                    <Text style={styles.activeTabText}>{tab.title}</Text>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeCountText}>{count}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveTab}>
                    <Text style={styles.inactiveTabText}>{tab.title}</Text>
                    <View style={styles.inactiveBadge}>
                      <Text style={styles.inactiveCountText}>{count}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search */}
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={selectedTab}
        onPageSelected={(e) => {
          const index = e.nativeEvent.position;
          setSelectedTab(index);
          scrollToTab(index);
        }}
      >
        {TABS.map((tab, index) => {
          const list = groupedData[tab.key] || [];
          const filtered = list.filter((item) =>
            item.question.toLowerCase().includes(search.toLowerCase())
          );
          return (
            <ScrollView
              key={index}
              style={{ flex: 1, paddingHorizontal: 10 }}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {filtered.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.question}</Text>
                  <Text style={styles.cardSubtitle}>{item.answer}</Text>
                  {item.videolink && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setSelectedItem(item)}
                    >
                      <Text style={styles.buttonText}>View Details</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {filtered.length === 0 && (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No results found.
                </Text>
              )}
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
  itemTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
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
