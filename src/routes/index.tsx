import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityLogsScreen,
  ClassByIdScreen,
  ClassesScreen,
  CommunitiesScreen,
  CommunityByIdScreen,
  CouresScreen,
  CourseByIdScreen,
  CreateTicketScreen,
  EmailVerificationScreen,
  FAQScreen,
  HelpCenterScreen,
  LoginScreen,
  NotificationsScreen,
  OtpVerificationScreen,
  PaymentScreen,
  PlacementScreen,
  ProfileScreen,
  ResetPasswordScreen,
  SpokenEnglishScreen,
  TicketByIdScreen,
  TicketsScreen,
} from '../screens';
import StudentDrawer from '../tabs/StudentDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatbotScreen from '~/screens/ChatbotScreen/chatbot';
import TaskCard from '~/components/courses/TaskCard';
import SessionExpiredModal from '~/components/Sessionexpired/sessionexpire';

const Routes = () => {
  type RootStackParamList = {
    AuthStackstudent: undefined;
    Student: undefined;
    FAQ: undefined;
    StudentDrawer: undefined;
    login: undefined;
    ForgetPassword: undefined;
    OtpVerification: undefined;
    ResetPassword: undefined;
    Payment: undefined;
    Helpcenter: undefined;
    ActivityLog: undefined;
    TicketsScreen: undefined;
    TicketViewScreen: undefined;
    CreateTicket: undefined;
    ClassesScreen: undefined;
    ClassByIdScreen: undefined;
    ClassViewScreen: undefined;
    CoursesScreen: undefined;
    CourseViewScreen: undefined;
    Notification: undefined;
    Placement: undefined;
    Profile: undefined;
    CommunitiesScreen: undefined;
    CommunityViewScreen: undefined;
  };

  const Stack: any = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();

  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleSessionExpired = async () => {
    try {
      await AsyncStorage.removeItem('AuthStudentToken');
      await AsyncStorage.removeItem('StudentData');
      setShowSessionModal(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStackstudent' }],
      });
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  };

  useEffect(() => {
    global.handleSessionExpired = () => {
      setShowSessionModal(true);
    };

    return () => {
      delete global.handleSessionExpired;
    };
  }, []);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('AuthStudentToken');
        const isLoggedIn = token ? true : false;
        if (isLoggedIn) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Student' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthStackstudent' }],
          });
        }
      } catch (error: any) {
        console.error('Error during auth state check:', error.message);
      }
    };
    checkAuthState();
  }, [navigation]);

  const StudentAuthStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="ForgetPassword" component={EmailVerificationScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    );
  };

  const StudentStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StudentDrawer" component={StudentDrawer} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Helpcenter" component={HelpCenterScreen} />
        <Stack.Screen name="ActivityLog" component={ActivityLogsScreen} />
        <Stack.Screen name="TicketsScreen" component={TicketsScreen} />
        <Stack.Screen name="TicketViewScreen" component={TicketByIdScreen} />
        <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
        <Stack.Screen name="ClassesScreen" component={ClassesScreen} />
        <Stack.Screen name="ClassByIdScreen" component={ClassByIdScreen} />
        <Stack.Screen name="ClassViewScreen" component={ClassByIdScreen} />
        <Stack.Screen name="CoursesScreen" component={CouresScreen} />
        <Stack.Screen name="CourseViewScreen" component={CourseByIdScreen} />
        <Stack.Screen name="Notification" component={NotificationsScreen} />
        <Stack.Screen name="Placement" component={PlacementScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="CommunitiesScreen" component={CommunitiesScreen} />
        <Stack.Screen name="CommunityViewScreen" component={CommunityByIdScreen} />
        <Stack.Screen name="SpokenEnglish" component={SpokenEnglishScreen} />
        <Stack.Screen name="ChatbotScreen" component={ChatbotScreen} />
        <Stack.Screen name="TaskCard" component={TaskCard} />
      </Stack.Navigator>
    );
  };

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthStackstudent" component={StudentAuthStack} />
        <Stack.Screen name="Student" component={StudentStack} />
      </Stack.Navigator>

      <SessionExpiredModal visible={showSessionModal} onConfirm={handleSessionExpired} />
    </>
  );
};

export default Routes;
