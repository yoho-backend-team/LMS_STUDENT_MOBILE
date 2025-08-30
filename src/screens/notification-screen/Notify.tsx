import React, { useEffect, useState, useCallback } from "react";
import {
  StatusBar,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllNotificationsThunk,
} from "../../features/notification/reducers/thunks";
import { selectNotifications } from "../../features/notification/reducers/selectors";
import {
  deleteNotification,
  updateNotificationStatus,
} from "../../features/notification/services";
import toast from "../../utils/toasts";
import { formatDateandTime, formatMessageDate } from "../../utils/formatDate";

type NotificationType = {
  uuid: string;
  title: string;
  body: string;
  status: "read" | "unread";
  createdAt: string;
};

export default function NotificationScreen() {
  const navigation = useNavigation();
  const dispatch: any = useDispatch();
  const notifications: NotificationType[] = useSelector(selectNotifications);

  const [activeTab, setActiveTab] = useState<"All" | "Read" | "Unread">("All");
  const [search, setSearch] = useState("");
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  useEffect(() => {
    loadNotifications();
  }, [dispatch]);

  const loadNotifications = () => {
    dispatch(getAllNotificationsThunk({}));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getAllNotificationsThunk({}))
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  // 🔎 Filtering
  const filteredNotifications =
    notifications?.filter((n) => {
      const matchTab =
        activeTab === "All" ? true : n.status === activeTab.toLowerCase();
      const matchSearch =
        (n.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (n.body?.toLowerCase() || "").includes(search.toLowerCase());
      return matchTab && matchSearch;
    }) || [];

  // 📄 Pagination
  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleNotificationPress = async (item: NotificationType) => {
    setSelectedNotification(item);

    if (item.status === "unread") {
      try {
        await updateNotificationStatus({ uuid: item.uuid, status: "read" });
        loadNotifications();
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification({ uuid: id });
      toast.success("Success", "Notification deleted successfully!");
      setSelectedNotification(null);
      loadNotifications();
    } catch (error) {
      toast.error("Error", "Failed to delete notification.");
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <SafeAreaView edges={["top"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation.goBack()}>
              <Image
                source={require("../../assets/profile/back.png")}
                style={styles.backbutton}
              />
            </Pressable>
            <Text style={styles.headerTitle}>Notification</Text>
          </View>
        </View>

        <Text style={styles.headerCount}>
          {notifications?.length} Messages /{" "}
          {notifications?.filter((n) => n.status === "unread").length} Unread
        </Text>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, styles.neumorphicBox]}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabWrapper}>
          {["All", "Read", "Unread"].map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab as any)}>
              {activeTab === tab ? (
                <LinearGradient
                  colors={["#7B00FF", "#9333ea"]}
                  style={[styles.activeTab, styles.innerShadow]}
                >
                  <Text style={styles.activeTabText}>{tab}</Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.inactiveTab,
                    styles.neumorphicBox,
                    styles.innerShadow,
                  ]}
                >
                  <Text style={styles.inactiveTabText}>{tab}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Notifications List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#000"]}
              tintColor="#000"
            />
          }
        >
          {currentNotifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications found</Text>
          ) : (
            currentNotifications.map((item) => (
              <Pressable
                key={item.uuid}
                onPress={() => handleNotificationPress(item)}
                style={[styles.card, styles.neumorphicCard]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    item.status === "unread"
                      ? styles.unreadIconWrapper
                      : styles.readIconWrapper,
                  ]}
                >
                  <Text
                    style={
                      item.status === "unread"
                        ? styles.unreadIcon
                        : styles.readIcon
                    }
                  >
                    {item.status === "unread" ? "🔔" : "🔕"}
                  </Text>
                </View>
                <View style={styles.cardContent}>
                  <Text
                    style={
                      item.status === "unread"
                        ? styles.unreadTitle
                        : styles.readTitle
                    }
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDesc,
                      item.status === "read" && styles.readDesc,
                    ]}
                  >
                    {item.body}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatMessageDate(item.createdAt)}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Pagination */}
        {filteredNotifications.length > notificationsPerPage && (
          <View style={styles.paginationContainer}>
            <Pressable
              style={[styles.pageButton, currentPage === 1 && styles.disabledPage]}
              onPress={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </Pressable>

            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>

            <Pressable
              style={[
                styles.pageButton,
                currentPage === totalPages && styles.disabledPage,
              ]}
              onPress={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </Pressable>
          </View>
        )}

        {/* Modal */}
        <Modal visible={!!selectedNotification} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {selectedNotification && (
                <>
                  <Text style={styles.modalTitle}>
                    {selectedNotification.title}
                  </Text>
                  <Text style={styles.modalDesc}>
                    {selectedNotification.body}
                  </Text>
                  <Text style={styles.modalDate}>
                    {formatDateandTime(selectedNotification.createdAt)}
                  </Text>
                  <View style={styles.modalActions}>
                    <Pressable
                      style={[styles.modalBtn, { backgroundColor: "#e5e7eb" }]}
                      onPress={() => setSelectedNotification(null)}
                    >
                      <Text style={{ color: "#000", fontWeight: "600" }}>
                        Cancel
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.modalBtn, { backgroundColor: "#ef4444" }]}
                      onPress={() => handleDelete(selectedNotification.uuid)}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Delete
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 16, backgroundColor: "#f3f4f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 3,
  },
  backbutton: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "600", color: "#000" },
  headerCount: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
    marginBottom: 15,
    marginRight: 10,
  },
  searchWrapper: { marginBottom: 16 },
  searchInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#374151",
  },
  tabWrapper: { flexDirection: "row", marginBottom: 20, gap: 5, justifyContent: "space-between" },
  activeTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  inactiveTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveTabText: { color: "#374151", fontWeight: "500", textAlign: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  unreadIconWrapper: { backgroundColor: "#E0E7FF" },
  readIconWrapper: { backgroundColor: "#F3F4F6" },
  unreadIcon: { fontSize: 20, color: "#4338CA", fontWeight: "bold" },
  readIcon: { fontSize: 20, color: "#9CA3AF" },
  cardContent: { flex: 1 },
  unreadTitle: { fontWeight: "bold", color: "#111827", marginBottom: 2, fontSize: 16 },
  readTitle: { fontWeight: "600", color: "#6b7280", marginBottom: 2, fontSize: 16 },
  cardDesc: { fontSize: 14, color: "#6b7280" },
  readDesc: { color: "#9ca3af" },
  dateText: { fontSize: 12, color: "#6b7280", textAlign: "right" },
  neumorphicBox: {
    shadowColor: "#000",
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  neumorphicCard: {
    shadowColor: "#000",
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  innerShadow: { shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 155,
    fontWeight: "500",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalDesc: { fontSize: 14, color: "#374151", marginBottom: 20 },
  modalDate: { marginTop: 8, color: "#6b7280", fontSize: 12, textAlign: "right" },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#7B00FF",
    borderRadius: 8,
  },
  disabledPage: { backgroundColor: "#9ca3af" },
  pageButtonText: { color: "#fff", fontWeight: "600" },
  pageInfo: { fontWeight: "600", fontSize: 14 },
});
