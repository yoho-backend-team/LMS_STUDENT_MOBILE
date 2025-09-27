import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  if (message.includes('course') || message.includes('class') || message.includes('lesson')) {
    if (message.includes('progress') || message.includes('completion')) {
      return 'Your course progress is available in the Dashboard with completion percentages and deadlines.';
    }
    return 'Navigate to the Courses section to access materials, join live classes, and track progress.';
  }

  if (message.includes('payment') || message.includes('fee') || message.includes('invoice')) {
    if (message.includes('history') || message.includes('past')) {
      return 'Your complete payment history is available in the Payments section, including downloadable invoices.';
    }
    if (message.includes('pending') || message.includes('due')) {
      return 'View and pay pending dues in the Payments section with secure payment options.';
    }
    return 'Manage all payment activities in the Payments section.';
  }

  if (message.includes('profile') || message.includes('account')) {
    if (message.includes('update') || message.includes('change')) {
      return 'Update your personal information and preferences in the Profile section.';
    }
    if (message.includes('certificate')) {
      return 'Download certificates and view achievements in the Profile section.';
    }
    return 'Manage your profile, personal details, and credentials in the Profile section.';
  }

  if (message.includes('attendance') || message.includes('present') || message.includes('absent')) {
    if (message.includes('percentage') || message.includes('rate')) {
      return 'Your attendance percentage is available in the Attendance section, including class participation.';
    }
    return 'Track your attendance and participation in the Attendance section.';
  }

  if (
    message.includes('notification') ||
    message.includes('alert') ||
    message.includes('reminder')
  ) {
    return 'Stay informed with notifications for classes, assignments, and updates in the Notifications section.';
  }

  if (message.includes('help') || message.includes('support') || message.includes('issue')) {
    if (message.includes('ticket')) {
      return 'Submit a support ticket in the Help Center. Our team will respond within 24 hours.';
    }
    return 'Visit the Help Center or FAQ section for guidance, or create a ticket for personalized support.';
  }

  if (message.includes('assignment') || message.includes('homework') || message.includes('task')) {
    return 'Access assignments in your course modules with due dates, submission guidelines, and grades.';
  }

  if (message.includes('quiz') || message.includes('exam') || message.includes('test')) {
    return 'Take quizzes and exams through your Dashboard. Results are available immediately after completion.';
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello 👋! I'm your LMS assistant. How may I help you today?";
  }
  if (message.includes('thank')) {
    return "You're welcome! I'm here to help anytime.";
  }
  if (message.includes('bye') || message.includes('goodbye')) {
    return 'Goodbye! Wishing you success in your learning journey.';
  }

  // Check if message contains only random characters/numbers (no meaningful words)
  const hasMeaningfulWords =
    /[a-zA-Z]{3,}/.test(message) &&
    !/^[dfkbdkdgkdfdf232424\W\d]+$/.test(message.replace(/\s/g, ''));

  if (!hasMeaningfulWords || message.trim().length < 2) {
    return "Sorry, I didn't understand. Please try asking about courses, payments, profile, attendance, or other LMS features.";
  }

  const aiResponses = [
    "I'm here to assist you with Courses, Payments, Profile, Attendance, Notifications, and Support. What would you like help with?",
    'I can guide you through courses, payments, or technical support. Which one are you interested in?',
    "Need help with assignments, quizzes, or certificates? I've got you covered.",
    'Looking for your attendance records or upcoming classes? Check the Dashboard for details.',
    'I can help you manage your LMS experience. Try asking about courses, payments, or notifications.',
  ];

  return aiResponses[Math.floor(Math.random() * aiResponses.length)];
};

const ChatbotScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your LMS Assistant 🤖. How can I help you today?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={item.sender === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: 15 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require('../../assets/courses/arrow.png')}
            style={{ width: 24, height: 24, tintColor: '#fff' }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LMS Assistant</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area with Keyboard Avoiding */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!input.trim()}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B00FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 34, 
  },
  chatContainer: {
    padding: 10,
    paddingBottom: 5,
  },
  message: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: '#7B00FF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  botText: {
    color: '#000',
    fontSize: 16,
  },
  keyboardAvoidView: {
    flex: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#7B00FF',
    padding: 12,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
});
