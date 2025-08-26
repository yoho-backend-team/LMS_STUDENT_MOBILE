import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header';
import { COLORS } from '~/constants';
import Icon from 'react-native-vector-icons/Feather';

const Tickets = () => {
  const [filter, setFilter] = useState('All');
  const navigation = useNavigation();

  const tickets = [
    {
      id: 1,
      count: 1,
      Ticket: 'TICKET #ANTITS01',
      Date: '11 april',
      title: 'Created from Student App',
      discription: 'App Created Successfully',
      status: 'opened',
      priority: 'High',
      attachment: null,
    },
    {
      id: 2,
      count: 1,
      Ticket: 'TICKET #ANTITA00',
      Date: '10 dec',
      title: 'Ticket Created',
      discription: 'Discription',
      status: 'closed',
      priority: 'Medium',
      attachment: null,
    },
    {
      id: 3,
      count: 1,
      Ticket: 'TICKET #ANTITBSD',
      Date: '14 jan',
      title: 'Created from Student App',
      discription: 'App Created Successfully',
      status: 'opened',
      priority: 'Low',
      attachment: null,
    },
    {
      id: 4,
      count: 1,
      Ticket: 'TICKET #ANTITCAD',
      Date: '2 july',
      title: 'Ticket Created',
      discription: 'Discription',
      status: 'closed',
      priority: 'Medium',
      attachment: null,
    },
  ];

  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const filteredTickets = tickets.filter((ticket) =>
    filter === 'All' ? true : ticket.status === filter.toLowerCase()
  );

  const ticketsByMonth = months.map((month) => ({
    month,
    tickets: filteredTickets.filter((ticket) =>
      ticket.Date.toLowerCase().includes(month.slice(0, 3))
    ),
  }));

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        <View style={styles.ticketRow}>
          <Text style={styles.contain}>Ticket</Text>
          <TouchableOpacity
            style={styles.creatbutton}
            onPress={() => navigation.navigate('CreateTicket' as never)}>
            <Text style={styles.creatbuttonText}>Create Ticket</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contain}>
          {['All', 'Opened', 'Closed'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.button, filter === option && styles.activeButton]}
              onPress={() => setFilter(option)}>
              <Text style={[styles.text, filter === option && styles.activeText]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.cards}>
          {ticketsByMonth.reverse().map(({ month, tickets }) => (
            <View key={month}>
              {tickets.map((ticket) => (
                <TouchableOpacity
                  key={ticket.id}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('TicketViewScreen' as never, { ticket } as never)
                  }>
                  <View style={styles.ticketRow}>
                    <Text style={styles.cardTiCKET}>{ticket.Ticket}</Text>
                    <Text style={styles.cardDate}>{ticket.Date}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{ticket.title}</Text>
                  <Text style={styles.cardDiscription}>{ticket.discription}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="link" size={18} color="gray" />
                      <Text style={{ marginLeft: 5, color: 'gray' }}>{ticket.count}</Text>
                    </View>
                    <Text style={styles.cardStatus}>{ticket.status}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Tickets;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: COLORS.white },
  contain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: { fontSize: 15, color: 'black' },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.text_desc,
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatbutton: {
    backgroundColor: '#2B00FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  creatbuttonText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  activeButton: { backgroundColor: '#2B00FF' },
  activeText: { color: '#fff' },
  cards: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold' },
  cardTiCKET: { fontSize: 17, fontWeight: 'bold', color: '#5585FF' },
  cardDiscription: { fontSize: 12, color: 'gray' },
  cardStatus: { marginTop: 5, color: 'gray', textAlign: 'right' },
  cardDate: { fontSize: 17, color: 'gray', marginBottom: 5 },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
