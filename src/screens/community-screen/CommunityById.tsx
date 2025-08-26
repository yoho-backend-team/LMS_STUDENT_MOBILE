
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getImageUrl } from '~/utils/imageUtils';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GetallMessageThunks } from '../../features/Community/reducers.ts/thunks';
import { GetCommuntiyIdSelector } from '~/features/Community/reducers.ts/selectore';
import { COLORS } from '~/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Message {
  id: string;
  text: string;
  isOutgoing: boolean;
  senderName?: string;
  createdAt?: string;
}

const COLORS_LIST = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'
];

const getColorForSender = (senderName: string) => {
  if (!senderName) return '#000';
  let hash = 0;
  for (let i = 0; i < senderName.length; i++) {
    hash = senderName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS_LIST.length;
  return COLORS_LIST[index];
};

const CommunityById: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { community } = route.params;

  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const messagelist = useSelector(GetCommuntiyIdSelector);

  useEffect(() => {
    dispatch<any>(GetallMessageThunks({ community: community?._id }));
  }, [community?._id, dispatch]);

  useEffect(() => {
    if (messagelist && messagelist.length > 0) {
      const formatted = messagelist
        .map((msg: any) => ({
          id: msg.uuid || msg._id,
          text: msg.message || msg.text,
          isOutgoing: msg.sender === 'me',
          senderName: msg.sender_name || 'Unknown',
          createdAt: msg.createdAt || new Date().toISOString(),
        }))
        .sort((a: Message, b: Message) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()); // Sort oldest -> newest
      setMessages(formatted);
    }
  }, [messagelist]);

  const handleSend = () => {
    if (message.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: message,
        isOutgoing: true,
        senderName: 'Me',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setMessage('');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50); // small delay to allow rendering
  }, [messages]);

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderMessage = (msg: Message) => {
    const senderColor = getColorForSender(msg.senderName || 'Unknown');

    return (
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
          {!msg.isOutgoing && (
            <Text style={[styles.senderName, { color: senderColor }]}>
              {msg.senderName}
            </Text>
          )}
          <Text
            style={[
              styles.messageText,
              msg.isOutgoing ? styles.outgoingText : styles.incomingText,
            ]}
          >
            {msg.text}
          </Text>
          <Text style={styles.timeText}>{formatTime(msg.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={{ flex: 1}}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <View style={styles.profileContainer}>
                <Image style={styles.avatar} source={{ uri: getImageUrl(community?.groupimage) }} />
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>{community?.group}</Text>
                  <Text style={styles.headerSubtitle}>
                    {community?.users?.length || 'Unknown'} Members
                  </Text>
                </View>
              </View>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
            </ScrollView>

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
    </>
  );
};

export default CommunityById;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    marginRight: 12,
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
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
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
