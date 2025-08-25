import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for icons

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to your LMS assistant! I’m here to help you navigate courses, manage your account, track progress, and answer any questions you may have. How can I assist you today?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const getBotResponse = (userMessage: string): string => {
    if (userMessage.toLowerCase().includes("course")) {
      return "You can access all your enrolled courses from the Courses section.";
    }
    if (userMessage.toLowerCase().includes("payment")) {
      return "Check the Payments section to view dues, invoices, and history.";
    }
    return "I'm here to assist you! You can ask about Courses, Payments, Profile, Attendance, Notifications, or Support.";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        isUser: false,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>LMS Assistant</Text>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 10 }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isUser ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={msg.isUser ? styles.userText : styles.botText}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ebeff3" },
  header: {
    backgroundColor: "#7B00FF",
    padding: 15,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  messagesContainer: { flex: 1 },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 12,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#7B00FF",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  userText: { color: "#fff" },
  botText: { color: "#000" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#7B00FF",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
