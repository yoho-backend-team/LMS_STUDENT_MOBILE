import {
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { COLORS, icons } from '~/constants';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/shared/Header';

const TicketById = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticket } = route.params as { ticket: any };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <Header />

      <View style={styles.backContainer}>
        <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
          <Image source={icons.back_arrow} style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
        <Text style={styles.backText}>Tickets</Text>
      </View>

      <View style={styles.viewCard}>
        <Text style={styles.viewLabel}>Ticket ID</Text>
        <Text style={styles.viewValue}>{ticket.Ticket}</Text>

        <Text style={styles.viewLabel}>Priority</Text>
        <Text style={styles.viewValue}>{ticket.priority || 'Not set'}</Text>

        <Text style={styles.viewLabel}>Status</Text>
        <Text style={styles.viewValue}>{ticket.status}</Text>

        <Text style={styles.viewLabel}>Attachment</Text>
        <Text style={styles.viewValue}>
          {ticket.attachment ? ticket.attachment.name : 'No attachment'}
        </Text>

        <Text style={styles.viewLabel}>Count</Text>
        <Text style={styles.viewValue}>{ticket.count}</Text>

        <Text style={styles.viewLabel}>Description</Text>
        <Text style={[styles.viewValue, styles.textArea]}>{ticket.discription}</Text>
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
  backButton: {
    backgroundColor: COLORS.blue_01,
    padding: 10,
    borderRadius: 8,
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
  iconstyle: { width: 100 },
});
