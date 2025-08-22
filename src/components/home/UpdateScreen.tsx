import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Expo import

const { width } = Dimensions.get("window");

const UpdatesScreen = () => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Updates</Text>
        <Text style={styles.newMsg}>0 New Messages</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab("today")}>
          {activeTab === "today" ? (
            <LinearGradient
              colors={["#a259ff", "#7209b7"]}
              style={styles.activeTab}
            >
              <Text style={styles.activeTabText}>Today</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.inactiveTab}>Today</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("previous")}>
          {activeTab === "previous" ? (
            <LinearGradient
              colors={["#a259ff", "#7209b7"]}
              style={styles.activeTab}
            >
              <Text style={styles.activeTabText}>Previous</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.inactiveTab}>Previous</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Empty State Illustration */}
      <View style={styles.emptyState}>
        <Image
          source={require("../../assets/home/update.jpg")} // ✅ make sure this path exists
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.noMsg}>No New Messages found</Text>
        <Text style={styles.subText}>
          Any updates will appear here when available
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: '#2A2A2A',
  },
  newMsg: {
    fontSize: 16,
    color: "#aaa",
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 20,
    gap: 15,
  },
  activeTab: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  inactiveTab: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.5,
   
  },
  noMsg: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});

export default UpdatesScreen;
