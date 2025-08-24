import {
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { COLORS, icons } from '~/constants';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header';

const TicketById = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticket } = route.params as { ticket: any };

  const handleOpenFile = async (fileUrl: string) => {
    try {
      if (!fileUrl) return;
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        alert("Can't open this file");
      }
    } catch (err) {
      console.log('Error opening file: ', err);
    }
  };

  const getFileName = (filePath: string) => {
    if (!filePath) return '';
    return filePath.split('/').pop() || filePath;
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <Header />

      <View style={styles.backContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back_arrow} style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
        <Text style={styles.backText}>Tickets</Text>
      </View>

      <View style={styles.viewCard}>
        <Text style={styles.viewLabel}>Ticket ID</Text>
        <Text style={styles.viewValue}>{ticket.ticket_id}</Text>

        <Text style={styles.viewLabel}>Priority</Text>
        <Text style={styles.viewValue}>{ticket.priority}</Text>

        <Text style={styles.viewLabel}>Status</Text>
        <Text style={styles.viewValue}>{ticket.status}</Text>

        <Text style={styles.viewLabel}>Attachment</Text>
        {ticket?.file ? (
          <View style={styles.attachmentRow}>
            <Text style={styles.fileName}>{getFileName(ticket.file)}</Text>
            <TouchableOpacity style={styles.viewButton} onPress={() => handleOpenFile(ticket.file)}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.viewValue}>No attachment</Text>
        )}

        <Text style={styles.viewLabel}>Count</Text>
        <Text style={styles.viewValue}>{ticket.id}</Text>

        <Text style={styles.viewLabel}>Description</Text>
        <Text style={[styles.viewValue, styles.textArea]}>{ticket.description}</Text>
      </View>
    </ScrollView>
  );
};

export default TicketById;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: COLORS.white },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 5,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  viewCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 4,
  },
  viewLabel: { fontSize: 16, fontWeight: '600', marginTop: 15 },
  viewValue: {
    fontSize: 16,
    marginTop: 5,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  fileName: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  viewButton: {
    backgroundColor: COLORS.blue_01,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
