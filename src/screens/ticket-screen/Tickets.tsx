

import { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, icons } from '~/constants';
import Icon from 'react-native-vector-icons/Feather';
import { GetallTicketThunks } from '../../features/Ticket/reducers/Thunks';
import { GetTicketSelector } from '~/features/Ticket/reducers/Selectors';
import { formatDateandmonth } from '../../utils/formatDate';
import { LinearGradient } from 'expo-linear-gradient';

const Tickets = () => {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const tickets = useSelector(GetTicketSelector);
  const totalPages = tickets?.totalPages || 1;

  const fetchTickets = (page = currentPage) => {
    dispatch(GetallTicketThunks({ page }));
  };

  useEffect(() => {
    fetchTickets(1);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets(currentPage);
    setRefreshing(false);
  };

  const loadNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTickets(nextPage);
    }
  };

  const loadPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchTickets(prevPage);
    }
  };

  const filteredTickets = tickets?.tickets?.filter((ticket: any) =>
    filter === 'All' ? true : ticket?.status?.toLowerCase() === filter.toLowerCase()
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* <Header /> */}

        <View style={[styles.ticketRow, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow}
              style={{ width: 25, height: 25, marginLeft: 15 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tickets</Text>
          <View style={{ flex: 1 }} />
          <LinearGradient
            colors={['#7B00FF', '#B200FF']}
            start={{ x: 0.134, y: 0.021 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}>
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={() => navigation.navigate('CreateTicket' as never)}>
              <Text style={styles.buttonText}>Create Ticket</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>


        <View style={styles.filterContainer}>
          {['All', 'Opened', 'Closed'].map((option) => (
            <LinearGradient
              key={option}
              colors={
                filter === option
                  ? ['#7B00FF', '#B200FF']
                  : ['#E0E0E0', '#E0E0E0']
              }
              start={{ x: 0.134, y: 0.021 }}
              end={{ x: 1, y: 1 }}
              style={styles.filterGradient}>
              <TouchableOpacity
                style={styles.buttonInner}
                onPress={() => setFilter(option)}>
                <Text
                  style={[
                    styles.filterText,
                    filter === option && { color: '#fff' },
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>

        <ScrollView
          style={styles.cards}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {filteredTickets?.length > 0 ? (
            filteredTickets.map((ticket: any) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('TicketViewScreen' as never, { ticket } as never)
                }>
                <View style={styles.ticketRow}>
                  <Text style={styles.cardTiCKET}>Ticket ID: {ticket?.ticket_id}</Text>
                  <Text style={styles.cardDate}>
                    {ticket?.createdAt ? formatDateandmonth(ticket?.createdAt) : ''}
                  </Text>
                </View>
                <Text style={styles.cardTitle}>{ticket?.query}</Text>
                <Text style={styles.cardDiscription}>{ticket?.description}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="link" size={18} color="gray" />
                    <Text style={{ marginLeft: 5, color: 'gray' }}>ID : {ticket.id}</Text>
                  </View>
                  <Text
                    style={[
                      styles.cardStatus,
                      ticket.status.toLowerCase() === 'opened'
                        ? styles.statusOpen
                        : styles.statusClosed,
                    ]}>
                    {ticket.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tickets found</Text>
            </View>
          )}
          <View style={{ marginTop: 15 }}></View>
        </ScrollView>

        {/* Pagination controls */}
        <View style={styles.pagination}>
          <LinearGradient
            colors={
              currentPage === 1
                ? ['#E0E0E0', '#E0E0E0']
                : ['#7B00FF', '#B200FF']
            }
            start={{ x: 0.134, y: 0.021 }}
            end={{ x: 1, y: 1 }}
            style={styles.pageGradient}>
            <TouchableOpacity
              onPress={loadPrevPage}
              disabled={currentPage === 1}
              style={styles.buttonInner}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          </LinearGradient>

          <Text style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </Text>

          <LinearGradient
            colors={
              currentPage === totalPages
                ? ['#E0E0E0', '#E0E0E0']
                : ['#7B00FF', '#B200FF']
            }
            start={{ x: 0.134, y: 0.021 }}
            end={{ x: 1, y: 1 }}
            style={styles.pageGradient}>
            <TouchableOpacity
              onPress={loadNextPage}
              disabled={currentPage === totalPages}
              style={styles.buttonInner}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Tickets;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: COLORS.white, },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    gap: 4,

  },
  filterText: { ...FONTS.body4, color: COLORS.text_title, fontWeight: '500' },
  cards: { padding: 10, flex: 1 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold', marginVertical: 5 },
  cardTiCKET: { fontSize: 17, fontWeight: 'bold', color: '#5585FF' },
  cardDiscription: { fontSize: 12, color: 'gray' },
  cardStatus: {
    marginTop: 5,
    textAlign: 'right',
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusOpen: {
    backgroundColor: COLORS.light_green,
    color: COLORS.white,
  },
  statusClosed: {
    backgroundColor: COLORS.shadow_01,
    color: COLORS.text_desc,
  },
  cardDate: { ...FONTS.body5, marginBottom: 5 },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.blue_02,
  },
  pageInfo: {
    fontSize: 14,
    color: COLORS.text_title,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 155,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text_desc,
    textAlign: 'center',
  },

  gradientButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  filterGradient: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 3,
  },
  pageGradient: {
    borderRadius: 6,
    overflow: 'hidden',
    minWidth: 90,
    marginHorizontal: 5,
  },
  buttonInner: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
