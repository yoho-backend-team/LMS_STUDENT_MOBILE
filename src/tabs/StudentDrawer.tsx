import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { COLORS, FONTS, icons, screens, sidebaricon, SIZES } from '../constants';
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
  const profileDetails = useSelector(selectProfile);
  const userDetail = profileDetails?.data;
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getStudentProfileThunk({}));
  }, [dispatch]);

  const confirmLogout = async () => {
    try {
      const response = await getStudentLogoutClient({});
      if (response) {
        await AsyncStorage.removeItem('AuthStudentToken');
        await AsyncStorage.removeItem('StudentData');
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
          onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: getImageUrl(userDetail?.image) }}
            onError={() => setError(true)}
            style={{ width: 55, height: 55, borderRadius: 40 }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ color: '#333', ...FONTS.h2_01, fontWeight: '600' }}>
              {userDetail?.full_name}
            </Text>
            <Text style={{ color: '#777', ...FONTS.h5 }}>
              ID : {userDetail?.userDetail?.studentId}
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
            <CustomDrawerItem
              label={screens.home}
              icon={sidebaricon.home}
              isFocused={selectedTab === screens.home}
              onPress={() => {
                dispatch(setSelectedTab(screens.home));
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.course}
              icon={sidebaricon.course}
              isFocused={selectedTab === screens.course}
              onPress={() => {
                dispatch(setSelectedTab(screens.course));
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.classes}
              icon={sidebaricon.classes}
              isFocused={selectedTab === screens.classes}
              onPress={() => {
                dispatch(setSelectedTab(screens.classes));
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.attendance}
              icon={sidebaricon.attendance}
              isFocused={selectedTab === screens.attendance}
              onPress={() => {
                dispatch(setSelectedTab(screens.attendance));
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label={screens.community}
              icon={sidebaricon.community}
              isFocused={selectedTab === screens.community}
              onPress={() => {
                dispatch(setSelectedTab(screens.community));
                navigation.closeDrawer();
              }}
            />
            <CustomDrawerItem
              label="Tickets"
              icon={sidebaricon.ticket}
              onPress={() => navigation.navigate('TicketsScreen')}
            />
            <CustomDrawerItem
              label="Payments"
              icon={sidebaricon.payment}
              onPress={() => navigation.navigate('Payment')}
            />
            <CustomDrawerItem
              label="Notifications"
              icon={sidebaricon.notification}
              onPress={() => navigation.navigate('Notification')}
            />
            <CustomDrawerItem
              label="Activity Logs"
              icon={sidebaricon.activity}
              onPress={() => navigation.navigate('ActivityLog')}
            />
            <CustomDrawerItem
              label="Placement"
              icon={sidebaricon.placement}
              onPress={() => navigation.navigate('Placement')}
            />
            <CustomDrawerItem
              label="Spoken English"
              icon={sidebaricon.spokenenglish}
              onPress={() => navigation.navigate('SpokenEnglish')}
            />
            <CustomDrawerItem
              label="Help Center"
              icon={sidebaricon.helpcenter}
              onPress={() => navigation.navigate('Helpcenter')}
            />
            <CustomDrawerItem
              label="FAQs"
              icon={sidebaricon.fag}
              onPress={() => navigation.navigate('FAQ')}
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
                  <Text style={{ ...FONTS.h4, color: '#333' }}>Cancel</Text>
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
                  <Text style={{ ...FONTS.h4, color: '#fff' }}>Logout</Text>
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
