import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "~/components/shared/Header";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { GetallTicketThunks } from "../../features/Ticket/reducers/Thunks";
import { GetTicketSelector } from "../../features/Ticket/reducers/Selectors";

const TicketListScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  const [tab, setTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const ticketState = useSelector(GetTicketSelector) || {};
  const tickets = Array.isArray(ticketState)
    ? ticketState
    : ticketState?.tickets || [];
  const totalPages = ticketState?.totalPages || 1;

  useEffect(() => {
    dispatch(GetallTicketThunks({ page: 1 }));
  }, [dispatch]);

  const filtered = tickets.filter((t: any) =>
    tab === "All"
      ? true
      : tab === "Open"
      ? t.status?.toLowerCase() === "opened"
      : t.status?.toLowerCase() === "closed"
  );

  const loadNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(GetallTicketThunks({ page: nextPage }));
    }
  };

  const loadPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      dispatch(GetallTicketThunks({ page: prevPage }));
    }
  };

  const toggleExpand = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  const renderTicket = ({ item }: any) => {
    const isExpanded = expandedTicketId === item.id;

    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => toggleExpand(item.id)}
      >
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketCode}>
            TICKET #{item.ticket_id || item.code}
          </Text>
          <Text style={styles.ticketDate}>{item.createdAt || item.date}</Text>
        </View>

        <Text style={styles.ticketTitle}>{item.query || item.title}</Text>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.ticketDesc}>{item.description}</Text>
            <Text style={styles.ticketDetail}>
              Priority: {item.priority || "N/A"}
            </Text>
            <Text style={styles.ticketDetail}>
              Assigned To: {item.assignedTo || "Unassigned"}
            </Text>
          </View>
        )}

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

      {/* Header Row */}
      <View style={styles.topRow}>
        <Text style={styles.heading}>Ticket</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("TicketCreateScreen")}
        >
          <LinearGradient colors={["#7B00FF", "#B200FF"]} style={styles.createBtn}>
            <Text style={{ color: "white", fontWeight: "600" }}>
              Create Tickets
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["All", "Open", "Close"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabBtn, tab === t && styles.activeTab]}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
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

  // Header
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  heading: { fontSize: 16, fontWeight: "600", color: "#111827" },

  // Tabs
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

  // Create Button
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
  ticketDesc: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  ticketDetail: { fontSize: 12, color: "#374151", marginBottom: 4 },

  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "600" },

  // Pagination
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