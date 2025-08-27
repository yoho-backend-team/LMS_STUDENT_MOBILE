'use client';

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
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

interface Message {
  id: string;
  text: string;
  isOutgoing: boolean;
  senderName?: string;
  createdAt?: string;
}

const COLORS_LIST = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
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

// Date formatting functions
const formatTime = (timestamp: any | number | Date): string => {
  if (!timestamp) return '';

  const messageDate = new Date(timestamp);
  return messageDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatMessageDate = (timestamp: string | number | Date): string => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  const isToday = messageDate.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  const daysDifference = Math.floor(
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isToday) {
    return 'Today';
  } else if (isYesterday) {
    return 'Yesterday';
  } else if (daysDifference < 7) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return messageDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const CommunityById: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { community } = route?.params;

  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [previousContentHeight, setPreviousContentHeight] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoadingAtTop, setIsLoadingAtTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const messagelist = useSelector(GetCommuntiyIdSelector);

  useEffect(() => {
    dispatch<any>(GetallMessageThunks({ community: community?._id, page: 1, limit: 15 }));
  }, [community?._id, dispatch]);

  useEffect(() => {
    if (messagelist) {
      const list = Array.isArray(messagelist) ? messagelist : messagelist.messages || [];

      const formatted = list
        .map((msg: any) => ({
          id: msg.uuid || msg._id,
          text: msg.message,
          isOutgoing: msg.sender === 'me',
          senderName: msg.sender_name || 'Unknown',
          createdAt: msg.createdAt || new Date().toISOString(),
        }))
        .sort(
          (a: Message, b: Message) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );

      if (page === 1) {
        setMessages(formatted);
        setIsInitialLoad(true);
        setShouldAutoScroll(true);
      } else {
        setMessages((prev) => [...formatted, ...prev]);
        setShouldAutoScroll(false);
      }

      setHasMoreMessages(Array.isArray(messagelist) ? false : (messagelist.hasMore ?? false));
    }
  }, [messagelist, page]);

  useEffect(() => {
    if (shouldAutoScroll && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: !isInitialLoad });
        setIsInitialLoad(false);
      }, 100);
    }
  }, [messages, shouldAutoScroll, isInitialLoad]);

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
      setShouldAutoScroll(true);
    }
  };

  const loadMoreMessages = useCallback(() => {
    if (loadingMore || !hasMoreMessages || isLoadingAtTop) return;

    setIsLoadingAtTop(true);
    setLoadingMore(true);
    const nextPage = page + 1;

    dispatch<any>(
      GetallMessageThunks({
        community: community?._id,
        page: nextPage,
        limit: 15,
      })
    )
      .then(() => {
        setPage(nextPage);
        setLoadingMore(false);
        setIsLoadingAtTop(false);
      })
      .catch(() => {
        setLoadingMore(false);
        setIsLoadingAtTop(false);
      });
  }, [loadingMore, hasMoreMessages, isLoadingAtTop, page, community?._id, dispatch]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setShouldAutoScroll(true);
  };

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const offsetY = contentOffset.y;
      const contentHeight = contentSize.height;
      const layoutHeight = layoutMeasurement.height;

      setScrollPosition(offsetY);

      const isNearBottom = offsetY > contentHeight - layoutHeight - 100;
      setShowScrollToBottom(!isNearBottom);

      if (offsetY < contentHeight - layoutHeight - 200) {
        setShouldAutoScroll(false);
      }

      if (offsetY <= 100 && hasMoreMessages && !loadingMore && !isLoadingAtTop) {
        setPreviousContentHeight(contentHeight);
        loadMoreMessages();
      }
    },
    [hasMoreMessages, loadingMore, isLoadingAtTop, loadMoreMessages]
  );

  const handleContentSizeChange = useCallback(
    (contentWidth: number, contentHeight: number) => {
      if (
        previousContentHeight > 0 &&
        contentHeight > previousContentHeight &&
        !shouldAutoScroll &&
        !isInitialLoad
      ) {
        const heightDifference = contentHeight - previousContentHeight;
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({
            y: heightDifference + 50, 
            animated: false,
          });
        });
        setPreviousContentHeight(0);
      }
    },
    [previousContentHeight, shouldAutoScroll, isInitialLoad]
  );

  const renderMessage = (msg: Message, index: number) => {
    const senderColor = getColorForSender(msg.senderName || 'Unknown');
    const currentDate = new Date(msg.createdAt || '');
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const prevDate = prevMessage ? new Date(prevMessage.createdAt || '') : null;

    const showDateDivider = !prevDate || !isSameDay(currentDate, prevDate);

    return (
      <View key={msg.id}>
        {showDateDivider && (
          <View style={styles.dateDivider}>
            <Text style={styles.dateDividerText}>{formatMessageDate(msg.createdAt || '')}</Text>
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            msg.isOutgoing ? styles.outgoingMessage : styles.incomingMessage,
          ]}>
          <View
            style={[
              styles.messageBubble,
              msg.isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
            ]}>
            {!msg.isOutgoing && (
              <Text style={[styles.senderName, { color: senderColor }]}>{msg.senderName}</Text>
            )}
            <Text
              style={[
                styles.messageText,
                msg.isOutgoing ? styles.outgoingText : styles.incomingText,
              ]}>
              {msg.text}
            </Text>
            <Text style={styles.timeText}>{formatTime(msg?.createdAt)}</Text>
          </View>
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
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <View style={styles.profileContainer}>
                <Image style={styles.avatar} source={{ uri: getImageUrl(community?.groupimage) }} />
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>{community?.group}</Text>
                  <Text style={styles.headerSubtitle}>
                    {community?.users?.length || '0'} Members
                  </Text>
                </View>
              </View>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              onContentSizeChange={handleContentSizeChange}
              scrollEventThrottle={16}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps="handled">
              {(loadingMore || isLoadingAtTop) && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.blue_01} />
                  <Text style={styles.loadingText}>Loading more messages...</Text>
                </View>
              )}

              {!hasMoreMessages && messages.length > 15 && (
                <View style={styles.noMoreMessagesContainer}>
                  <Text style={styles.noMoreMessagesText}>No more messages</Text>
                </View>
              )}

              {messages.map((msg, index) => renderMessage(msg, index))}
            </ScrollView>

            {showScrollToBottom && (
              <TouchableOpacity style={styles.scrollToBottomButton} onPress={scrollToBottom}>
                <Ionicons name="arrow-down" size={24} color="#fff" />
              </TouchableOpacity>
            )}

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
  dateDivider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateDividerText: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#ccc',
    fontSize: 12,
  },
  noMoreMessagesContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noMoreMessagesText: {
    color: '#ccc',
    fontSize: 12,
  },
  scrollToBottomButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
