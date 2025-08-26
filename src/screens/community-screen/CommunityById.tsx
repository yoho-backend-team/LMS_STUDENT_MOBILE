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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchCommunityMessages,
  sendMessage,
} from "~/features/Community/reducer/Communitythunks";
import {
  addLocalMessage,
  setCurrentCommunity,
} from "~/features/Community/reducer/CommunitySlice";
import {
  selectCurrentCommunity,
  selectCommunityLoading,
} from "~/features/Community/reducer/CommunitySelectors";

import { RootState, AppDispatch } from "~/store";

interface RouteParams {
  communityId: string;
  communityName: string;
  members: number;
}

const CommunityById: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { communityId, communityName, members } = route.params as RouteParams;

  const dispatch = useDispatch<AppDispatch>();
  const currentCommunity = useSelector(selectCurrentCommunity);
  const loading = useSelector(selectCommunityLoading);

  const [message, setMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    dispatch(
      setCurrentCommunity({
        id: communityId,
        name: communityName,
        members,
        messages: [],
      })
    );

    dispatch(fetchCommunityMessages(communityId));
  }, [dispatch, communityId, communityName, members]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [currentCommunity?.messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMsg = {
        id: `temp-${Date.now()}`,
        content: message, // ✅ match schema
        sender: { id: "me", name: "You" },
        timestamp: new Date().toISOString(),
        isOutgoing: true,
      };

      dispatch(addLocalMessage(newMsg));
      dispatch(sendMessage({ communityId, message }));
      setMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = (msg: any) => (
    <View
      key={msg.id}
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
          {msg.content}
        </Text>
        <Text
          style={[
            styles.timeText,
            msg.isOutgoing ? styles.outgoingTime : styles.incomingTime,
          ]}
        >
          {formatTime(msg.timestamp)}
        </Text>
      </View>
    </View>
  );

  if (loading && !currentCommunity?.messages?.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a4a47" />
        </View>
      </SafeAreaView>
    );
  }

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
                <Text style={styles.headerSubtitle}>
                  {currentCommunity?.members || 0} Members
                </Text>
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
            {currentCommunity?.messages?.map(renderMessage)}
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
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

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
  profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#333", marginRight: 12 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  headerSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  chatContainer: { flex: 1, backgroundColor: "#1a4a47" },
  chatContent: { padding: 16, paddingBottom: 20 },
  messageContainer: { marginVertical: 4 },
  outgoingMessage: { alignItems: "flex-end" },
  incomingMessage: { alignItems: "flex-start" },
  messageBubble: { maxWidth: "80%", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  outgoingBubble: { backgroundColor: "#7ed321", borderBottomRightRadius: 4 },
  incomingBubble: { backgroundColor: "#e5e7eb", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 18 },
  outgoingText: { color: "#000" },
  incomingText: { color: "#111827" },
  timeText: { fontSize: 10, marginTop: 4 },
  outgoingTime: { color: "rgba(0, 0, 0, 0.6)", textAlign: "right" },
  incomingTime: { color: "rgba(17, 24, 39, 0.7)" },
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
});

export default CommunityById;
