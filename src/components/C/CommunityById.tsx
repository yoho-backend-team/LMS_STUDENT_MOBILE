"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from "react-native"

interface Message {
  id: string
  text: string
  isOutgoing: boolean
}

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState("")
  const [messages] = useState<Message[]>([
    { id: "1", text: "Hey there!", isOutgoing: false },
    { id: "2", text: "Hello! How are you?", isOutgoing: true },
    { id: "3", text: "I'm doing great, thanks for asking", isOutgoing: false },
    { id: "4", text: "That's wonderful to hear!", isOutgoing: true },
    { id: "5", text: "What are your plans for today?", isOutgoing: true },
    { id: "6", text: "Just working on some projects", isOutgoing: false },
    { id: "7", text: "Sounds productive!", isOutgoing: true },
    { id: "8", text: "Yeah, staying busy", isOutgoing: false },
    { id: "9", text: "Let me know if you need any help", isOutgoing: true },
  ])

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message logic here
      setMessage("")
    }
  }

  const renderMessage = (msg: Message) => (
    <View
      key={msg.id}
      style={[styles.messageContainer, msg.isOutgoing ? styles.outgoingMessage : styles.incomingMessage]}
    >
      <View style={[styles.messageBubble, msg.isOutgoing ? styles.outgoingBubble : styles.incomingBubble]}>
        <Text style={[styles.messageText, msg.isOutgoing ? styles.outgoingText : styles.incomingText]}>{msg.text}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>MERN 2025</Text>
            <Text style={styles.headerSubtitle}>5 Member</Text>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Message Input */}
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
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#1a4a47",
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
  },
  outgoingMessage: {
    alignItems: "flex-end",
  },
  incomingMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  outgoingBubble: {
    backgroundColor: "#7ed321",
    borderBottomRightRadius: 4,
  },
  incomingBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  outgoingText: {
    color: "#000",
  },
  incomingText: {
    color: "#333",
  },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    fontSize: 16,
    color: "#666",
  },
})

export default ChatScreen
