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
import { COLORS, FONTS, icons } from '~/constants';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header';
import { getFileUrl } from '~/utils/imageUtils';
import toast from '~/utils/toasts';
import { SafeAreaView } from 'react-native-safe-area-context';

const TicketById = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticket } = route?.params as { ticket: any };

  const handleOpenFile = async (fileUrl: string) => {
    try {
      if (!fileUrl) return;
      const FileUrl = getFileUrl(fileUrl);
      const supported = await Linking.canOpenURL(FileUrl);
      if (supported) {
        await Linking.openURL(FileUrl);
      } else {
        toast.error('Error', "Can't open this file");
      }
    } catch (err: any) {
      toast.error('Error', err.messgae);
    }
  };

  console.log(ticket, 'ticket data');

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={icons.back_arrow} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
            <Text style={styles.backText}>Ticket- #{ticket.ticket_id}</Text>
          </View>

          <View style={styles.viewCard}>
            <Text style={styles.viewLabel}>Ticket ID</Text>
            <Text style={styles.viewValue}>{ticket.ticket_id}</Text>

            <Text style={styles.viewLabel}>Query</Text>
            <Text style={styles.viewValue}>{ticket.query}</Text>

            <Text style={styles.viewLabel}>Issue Description</Text>
            <Text style={[styles.viewValue, styles.textArea]}>{ticket.description}</Text>

            <Text style={styles.viewLabel}>Priority</Text>
            <Text style={styles.viewValue}>{ticket.priority}</Text>

            <Text style={styles.viewLabel}>Status</Text>
            <Text style={styles.viewValue}>{ticket.status}</Text>

            <Text style={styles.viewLabel}>Attachments</Text>
            {ticket?.file ? (
              <View style={styles.attachmentRow}>
                <Text style={styles.fileName}>{ticket?.file}</Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleOpenFile(ticket?.file)}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.viewValue}>No attachment</Text>
            )}
            <Text style={styles.viewLabel}>Attempt</Text>
            <Text style={styles.viewValue}>{ticket.id}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default TicketById;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#d5e2f1ff' },
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
    backgroundColor: '#d5e2f1ff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 4,
  },
  viewLabel: { ...FONTS.h3, fontWeight: 500, marginTop: 15, color: COLORS.text_title },
  viewValue: {
    ...FONTS.body4,
    marginTop: 5,
    backgroundColor: COLORS.shadow_01,
    padding: 10,
    borderRadius: 8,
    color: COLORS.text_desc,
    fontWeight: 500,
  },
  textArea: { minHeight: 70, textAlignVertical: 'top' },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: COLORS.shadow_01,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  fileName: {
    ...FONTS.body4,
    flex: 1,
    marginRight: 10,
    color: COLORS.text_desc,
    fontWeight: 500,
  },
  viewButton: {
    backgroundColor: '#7B00FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
