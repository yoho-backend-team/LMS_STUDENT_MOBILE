import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function CommunityScreen() {
  const messages = Array(5).fill({
    name: "MERN 2025",
    message: "Hi",
    time: "1:15 PM",
  })

  return ( 
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.header}>Community</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput placeholder="Search" placeholderTextColor="#9CA3AF" style={styles.searchInput} />
        </View>

        {/* Message List */}
        <View style={styles.messageList}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {messages.map((message, index) => (
              <TouchableOpacity key={index} style={styles.messageItem}>
                {/* Avatar */}
                <View style={styles.avatar} />

                {/* Message Content */}
                <View style={styles.messageContent}>
                  <Text style={styles.messageName}>{message.name}</Text>
                  <Text style={styles.messageText}>{message.message}</Text>
                </View>

                {/* Time and Check */}
                <View style={styles.messageRight}>
                  <Text style={styles.messageTime}>{message.time}</Text>
                  <View style={styles.checkContainer}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 24,
    marginTop: 16,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#6B7280",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageList: {
    backgroundColor: "white",
    borderRadius: 8,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#000",
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  messageName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: "#6B7280",
  },
  messageRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  messageTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  checkContainer: {
    width: 20,
    height: 20,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
})
