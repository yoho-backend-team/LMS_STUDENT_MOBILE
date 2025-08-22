import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
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
      image: require("./../../assets/helpcenter/classess.png") 
    },
    { 
      id: 2, 
      title: "Attendance Guide", 
      subtitle: "Track classes", 
      info: "This is details about Attendance.", 
      image: require("./../../assets/helpcenter/classess.png") 
    },
  ];

  if (selectedItem) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.backBtn}>
          <Image source={require("./../../assets/helpcenter/back.png")} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>

        <Text style={styles.title}>{selectedItem.title}</Text>
        <Text style={styles.subtitle}>{selectedItem.info}</Text>

        <View style={styles.videoBox}>
          <Image source={selectedItem.image} style={styles.video} />
          <View style={styles.playButton}>
            <Text style={{ color: "white", fontSize: 20 }}>▶</Text>
          </View>
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
            style={styles.button}
            onPress={() => setSelectedItem(item)}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ClassessHelp;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F9FAFB" },
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
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#FF00FF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    shadowColor: "#FF00FF",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  backBtn: { marginBottom: 15 },
  videoBox: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    marginTop: 20,
  },
  video: { width: "100%", height: 200, borderRadius: 12 },
  playButton: {
    position: "absolute",
    top: "40%",
    left: "45%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
    padding: 10,
  },
});
