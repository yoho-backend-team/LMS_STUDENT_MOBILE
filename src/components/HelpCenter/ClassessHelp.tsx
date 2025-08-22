import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";

type ClassItem = {
  id: number;
  title: string;
  subtitle: string;
  info: string;
  image: any;
};

const ClassessHelp = () => {
  const [selectedItem, setSelectedItem] = useState<ClassItem | null>(null);

  const data: ClassItem[] = [
    {
      id: 1,
      title: "How to learn?",
      subtitle: "Sample Video",
      info: "This is details about Learning.",
      image: require("./../../assets/helpcenter/classess.png"),
    },
    {
      id: 2,
      title: "Attendance Guide",
      subtitle: "Track classes",
      info: "This is details about Attendance.",
      image: require("./../../assets/helpcenter/classess.png"),
    },
  ];

  if (selectedItem) {
    return (
      <View style={styles.container}>
        {/* Back Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.backIcon}>
            <Image
              source={require("./../../assets/icons/backarrow.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedItem.title}</Text>
        </View>

        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text style={styles.subtitle}>{selectedItem.info}</Text>

        <View style={styles.videoBox}>
          <Image source={selectedItem.image} style={styles.video} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Classes</Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonContainer}
            onPress={() => setSelectedItem(item)}
          >
            <LinearGradient
              colors={['#7B00FF', '#B200FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ClassessHelp;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backIcon: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  card: {
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    marginBottom: 10,
  },
  badgeText: { fontSize: 13, fontWeight: "600", color: "#555" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4, color: "#000" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 15 },

  buttonContainer: {
    alignSelf: "flex-end",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    shadowColor: "#7B00FF",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },

  videoBox: {},
  video: { width: "100%", height: 300, borderRadius: 10 },
});