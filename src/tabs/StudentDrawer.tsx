import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Alert, Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, icons, screens, SIZES } from '../constants';
import MainLayout from '../layout';
import { RootState } from '../store/store';
import { setSelectedTab } from '../store/tab/tabSlice';
import toast from '../utils/toasts';

type CustomDrawerItemProps = {
  label: string;
  icon: ImageSourcePropType;
  isFocused?: boolean;
  onPress: () => void;
};

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({ label, icon, isFocused, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 40,
        marginBottom: SIZES.base,
        alignItems: 'center',
        paddingLeft: SIZES.radius,
        borderRadius: SIZES.small,
        backgroundColor: isFocused ? COLORS.shadow_01 : undefined,
      }}
      onPress={onPress}>
      <Image
        source={icon}
        style={{
          width: 20,
          height: 20,
          tintColor: COLORS.blue_01,
        }}
      />
      <Text
        style={{
          marginLeft: SIZES.radius,
          color: COLORS.blue_01,
          ...FONTS.h4,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

type DrawerContentProps = {
  navigation: DrawerNavigationProp<any>;
};

const ServiceDrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state: RootState) => state.tabReducer.selectedTab);
  const [error, setError] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure, you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              toast.success('', 'Logout Successfully.');
              navigation.reset({ index: 0, routes: [{ name: 'AuthStackstudent' }] });
            } catch (error) {
              toast.error('Error', 'An error occurred during logout. Please try again later.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <DrawerContentScrollView scrollEnabled contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: SIZES.radius }}>
        <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              width: '100%',
              paddingTop: SIZES.small,
            }}
            onPress={() => navigation.closeDrawer()}>
            <Image
              source={icons.cross}
              style={{ height: 20, width: 20, tintColor: COLORS.blue_01 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: SIZES.radius,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('Profile');
          }}>
          <Image
            source={require('../assets/icons/userprofile.png')}
            onError={() => setError(true)}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <View style={{ marginLeft: SIZES.radius, flex: 1 }}>
            <Text
              style={{
                color: COLORS.blue_01,
                ...FONTS.h2_01,
                flexShrink: 1,
              }}>
              YM User
            </Text>
            <Text style={{ color: COLORS.blue_01, ...FONTS.h5 }}>ID: #YMU_1234</Text>
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <CustomDrawerItem
            label={screens.home}
            icon={selectedTab === screens.home ? icons.home_filled : icons.home_outlined}
            isFocused={selectedTab === screens.home}
            onPress={() => {
              dispatch(setSelectedTab(screens.home));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.classes}
            icon={selectedTab === screens.classes ? icons.classes_filled : icons.classes_outlined}
            isFocused={selectedTab === screens.classes}
            onPress={() => {
              dispatch(setSelectedTab(screens.classes));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.course}
            icon={selectedTab === screens.course ? icons.course_filled : icons.course_outlined}
            isFocused={selectedTab === screens.course}
            onPress={() => {
              dispatch(setSelectedTab(screens.course));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.community}
            icon={
              selectedTab === screens.community ? icons.community_filled : icons.community_outlined
            }
            isFocused={selectedTab === screens.community}
            onPress={() => {
              dispatch(setSelectedTab(screens.community));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label="Tickets"
            icon={icons.course_filled}
            onPress={() => navigation.navigate('TicketsScreen')}
          />
          <CustomDrawerItem
            label="Payments"
            icon={icons.course_filled}
            onPress={() => navigation.navigate('Payment')}
          />
          <CustomDrawerItem
            label="Placement"
            icon={icons.course_filled}
            onPress={() => navigation.navigate('Placement')}
          />
          <CustomDrawerItem
            label="Notifications"
            icon={icons.course_filled}
            onPress={() => navigation.navigate('Notification')}
          />
          <CustomDrawerItem
            label="Activity Logs"
            icon={icons.course_filled}
            onPress={() => navigation.navigate('ActivityLog')}
          />
          <CustomDrawerItem
            label="Help Center"
            icon={icons.course_filled}
            onPress={() => navigation.navigate('Helpcenter')}
          />
          <CustomDrawerItem
            label="FAQs"
            icon={icons.course_filled}
            onPress={() => navigation.navigate('FAQ')}
          />
          <View
            style={{
              height: 1,
              marginVertical: SIZES.radius,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.blue_02,
            }}
          />
          <View style={{ marginTop: SIZES.radius }}>
            <CustomDrawerItem label="Logout" icon={icons.logout} onPress={handleLogout} />
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const ServiceDrawer: React.FC = () => {
  const Drawer = createDrawerNavigator();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.blue_02 }}>
      <Drawer.Navigator
        screenOptions={{
          overlayColor: 'transparent',
          drawerType: 'back',
          drawerStyle: {
            flex: 1,
            width: '100%',
            paddingRight: 20,
            backgroundColor: COLORS.blue_02,
          },
          headerShown: false,
        }}
        initialRouteName="MainLayout"
        drawerContent={(props) => <ServiceDrawerContent navigation={props.navigation} />}>
        <Drawer.Screen name="MainLayout" component={MainLayout} />
      </Drawer.Navigator>
    </View>
  );
};

export default ServiceDrawer;
