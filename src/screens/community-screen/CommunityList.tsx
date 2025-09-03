import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getallCommunityThunks } from "~/features/Communityone/reducer/thunks";
import { getCommuntiySelector } from "~/features/Communityone/reducer/selector";
import Header from "~/components/shared/Header";
import { COLORS, FONTS } from "~/constants";
import { getImageUrl } from "~/utils/imageUtils"; 

export default function CommunityList() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  const communityData = useSelector(getCommuntiySelector);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getallCommunityThunks({}));
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const communityList = Array.isArray(communityData)
    ? communityData
    : communityData?.data || [];

  const filteredChats = communityList.filter((chat: any) =>
    chat?.group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.header}>Communities</Text>

     
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={16}
            color={COLORS.text_desc}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.text_desc}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearIcon}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.text_desc} />
            </TouchableOpacity>
          )}
        </View>

     
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.black} />
        ) : (
          <FlatList
            data={filteredChats}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("ChatScreen", {
                    chatId: item._id,
                    name: item.group,
                     groupimage: item.groupimage,
                  })
                }
              >
           <Image style={styles.avatar} source={ getImageUrl(item?.groupimage)
                                                          ? { uri: getImageUrl(item?.groupimage) } 
                                                           : require("../../assets/community/profileuser.png") 
  }
/>
                <View style={styles.info}>
                  <Text style={styles.groupName}>{item.group}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.last_message
                      ? `${item.last_message.sender_name}: ${item.last_message.message}`
                      : "No messages yet"}
                  </Text>
                </View>
                <Text style={styles.time}>
                  {item.last_message
                    ? new Date(item.last_message.timestamp).toLocaleTimeString()
                    : ""}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No communities found</Text>
            }
          />
        )}
      </View>
        <TouchableOpacity
                style={styles.chatbotBtn}
                onPress={() => navigation.navigate('ChatbotScreen')}>
                <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>
   
  );
}

const styles = StyleSheet.create({
  container:
   {
     flex: 1, 
     paddingTop: 10,
      backgroundColor: COLORS.white 
    },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  header:
   {
    fontSize: 20,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 24,
    marginTop: 16,
  },
  searchContainer:
   {
     position: "relative",
      marginBottom: 16 },
  searchIcon: 
  { 
    position: "absolute",
     left: 12,
      top: 14,
       zIndex: 1 
    },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#6B7280",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clearIcon: 
  { position: "absolute",
     right: 12, 
     top: 12 
    },
  card: 
  {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },
  info:
   {
     flex: 1, 
     minWidth: 0 },
  groupName:
   {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  lastMessage:
   { fontSize: 14,
     color: "#6B7280" },
  time: 
  {
     fontSize: 12,
      color: "#9CA3AF" 
    },
  emptyText: 
  {
    textAlign: "center",
    marginTop: 50,
    color: COLORS.text_desc,
    ...FONTS.h3,
  },
  chatbotBtn:
   {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#7B00FF',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
