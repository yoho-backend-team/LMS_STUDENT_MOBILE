import React, { useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";

import Header from "~/components/shared/Header";
import { COLORS } from "~/constants";
import { RootStackParamList } from "../../routes/index";

import {
  selectStudentCommunity,
  selectLoading,
} from "~/features/Community/reducer/CommunitySelectors";
import { getAllStudentCommunities } from "~/features/Community/reducer/Communitythunks";
import { AppDispatch } from "~/store";

type CommunitiesScreenNavProp = StackNavigationProp<
  RootStackParamList,
  "CommunitiesScreen"
>;

const Communities = () => {
  const navigation = useNavigation<CommunitiesScreenNavProp>();
  const dispatch = useDispatch<AppDispatch>();

  const communities = useSelector(community => selectStudentCommunity(community));
  const loading = useSelector(selectLoading);
useEffect(() => {
  // replace with actual courseId
  dispatch(getAllStudentCommunities("67f3b7fcb8d2634300cc87b6"));
}, [dispatch]);

console.log("👀 Communities data:", communities);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={["top"]} style={styles.container}>
        <Header />

        <View style={styles.content}>
          <Text style={styles.heading}>Community</Text>

          {/* Search */}
          <View style={styles.searchContainers}>
            <Ionicons
              name="search"
              size={16}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.black} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {communities?.map((community: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("CommunityViewScreen", {
                      communityId: community._id,
                      communityName: community.name,
                      members: community.members?.length || 0,
                    })
                  }
                >
                  <View style={styles.avatar} />
                  <View style={styles.messageContent}>
                    <Text style={styles.messageName}>{community.name}</Text>
                    <Text style={styles.messageText}>
                      {community.description || "Tap to chat"}
                    </Text>
                  </View>
                  <View style={styles.messageRight}>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Communities;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#ebeff3", // light gray background
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937", // gray-800
    marginBottom: 16,
    marginTop: 16,
  },
  searchContainers: {
    position: "relative",
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#6B7280",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#000",
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  messageName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: "#6B7280",
  },
  messageRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  messageTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  checkContainer: {
    width: 20,
    height: 20,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

