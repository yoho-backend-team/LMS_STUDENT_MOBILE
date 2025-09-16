import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FONTS, icons, screens, sidebaricon, SIZES } from '../constants';
import MainLayout from '../layout';
import { RootState } from '../store/store';
import { setSelectedTab } from '../store/tab/tabSlice';
import toast from '../utils/toasts';
import { getStudentProfileThunk } from '~/features/Profile/reducer/thunks';
import { selectProfile } from '~/features/Profile/reducer/selectors';
import { getImageUrl } from '~/utils/imageUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { getStudentLogoutClient } from '~/features/Authentication/services';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { clearStudentData } from '~/utils/storage';

type CustomDrawerItemProps = {
  label: string;
  icon: ImageSourcePropType;
  isFocused?: boolean;
  onPress: () => void;
};

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({ label, icon, isFocused, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: isFocused ? 5 : 0,
      }}>
      {isFocused ? (
        <LinearGradient
          colors={['#7B00FF', '#B200FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: 'row',
            height: 50,
            alignItems: 'center',
            paddingHorizontal: 15,
            borderRadius: 12,
          }}>
          <Image
            source={icon}
            style={{
              width: 20,
              height: 20,
              tintColor: '#fff',
            }}
          />
          <Text
            style={{
              marginLeft: 15,
              color: '#fff',
              ...FONTS.h4,
              fontWeight: 500,
            }}>
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            alignItems: 'center',
            paddingHorizontal: 15,
            borderRadius: 12,
            backgroundColor: '#F5F5F5',
          }}>
          <Image
            source={icon}
            style={{
              width: 20,
              height: 20,
              tintColor: '#777',
            }}
          />
          <Text
            style={{
              marginLeft: 15,
              color: '#777',
              ...FONTS.h4,
              fontWeight: 500,
            }}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const ServiceDrawerContent: React.FC<any> = ({ navigation }) => {
  const dispatch = useDispatch<any>();
  const selectedTab = useSelector((state: RootState) => state.tabReducer.selectedTab);
  const [error, setError] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const profileDetails = useSelector(selectProfile)?.data;
  const [activeScreen, setActiveScreen] = useState(selectedTab);

  useEffect(() => {
    dispatch(getStudentProfileThunk({}));
  }, [dispatch]);

  // Track the active screen when navigation state changes
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const currentRoute = navigation.getState()?.routes[0]?.state?.routes[0]?.name;
      if (currentRoute && Object.values(screens).includes(currentRoute)) {
        setActiveScreen(currentRoute);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const confirmLogout = async () => {
    try {
      const response = await getStudentLogoutClient({});
      if (response) {
        await clearStudentData();
        toast.success('Success', 'Logout Successfully.');
        setLogoutModalVisible(false);
        navigation.reset({ index: 0, routes: [{ name: 'AuthStackstudent' }] });
      } else {
        toast.error('Error', 'Failed to logout');
      }
    } catch (error) {
      toast.error('Error', 'An error occurred during logout. Please try again later.');
    }
  };

  // Helper function to check if a screen is focused
  const isScreenFocused = (screenName: string) => {
    return activeScreen === screenName;
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Close Button */}
        <View
          style={{
            alignItems: 'flex-end',
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 5 : 5,
            paddingHorizontal: 10,
            paddingBottom: 0,
          }}>
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: '#7B00FF',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.closeDrawer()}>
            <Image
              source={icons.cross}
              style={{
                height: 12,
                width: 12,
                tintColor: '#fff',
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Pinned Profile */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingTop: 0,
          }}
          onPress={() => {
            navigation.navigate('Profile');
            setActiveScreen('Profile');
          }}>
          <Image
            source={
              profileDetails?.image
                ? { uri: getImageUrl(profileDetails?.image) }
                : require('../assets/home/profile.png')
            }
            onError={() => setError(true)}
            style={{ width: 55, height: 55, borderRadius: 12 }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ color: '#333', ...FONTS.h2_01, fontWeight: '600' }}>
              {profileDetails?.full_name}
            </Text>
            <Text style={{ color: '#777', ...FONTS.h5 }}>
              ID : {profileDetails?.userDetail?.studentId}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Divider */}
        <View style={{ height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 }} />
        {/* Scrollable Middle Section */}
        <DrawerContentScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 0, paddingHorizontal: 10, paddingBottom: 25 }}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}>
          <View>
            {/* First five items that dispatch setSelectedTab */}
            <CustomDrawerItem
              label={screens.home}
              icon={sidebaricon.home}
              isFocused={isScreenFocused(screens.home)}
              onPress={() => {
                dispatch(setSelectedTab(screens.home));
                setActiveScreen(screens.home);
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.course}
              icon={sidebaricon.course}
              isFocused={isScreenFocused(screens.course)}
              onPress={() => {
                dispatch(setSelectedTab(screens.course));
                setActiveScreen(screens.course);
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.classes}
              icon={sidebaricon.classes}
              isFocused={isScreenFocused(screens.classes)}
              onPress={() => {
                dispatch(setSelectedTab(screens.classes));
                setActiveScreen(screens.classes);
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.attendance}
              icon={sidebaricon.attendance}
              isFocused={isScreenFocused(screens.attendance)}
              onPress={() => {
                dispatch(setSelectedTab(screens.attendance));
                setActiveScreen(screens.attendance);
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.community}
              icon={sidebaricon.community}
              isFocused={isScreenFocused(screens.community)}
              onPress={() => {
                dispatch(setSelectedTab(screens.community));
                setActiveScreen(screens.community);
                navigation.closeDrawer();
              }}
            />

            {/* Remaining items that use normal navigation */}
            <CustomDrawerItem
              label="Tickets"
              icon={sidebaricon.ticket}
              isFocused={isScreenFocused('TicketsScreen')}
              onPress={() => {
                navigation.navigate('TicketsScreen');
                setActiveScreen('TicketsScreen');
              }}
            />
            <CustomDrawerItem
              label="Payments"
              icon={sidebaricon.payment}
              isFocused={isScreenFocused('Payment')}
              onPress={() => {
                navigation.navigate('Payment');
                setActiveScreen('Payment');
              }}
            />
            <CustomDrawerItem
              label="Notifications"
              icon={sidebaricon.notification}
              isFocused={isScreenFocused('Notification')}
              onPress={() => {
                navigation.navigate('Notification');
                setActiveScreen('Notification');
              }}
            />
            <CustomDrawerItem
              label="Activity Logs"
              icon={sidebaricon.activity}
              isFocused={isScreenFocused('ActivityLog')}
              onPress={() => {
                navigation.navigate('ActivityLog');
                setActiveScreen('ActivityLog');
              }}
            />
            <CustomDrawerItem
              label="Placement"
              icon={sidebaricon.placement}
              isFocused={isScreenFocused('Placement')}
              onPress={() => {
                navigation.navigate('Placement');
                setActiveScreen('Placement');
              }}
            />
            <CustomDrawerItem
              label="Spoken English"
              icon={sidebaricon.spokenenglish}
              isFocused={isScreenFocused('SpokenEnglish')}
              onPress={() => {
                navigation.navigate('SpokenEnglish');
                setActiveScreen('SpokenEnglish');
              }}
            />
            <CustomDrawerItem
              label="Help Center"
              icon={sidebaricon.helpcenter}
              isFocused={isScreenFocused('Helpcenter')}
              onPress={() => {
                navigation.navigate('Helpcenter');
                setActiveScreen('Helpcenter');
              }}
            />
            <CustomDrawerItem
              label="FAQs"
              icon={sidebaricon.fag}
              isFocused={isScreenFocused('FAQ')}
              onPress={() => {
                navigation.navigate('FAQ');
                setActiveScreen('FAQ');
              }}
            />
          </View>
        </DrawerContentScrollView>
        {/* Divider */}
        <View style={{ height: 1, backgroundColor: '#E0E0E0', marginBottom: 15 }} />
        {/* Fixed Logout at Bottom */}
        <View style={{ paddingHorizontal: 15, paddingBottom: 20 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => setLogoutModalVisible(true)}>
            <Image source={sidebaricon.logout} style={{ width: 20, height: 20 }} />
            <Text style={{ marginLeft: 10, color: 'red', fontWeight: '600', ...FONTS.h4 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        {/* Logout Modal */}
        <Modal
          visible={logoutModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLogoutModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: '#fff',
                borderRadius: 15,
                padding: 20,
                alignItems: 'center',
              }}>
              <Text style={{ ...FONTS.h2, marginBottom: 10 }}>Confirm Logout</Text>
              <Text
                style={{ ...FONTS.body3, color: '#666', textAlign: 'center', marginBottom: 20 }}>
                Are you sure you want to log out?
              </Text>

              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginRight: 10,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: '#E0E0E0',
                    alignItems: 'center',
                  }}
                  onPress={() => setLogoutModalVisible(false)}>
                  <Text style={{ ...FONTS.h4, color: '#333', fontWeight: 500 }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: '#B200FF',
                    alignItems: 'center',
                  }}
                  onPress={confirmLogout}>
                  <Text style={{ ...FONTS.h4, color: '#fff', fontWeight: 500 }}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const ServiceDrawer: React.FC = () => {
  const Drawer = createDrawerNavigator();

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <Drawer.Navigator
        screenOptions={{
          overlayColor: 'transparent',
          drawerType: 'back',
          drawerStyle: {
            flex: 1,
            width: '80%',
            backgroundColor: '#fff',
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
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
