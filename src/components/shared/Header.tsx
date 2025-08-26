import { useNavigation } from '@react-navigation/native';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { icons, SIZES } from '~/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotifications } from '~/features/notification/reducers/selectors';
import { useEffect } from 'react';
import { getAllNotificationsThunk } from '~/features/notification/reducers/thunks';

interface HeaderProps {
  containerStyle?: object;
  logo?: string;
  titleStyle?: object;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ containerStyle }) => {
  const navigation = useNavigation<any>();
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    loadNotifications();
  }, [dispatch]);

  const loadNotifications = () => {
    dispatch(getAllNotificationsThunk({}));
  };

  const unreadCount = notifications?.filter((n: any) => n.status === 'unread').length || 0;

  const handleNotificationPress = () => {
    navigation.navigate('Notification' as never);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 45,
        paddingHorizontal: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'space-between',
        ...containerStyle,
      }}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image source={icons.menu} style={{ height: 25, width: 25 }} />
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
        {/* Notifications */}
        <TouchableOpacity onPress={handleNotificationPress} style={{ position: 'relative' }}>
          <Image
            source={icons.notification}
            style={{ width: 26, height: 26, resizeMode: 'contain' }}
          />
          {unreadCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: -4,
                top: -4,
                backgroundColor: 'red',
                borderRadius: 10,
                minWidth: 18,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 3,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile' as never);
          }}>
          <Image
            source={icons.user_profile}
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              resizeMode: 'cover',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
