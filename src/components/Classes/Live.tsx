import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ClassProps {
  day: string;
  topic: string;
  link: string;
  duration: string;
}

const ClassCard: React.FC<ClassProps> = ({ day, topic, link, duration }) => {
  const handleOpenLink = () => {
    if (!link) return;
    Linking.openURL(link).catch(() => {
      alert("Unable to open link");
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Day</Text>
        <Text style={styles.value}>{day}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Topic</Text>
        <Text style={styles.value}>
          {topic.length > 20 ? topic.substring(0, 20) + "..." : topic}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Join Link</Text>
        <Text style={styles.link} onPress={handleOpenLink}>
          {link.length > 20 ? link.substring(0, 20) + "..." : link}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{duration}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Action</Text>
        <TouchableOpacity style={styles.joinBtn} onPress={handleOpenLink}>
          <Text style={styles.joinBtnText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OnlineClass = () => {
  const [activeTab, setActiveTab] = useState<"Live" | "Upcoming">("Live");

  return (
    <ScrollView>
      <Text style={styles.sectionTitle}>Online Classes</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Live", "Upcoming"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as "Live" | "Upcoming")}
          >
            {activeTab === tab ? (
              <LinearGradient
                colors={["#a855f7", "#6366f1"]}
                style={styles.gradientTab}
              >
                <Text style={styles.activeTabText}>
                  {tab === "Live" ? "Live Class" : "Upcoming Classes"}
                </Text>
              </LinearGradient>
            ) : (
              <Text style={styles.tabText}>
                {tab === "Live" ? "Live Class" : "Upcoming Classes"}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subTitle}>
        {activeTab === "Live" ? "Live Classes" : "Upcoming Classes"}
      </Text>

      {/* Cards */}
      {activeTab === "Live" ? (
        <>
          <ClassCard
            day="Day 1"
            topic="HTML"
            link="https://www.google.com"
            duration="45 Min"
          />
          <ClassCard
            day="Day 2"
            topic="CSS"
            link="https://www.google.com"
            duration="50 Min"
          />
          <ClassCard
            day="Day 3"
            topic="JavaScript"
            link="https://www.google.com"
            duration="60 Min"
          />
        </>
      ) : (
        <Text style={styles.noClass}>No upcoming classes available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#111",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tab: {
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 10,
  },
  tabText: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
  },
  gradientTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 14,
    color: "#222",
  },
  link: {
    fontSize: 14,
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  joinBtn: {
    backgroundColor: "#22C55E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  joinBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  noClass: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 20,
  },
});

export default OnlineClass;
