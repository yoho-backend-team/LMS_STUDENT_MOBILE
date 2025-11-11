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

// Function to check if message is meaningful
const isMeaningfulMessage = (message: string): boolean => {
  const trimmedMessage = message.trim().toLowerCase();

  // Check if message is too short to be meaningful
  if (trimmedMessage.length < 2) return false;

  // Common meaningless patterns (repeated characters, random keyboard mashing)
  const meaninglessPatterns = [
    /^[asdfghjkl]+$/i, // Common keyboard mashing
    /^[qwertyuiop]+$/i, // Keyboard rows
    /^[zxcvbnm]+$/i, // Keyboard bottom row
    /^([a-z])\1+$/i, // Single character repeated
    /^[0-9]+$/, // Only numbers
    /^[^a-zA-Z0-9]+$/, // Only special characters
    /^[dfkbdkdgkdfdf232424\W\d]+$/i, // Your existing pattern
  ];

  // Check against meaningless patterns
  if (meaninglessPatterns.some((pattern) => pattern.test(trimmedMessage.replace(/\s/g, '')))) {
    return false;
  }

  // List of common English words to check against
  const commonWords = [
    'hello',
    'hi',
    'hey',
    'help',
    'course',
    'class',
    'payment',
    'fee',
    'profile',
    'account',
    'attendance',
    'notification',
    'community',
    'spoken',
    'english',
    'assignment',
    'quiz',
    'exam',
    'schedule',
    'thank',
    'thanks',
    'bye',
    'goodbye',
    'what',
    'when',
    'where',
    'how',
    'why',
    'who',
    'which',
    'can',
    'could',
    'would',
    'should',
    'please',
    'sorry',
    'yes',
    'no',
    'not',
    'the',
    'and',
    'but',
    'or',
    'for',
    'with',
    'about',
    'from',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
  ];

  // Check if message contains at least one common word
  const words = trimmedMessage.split(/\s+/);
  const hasCommonWord = words.some((word) =>
    commonWords.some((commonWord) => word.includes(commonWord) || commonWord.includes(word))
  );

  // Also check for meaningful patterns like questions
  const hasQuestionWords = /(what|when|where|why|how|who|which|can|could|would|should)/i.test(
    trimmedMessage
  );
  const hasGreeting = /(hello|hi|hey|greetings|good morning|good afternoon|good evening)/i.test(
    trimmedMessage
  );

  return hasCommonWord || hasQuestionWords || hasGreeting || words.length >= 3;
};

const getBotResponse = (userMessage: string): string => {
  // First check if message is meaningful
  if (!isMeaningfulMessage(userMessage)) {
    return "Sorry, I didn't understand that message. Could you please rephrase your question? I'm here to help with courses, payments, profile, attendance, and other LMS-related topics.";
  }

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
  const [isOnline, setIsOnline] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  // Check network connectivity
  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        // For React Native, you might use NetInfo from '@react-native-community/netinfo'
        // For this example, we'll use a simple approach
        const netInfo = await fetch('https://www.google.com', { method: 'HEAD' });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkNetworkStatus();

    // Set up interval to check network status periodically
    const interval = setInterval(checkNetworkStatus, 3000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

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

    // Check if user is offline
    if (!isOnline) {
      const offlineMessage: Message = {
        id: Date.now().toString(),
        text: '📡 No Internet Connection. Please check your network and try again.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, offlineMessage]);
      setInput('');
      return;
    }

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
        <View style={styles.networkStatus}>
          <Ionicons
            name={isOnline ? 'wifi' : 'wifi-outline'}
            size={20}
            color={isOnline ? '#90EE90' : '#FF6B6B'}
          />
          <Text style={[styles.networkText, { color: isOnline ? '#90EE90' : '#FF6B6B' }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="wifi-outline" size={16} color="#fff" />
          <Text style={styles.offlineText}>No internet connection</Text>
        </View>
      )}

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
            style={[styles.input, !isOnline && styles.inputDisabled]}
            placeholder={isOnline ? 'Type a message...' : 'No internet connection...'}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={isOnline ? sendMessage : undefined}
            returnKeyType={isOnline ? 'send' : 'default'}
            blurOnSubmit={false}
            editable={isOnline}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || !isOnline) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || !isOnline}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Network status message */}
        {!isOnline && (
          <View style={styles.networkMessage}>
            <Ionicons name="warning-outline" size={14} color="#FF6B6B" />
            <Text style={styles.networkMessageText}>Connect to the internet to send messages</Text>
          </View>
        )}
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
    position: 'relative',
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
  networkStatus: {
    position: 'absolute',
    right: 16,
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  offlineBanner: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
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
  inputDisabled: {
    backgroundColor: '#e0e0e0',
    color: '#999',
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
  networkMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFF5F5',
    borderTopWidth: 1,
    borderTopColor: '#FFE0E0',
  },
  networkMessageText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});
