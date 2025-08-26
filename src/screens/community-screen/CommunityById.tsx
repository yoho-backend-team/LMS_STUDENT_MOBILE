import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

interface Message {
  _id?: string;
  message: string;
  sender?: string;
  isOutgoing: boolean;
}

const CommunityById: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // ✅ correctly get params
  const { communityId, communityName, members } = route.params;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
  try {
    const url = `https://lms-node-backend-v1.onrender.com/api/institutes/community/messages/all/?community=${communityId}`;
    console.log("📡 Fetching messages:", url);

    const res = await axios.get(url);

    console.log("✅ Messages fetched:", res.data);

    const apiMessages: Message[] = res.data.data.map((m: any) => ({
      _id: m._id,
      message: m.message || "",
      sender: m.sender,
      isOutgoing: m.sender === "me", // TODO: replace with logged-in user
    }));

    setMessages(apiMessages);
  } catch (err: any) {
    console.error("❌ Error fetching community messages:", err.response?.data || err.message);
  }
};


    if (communityId) fetchMessages();
  }, [communityId]);

  // Auto-scroll
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (msg: Message) => (
    <View
      key={msg._id}
      style={[
        styles.messageContainer,
        msg.isOutgoing ? styles.outgoingMessage : styles.incomingMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          msg.isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            msg.isOutgoing ? styles.outgoingText : styles.incomingText,
          ]}
        >
          {msg.message}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.profileContainer}>
              <View style={styles.profileIcon} />
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{communityName}</Text>
                <Text style={styles.headerSubtitle}>{members} Members</Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a Message"
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CommunityById;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { marginRight: 12 },
  profileContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 12,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  headerSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  chatContainer: { flex: 1, backgroundColor: "#1a4a47" },
  chatContent: { padding: 16, paddingBottom: 20 },
  messageContainer: { marginVertical: 4 },
  outgoingMessage: { alignItems: "flex-end" },
  incomingMessage: { alignItems: "flex-start" },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  outgoingBubble: { backgroundColor: "#7ed321", borderBottomRightRadius: 4 },
  incomingBubble: { backgroundColor: "#ffffff", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 18 },
  outgoingText: { color: "#000" },
  incomingText: { color: "#333" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1a4a47",
    justifyContent: "center",
    alignItems: "center",
  },
});
