import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  isOutgoing: boolean;
}

const CommunityById: React.FC = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey there!', isOutgoing: false },
    { id: '2', text: 'Hello! How are you?', isOutgoing: true },
    { id: '3', text: "I'm doing great, thanks for asking", isOutgoing: false },
    { id: '4', text: "That's wonderful to hear!", isOutgoing: true },
    { id: '5', text: 'What are your plans for today?', isOutgoing: true },
    { id: '6', text: 'Just working on some projects', isOutgoing: false },
    { id: '7', text: 'Sounds productive!', isOutgoing: true },
    { id: '8', text: 'Yeah, staying busy', isOutgoing: false },
    { id: '9', text: 'Let me know if you need any help', isOutgoing: true },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (message.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: message,
        isOutgoing: true,
      };
      setMessages((prev) => [...prev, newMsg]);
      setMessage('');
    }
  };

  useEffect(() => {
    // Auto scroll to bottom whenever messages update
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (msg: Message) => (
    <View
      key={msg.id}
      style={[
        styles.messageContainer,
        msg.isOutgoing ? styles.outgoingMessage : styles.incomingMessage,
      ]}>
      <View
        style={[
          styles.messageBubble,
          msg.isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
        ]}>
        <Text
          style={[styles.messageText, msg.isOutgoing ? styles.outgoingText : styles.incomingText]}>
          {msg.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Dismiss keyboard when tapping outside */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.profileContainer}>
              <View style={styles.profileIcon} />
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>MERN 2025</Text>
                <Text style={styles.headerSubtitle}>5 Members</Text>
              </View>
            </View>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#1a4a47',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
  },
  outgoingMessage: {
    alignItems: 'flex-end',
  },
  incomingMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  outgoingBubble: {
    backgroundColor: '#7ed321',
    borderBottomRightRadius: 4,
  },
  incomingBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  outgoingText: {
    color: '#000',
  },
  incomingText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a4a47',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
