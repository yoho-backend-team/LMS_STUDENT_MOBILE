import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "~/components/shared/Header";
import { useDispatch, useSelector } from "react-redux";
import { getallTicketThunks } from "~/features/Ticketpage/reducers/thunk";
import { getTicketSelector } from "~/features/Ticketpage/reducers/selector";

const TicketListScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  const [tab, setTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const ticketState = useSelector(getTicketSelector) || {};
  const tickets = Array.isArray(ticketState)
    ? ticketState
    : ticketState?.tickets || [];
  const totalPages = ticketState?.totalPages || 1;

 
  useEffect(() => {
    let statusParam: string | undefined;

    if (tab === "Open") statusParam = "opened";
    if (tab === "Close") statusParam = "closed";

    dispatch(getallTicketThunks({ page: currentPage, status: statusParam }));
  }, [dispatch, tab, currentPage]);

  const handleTabChange = (t: string) => {
    setTab(t);
    setCurrentPage(1);
  };

  const loadNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const loadPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderTicket = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() =>
          navigation.navigate("TicketDetailScreen", { ticket: item })
        }
      >
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketCode}>
            TICKET #{item.ticket_id || item.code}
          </Text>
          <Text style={styles.ticketDate}>{item.createdAt || item.date}</Text>
        </View>

        <Text style={styles.ticketTitle}>{item.query || item.title}</Text>

        <View style={styles.ticketFooter}>
          <Text style={{ fontSize: 12, color: "#6B7280" }}>ID: {item.id}</Text>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor:
                  item.status?.toLowerCase() === "opened"
                    ? "#E0E7FF"
                    : "#FEE2E2",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status?.toLowerCase() === "opened"
                      ? "#1E40AF"
                      : "#B91C1C",
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header />

      
      <View style={styles.topRow}>
        <Text style={styles.heading}>Tickets</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("TicketCreateScreen")}
        >
          <LinearGradient
            colors={["#7B00FF", "#B200FF"]}
            style={styles.createBtn}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Create Ticket
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      
      <View style={styles.tabRow}>
        {["All", "Open", "Close"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => handleTabChange(t)}
            style={[styles.tabBtn, tab === t && styles.activeTab]}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

 
      <FlatList
        data={tickets}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        renderItem={renderTicket}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}
          >
            No tickets found
          </Text>
        }
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        <LinearGradient
          colors={
            currentPage === 1 ? ["#E0E0E0", "#E0E0E0"] : ["#7B00FF", "#B200FF"]
          }
          style={styles.pageGradient}
        >
          <TouchableOpacity
            onPress={loadPrevPage}
            disabled={currentPage === 1}
            style={styles.pageBtn}
          >
            <Text style={styles.pageText}>Previous</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>

        <LinearGradient
          colors={
            currentPage === totalPages
              ? ["#E0E0E0", "#E0E0E0"]
              : ["#7B00FF", "#B200FF"]
          }
          style={styles.pageGradient}
        >
          <TouchableOpacity
            onPress={loadNextPage}
            disabled={currentPage === totalPages}
            style={styles.pageBtn}
          >
            <Text style={styles.pageText}>Next</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default TicketListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  heading: { fontSize: 16, fontWeight: "600", color: "#111827" },

  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  tabText: { color: "#6B7280", fontWeight: "500" },
  activeTab: { backgroundColor: "#7B00FF" },
  activeTabText: { color: "white" },

  createBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  ticketCode: { color: "#7B00FF", fontWeight: "700" },
  ticketDate: { color: "#6B7280", fontSize: 12 },
  ticketTitle: { fontWeight: "600", marginBottom: 4, color: "#111827" },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "600" },

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  pageGradient: { borderRadius: 6, overflow: "hidden", minWidth: 90 },
  pageBtn: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pageText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  pageInfo: { fontSize: 14, color: "#374151", fontWeight: "500" },
});
