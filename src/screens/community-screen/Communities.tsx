import React, { useEffect, useState, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '~/components/shared/Header';
import { COLORS, FONTS } from '~/constants';
import { useDispatch, useSelector } from 'react-redux';
import { GetallCommunityThunks } from '~/features/Community/reducers.ts/thunks';
import { GetCommuntiySelector } from '../../features/Community/reducers.ts/selectore';
import { getImageUrl } from '~/utils/imageUtils';
import { formatTime } from '~/utils/formatDate';

const Communities = () => {
  const navigation = useNavigation<any>();
  const communityList = useSelector(GetCommuntiySelector);
  const dispatch = useDispatch<any>();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false); 

  const fetchCommunities = (page = 1) => {
    return dispatch(GetallCommunityThunks({ page }));
  };

  useEffect(() => {
    fetchCommunities(1);
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCommunities(1); 
    setRefreshing(false);
  }, []);

  const filteredCommunities = communityList?.filter((community: any) =>
    community?.group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />

        <View style={styles.content}>
          <Text style={styles.header}>Community</Text>

          {/* 🔍 Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color={COLORS.text_desc} style={styles.searchIcon} />
            <TextInput
              placeholder="Search"
              placeholderTextColor={COLORS.text_desc}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
                <Ionicons name="close-circle" size={18} color={COLORS.text_desc} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.messageList}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              } // 👈 pull to refresh
            >
              {filteredCommunities?.map((community: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.messageItem}
                  onPress={() => navigation.navigate('CommunityViewScreen', { community })}>
                  <Image style={styles.avatar} src={getImageUrl(community?.groupimage)} />

                  <View style={styles.messageContent}>
                    <Text style={styles.messageName}>{community?.group}</Text>
                    <Text style={styles.messageText}>{community?.last_message?.message}</Text>
                  </View>

                  <View style={styles.messageRight}>
                    <Text style={styles.messageTime}>
                      {formatTime(community?.last_message?.createdAt, true)}
                    </Text>
                    <View style={styles.checkContainer}>
                      <MaterialCommunityIcons
                        name="check-all"
                        size={16}
                        color={COLORS.light_green}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {filteredCommunities?.length === 0 && (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 50,
                    color: COLORS.text_desc,
                    ...FONTS.h3,
                  }}>
                  No communities found
                </Text>
              )}
            </ScrollView>
          </View>
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
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 24,
    marginTop: 16,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#6B7280',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageList: {
    backgroundColor: 'white',
    borderRadius: 8,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  messageName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#6B7280',
  },
  messageRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  checkContainer: {
    width: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});
