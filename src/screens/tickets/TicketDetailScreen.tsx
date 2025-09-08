import { StyleSheet, Text, View, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/shared/Header";

const TicketDetailScreen = () => {
  const route = useRoute<any>();
  const { ticket } = route.params; 

  const openAttachment = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => alert("Unable to open file"));
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header />

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.code}>TICKET #{ticket.ticket_id || ticket.code}</Text>
          <Text style={styles.date}>{ticket.createdAt || ticket.date}</Text>
        </View>

        <Text style={styles.title}>{ticket.query || ticket.title}</Text>
        <Text style={styles.desc}>{ticket.description}</Text>

        {ticket.attachment && (
          <TouchableOpacity
            onPress={() => openAttachment(ticket.attachment)}
            style={styles.attachmentBtn}
          >
            <Text style={styles.attachmentText}>📎 View Attachment</Text>
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.statusPill,
            { backgroundColor: ticket.status?.toLowerCase() === "opened" ? "#E0E7FF" : "#FEE2E2" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: ticket.status?.toLowerCase() === "opened" ? "#1E40AF" : "#B91C1C" },
            ]}
          >
            {ticket.status}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TicketDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  code: { color: "#7B00FF", fontWeight: "700" },
  date: { color: "#6B7280", fontSize: 12 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  desc: { fontSize: 14, color: "#374151", marginBottom: 10 },
  attachmentBtn: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  attachmentText: { color: "#2563EB", fontWeight: "600" },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 12, fontWeight: "600" },
});
