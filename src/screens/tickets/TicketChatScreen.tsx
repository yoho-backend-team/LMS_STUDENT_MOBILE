import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";


const TicketChatScreen = ({ route, navigation }: any) => {
  const { ticketId } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "This Ticket Created From Student Mobile App",
      sender: "Oliver Smith",
      date: "10 May 2025",
      status: "Open",
    },
    {
      id: 2,
      text: "Following up on the issue...",
      sender: "Oliver Smith",
      date: "10 May 2025",
      status: "Open",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: message,
      sender: "You",
      date: new Date().toLocaleDateString(),
      status: "Open",
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  const handleMarkSolved = async (msgId: number) => {
    try {
      
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, status: "Closed" } : m
        )
      );
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket #{ticketId}</Text>
      </View>

     
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageCard}>
            <View style={styles.msgHeader}>
              <Text style={styles.sender}>{msg.sender}</Text>
              <Text style={styles.date}>{msg.date}</Text>
            </View>

            <Text style={styles.msgText}>{msg.text}</Text>

          
            <TouchableOpacity
              style={styles.solvedBtnWrapper}
              disabled={msg.status === "Closed"}
              onPress={() => handleMarkSolved(msg.id)}
            >
              <LinearGradient
                colors={
                  msg.status === "Closed"
                    ? ["#6B7280", "#9CA3AF"]
                    : ["#7B00FF", "#B200FF"]
                }
                style={styles.solvedBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.solvedText}>
                  {msg.status === "Closed" ? "Solved" : "Problem Solved"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachBtn}>
            <Icon name="plus" size={20} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Say Something..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TicketChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  chatContainer: { padding: 10 },
  messageCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  msgHeader: { flexDirection: "row", justifyContent: "space-between" },
  sender: { fontSize: 14, fontWeight: "bold", color: "#333" },
  date: { fontSize: 12, color: "#888" },
  msgText: { marginTop: 5, fontSize: 14 },
  solvedBtnWrapper: { marginTop: 10, alignSelf: "flex-end" },
  solvedBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  solvedText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 2,
  },
  attachBtn: { padding: 8 },
  input: { flex: 1, paddingVertical: 8, paddingHorizontal: 10, fontSize: 14 },
  sendBtn: { backgroundColor: "#7B00FF", padding: 10, borderRadius: 20 },
});
