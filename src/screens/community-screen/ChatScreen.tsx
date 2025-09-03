import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getallMessageThunks } from "~/features/Communityone/reducer/thunks";
import { getCommuntiyIdSelector } from "~/features/Communityone/reducer/selector";
// import { COLORS } from "~/constants";
import { getImageUrl } from "~/utils/imageUtils";
import Header from "~/components/shared/Header";

export default function ChatScreen() {
  const route = useRoute<any>();
  const { chatId, name, groupimage } = route.params;
  const dispatch = useDispatch<any>();
  const flatListRef = useRef<FlatList>(null);

  const messagesFromStore = useSelector(getCommuntiyIdSelector);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
   const navigation = useNavigation();


  useEffect(() => {
    dispatch(getallMessageThunks({ community: chatId, page: 1, limit: 20 }));
  }, [chatId, dispatch]);

 
  useEffect(() => {
    console.log("messagesFromStore:", messagesFromStore);

    if (Array.isArray(messagesFromStore)) {
      setMessages(messagesFromStore);
    } else if (messagesFromStore?.messages) {
      setMessages(messagesFromStore.messages);
    }
  }, [messagesFromStore]);

 
  const handleSend = () => {
    if (!message.trim()) return;

    const newMsg = {
      _id: Date.now().toString(),
      message,
      sender_name: "Me",
      sender: "me",
      avatar: null, 
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

   
  };

  const renderItem = ({ item }: { item: any }) => {
    const isOutgoing = item.sender === "me";
    return (
      <View
        style={[
          styles.messageRow,
          isOutgoing ? styles.outgoingRow : styles.incomingRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
          ]}
        >
          {!isOutgoing && (
            <Text style={styles.senderName}>{item.sender_name}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isOutgoing ? styles.outgoingText : styles.incomingText,
            ]}
          >
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
   <SafeAreaView style={styles.container}>
      <Header />
     
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
  <Ionicons name="arrow-back" size={24} color="#333" />
</TouchableOpacity>
    <Image
          style={styles.headerAvatar}
          source={
            getImageUrl(groupimage)
              ? { uri: getImageUrl(groupimage) }
              : require("../../assets/community/profileuser.png")
          }
        />
        <Text style={styles.headerTitle}>{name}</Text>
      </View>


      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

   
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a Message"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: 
  {
     flex: 1,
      backgroundColor: "#f5f5f5"
   },
  header: 
  {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerAvatar: {
  width: 32,
  height: 32,
  borderRadius: 16,
  marginRight: 8,
},
  headerTitle:
   {
     fontSize: 16, 
     fontWeight: "600",
      marginLeft: 12 },
  chatContent:
   {
     padding: 16 
    },
  messageRow: 
  { 
    flexDirection: "row", 
    marginVertical: 4, 
    alignItems: "flex-end" 
  },
  incomingRow: 
  { 
    justifyContent: "flex-start" 
  },
  outgoingRow: 
  { 
    justifyContent: "flex-end" 
  },
  avatar: 
  { 
    width: 32, 
    height: 32,
     borderRadius: 16,
      marginRight: 8 
    },
  messageBubble:
   {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  outgoingBubble: 
  {
     backgroundColor: "#7ed321", 
    borderBottomRightRadius: 4 
  
  },
  incomingBubble: 
  { 
    backgroundColor: "#fff",
     borderBottomLeftRadius: 4 
    },
  messageText: 
  { 
    fontSize: 14,
     lineHeight: 18 
    },
  outgoingText: 
  { 
    color: "#000"
   },
  incomingText:
   { 
    color: "#333" 
  },
  senderName: 
  {
     fontSize: 12, 
    fontWeight: "600",
     marginBottom: 2
     },
  inputContainer:
   {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
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
    backgroundColor: "#4CAF50", 
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
});
