import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "~/constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";

type RootStackParamList = {
  Courses: undefined;
  CourseViewScreen: { course: Course };
};

type Course = {
  id: number;
  title: string;
  description: string;
  modules: string;
  duration: string;
  image: any;
};

type Props = NativeStackScreenProps<RootStackParamList, "CourseViewScreen">;

const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

const CourseById: React.FC<Props> = ({ route, navigation }) => {
	const [showVideo, setShowVideo] = useState(false);
  const { course } = route.params;
  const [activeTab, setActiveTab] = useState<
    "about" | "notes" | "tasks" | "track"
  >("about");

  const notesData = [
    { id: 1, name: "File", date: "12-06-2025", chapter: "Chapter 1" },
    { id: 2, name: "File", date: "13-06-2025", chapter: "Chapter 2" },
    { id: 3, name: "File", date: "14-06-2025", chapter: "Chapter 3" },
    { id: 4, name: "File", date: "15-06-2025", chapter: "Chapter 4" },
  ];

  const tasksData = [
    {
      id: 1,
      name: "Rajesh",
      task: "Lorem Ipsum",
      deadline: "26-06-2025",
      status: "Completed",
    },
    {
      id: 2,
      name: "Rajesh",
      task: "Lorem Ipsum",
      deadline: "26-06-2025",
      status: "Pending",
    },
    {
      id: 3,
      name: "Rajesh",
      task: "Lorem Ipsum",
      deadline: "26-06-2025",
      status: "Completed",
    },
    {
      id: 4,
      name: "Rajesh",
      task: "Lorem Ipsum",
      deadline: "26-06-2025",
      status: "Completed",
    },
  ];

  // ✅ Timeline steps
  const steps = [
    {
      id: 1,
      left: { kind: "icon", src: require("../../assets/courses/css.png") },
      right: { kind: "text", text: "HTML, CSS, Javascript" },
      dot: "purple",
    },
    {
      id: 2,
      left: { kind: "text", text: "MongoDB, Express, Node.js" },
      right: { kind: "icon", src: require("../../assets/courses/react (2).png") },
      dot: "gray",
    },
    {
      id: 3,
      left: { kind: "icon", src: require("../../assets/courses/angular (2).png") },
      right: { kind: "text", text: "React" },
      dot: "purple",
    },
    {
      id: 4,
      left: { kind: "text", text: "Angular" },
      right: { kind: "icon", src: require("../../assets/courses/google.png") },
      dot: "gray",
    },
    {
      id: 5,
      left: { kind: "icon", src: require("../../assets/courses/css.png") },
      right: { kind: "text", text: "Google Developer" },
      dot: "purple",
    },
    {
      id: 6,
      left: { kind: "text", text: "Javascript" },
      right: { kind: "icon", src: require("../../assets/courses/python.png") },
      dot: "gray",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={require("../../assets/courses/arrow.png")} style={{width:24,height:24}}/>
        </TouchableOpacity>

        {/* Scrollable Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
        >
          {["about", "notes", "tasks", "track"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === "about"
                  ? "About"
                  : tab === "notes"
                  ? "Notes & Materials"
                  : tab === "tasks"
                  ? "Tasks & Projects"
                  : "Course Track"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <>
            <View style={styles.card}>
              <View style={styles.card}><Image
                source={course.image}
                style={styles.image}
                resizeMode="contain"
              /></View>
              <Text style={styles.title}>{course.title}</Text>
              <Text style={styles.description}>{course.description}</Text>

              <View style={styles.footer}>
                <View style={styles.footerItem}>
                   <Image source={require("../../assets/courses/modules.png")} style={{width:24,height:24}}/>
                  <Text style={styles.footerText}>{course.modules}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Image source={require("../../assets/courses/Alarm.png")} style={{width:24,height:24}}/>
                  <Text style={styles.footerText}>{course.duration}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
				<View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Course Name</Text>
			  <View style={styles.card1} >
              <Text style={styles.infoValue}>
                If you can this yes successfully mobile app on Android
              </Text>
			  </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Course Durations</Text>
            <View style={styles.card1}>  <Text style={styles.infoValue}>Feedback</Text></View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Total Hours</Text>
             <View style={styles.card1}> <Text style={styles.infoValue}>
                sbxxd-rcfvg...jpeg.{" "}
                <Text style={{ color: "blue" }}>View</Text>
              </Text></View>
            </View>
			</View>
          </>
        )}

        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <View style={styles.card}>
            {notesData.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.noteTitle}>{note.name}</Text>
                <Text style={styles.noteText}>Date: {note.date}</Text>
                <Text style={styles.noteText}>Chapter: {note.chapter}</Text>

                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download-outline" size={22} color="green" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* TASKS TAB */}
        {activeTab === "tasks" && (
  <View style={styles.card}>
    {tasksData.map((task) => (
      <View key={task.id} style={styles.taskCard}>

        <View style={styles.textRow}>
          <Text style={styles.taskText}>Name</Text>
          <Text style={styles.taskValue}>{task.name}</Text>
        </View>

        <View style={styles.textRow}>
          <Text style={styles.taskText}>Task Name</Text>
          <Text style={styles.taskValue}>{task.task}</Text>
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
              task.status === "Completed" ? styles.completed : styles.pending,
            ]}
          >
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        </View>

      </View>
    ))}
  </View>
)}


        {activeTab === "track" && (
          <View >
            <Text style={styles.sectionTitle}>Course Tracks</Text>
 <View style={styles.videoCard}>
  {showVideo ? (
   <WebView
  style={styles.webview}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  allowsInlineMediaPlayback={true} 
  mediaPlaybackRequiresUserAction={false} 
  source={{
    uri: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&playsinline=1&mute=1"
  }}
/>
) : (

    <>
      <Image
        source={{ uri: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" }} 
        style={styles.videoImage}
      />
      <TouchableOpacity
        style={styles.playBtn}
        onPress={() => setShowVideo(true)}
      >
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
                  <View style={[styles.sideCol, { alignItems: "flex-start" }]}>
                    {step.left.kind === "icon" && (
                      <View style={styles.bubble}>
                        <Image
                          source={step.left.src}
                          style={styles.bubbleIcon}
                        />
                      </View>
                    )}
                    {step.left.kind === "text" && (
                      <Text
                        style={[styles.sideText, { textAlign: "left" }]}
                      >
                        {step.left.text}
                      </Text>
                    )}
                  </View>

                  {/* Center */}
                  <View style={styles.centerCol}>
                    <View
                      style={[
                        styles.dot,
                        step.dot === "purple"
                          ? styles.dotPurple
                          : styles.dotGray,
                      ]}
                    />
                  </View>

                  {/* Right column */}
                  <View style={[styles.sideCol, { alignItems: "flex-end" }]}>
                    {step.right.kind === "icon" && (
                      <View style={styles.bubble}>
                        <Image
                          source={step.right.src}
                          style={styles.bubbleIcon}
                        />
                      </View>
                    )}
                    {step.right.kind === "text" && (
                      <Text
                        style={[styles.sideText, { textAlign: "right" }]}
                      >
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
  container: { flex: 1, backgroundColor: "#ebeff3" },
  scroll: { padding: 16 },
  backButton: { marginBottom: 10 },

  tabScroll: { marginBottom: 16 },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  activeTab: { backgroundColor: "#7B00FF" },
  tabText: { color: "#374151", fontSize: 14 },
  activeTabText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  card: {
    backgroundColor: "#ebeff3",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    ...SHADOW,
  },
  card1: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
  },
  image: { width: "100%", height: 140, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8 ,color: "#2A2A2A"},
  description: { fontSize: 14, color: "#716F6F", marginBottom: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerItem: { flexDirection: "row", alignItems: "center" },
  footerText: { marginLeft: 4, fontSize: 12, color: "#716F6F" },

  infoCard: {
    backgroundColor: "#ebeff3",
    borderRadius: 12,
    padding: 12,
  },
  infoLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 8 ,color: "#2A2A2A" },
  infoValue: { fontSize: 14, color: "#716F6F" },

  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    ...SHADOW,
    marginBottom: 12,
  },
  noteTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6, },
  noteText: { fontSize: 14, color: "#4B5563", },
  downloadButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 8,
  },

  taskCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOW,
  },
  taskText: { fontSize: 14, color: "#374151", marginBottom: 6 ,},
  actionRow: { flexDirection: "row", alignItems: "center" },
  statusButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completed: { backgroundColor: "#4ADE80" },
  pending: { backgroundColor: "#9CA3AF" },
  statusText: { color: "#fff", fontWeight: "bold" },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },

  
  videoCard: {
  height: 200,
  width: "100%",
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: 16,
  backgroundColor: "#ebeff3",
    padding: 16,

    ...SHADOW,
},

webview: {
  flex: 1,
},

videoImage: {
  width: "100%",
  height: 200,
  borderRadius: 12,
},

playBtn: {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: [{ translateX: -25 }, { translateY: -25 }],
  backgroundColor: "rgba(0,0,0,0.6)",
  padding: 15,
  borderRadius: 40,
},

  
  trackCard: {
    backgroundColor: "#ebeff3",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    ...SHADOW,
    position: "relative",
  },
  verticalLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "53%",
    width: 4,
    backgroundColor: "#E5E7EB",
    transform: [{ translateX: -1.5 }],
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 90,
  },
  centerCol: { width: 36, alignItems: "center", justifyContent: "center" },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 2,
  },
  dotPurple: { backgroundColor: "#8B5CF6" },
  dotGray: { backgroundColor: "#9CA3AF" },

  sideCol: { flex: 1, justifyContent: "center" },
  sideText: { fontSize: 14, fontWeight: "500", color: "#374151" },
  bubble: {
    backgroundColor: "#F9FAFB",
    borderRadius: 40,
    padding: 12,
    ...SHADOW,
  },
  bubbleIcon: { width: 40, height: 40, resizeMode: "contain" },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between", // 👈 pushes label left & value right
    alignItems: "center",
    marginVertical: 4,
  },

  taskValue: {
    fontSize: 14,
    color: "#555",
  },
  
});
