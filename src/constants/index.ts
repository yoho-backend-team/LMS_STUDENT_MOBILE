import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Device Dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

const { width, height } = Dimensions.get('window');

export const screens = {
  main_layout: 'MainLayout',
  home: 'Home',
  classes: 'Classes',
  attendance: 'Attendance',
  account: 'Profile',
  course: 'Courses',
  community: 'Community',
};

export const icons = {
  home_filled: require('../assets/icons/home-active.png'),
  home_outlined: require('../assets/icons/home-inactive.png'),
  course_outlined: require('../assets/icons/course-inactive.png'),
  course_filled: require('../assets/icons/course-active.png'),
  classes_outlined: require('../assets/icons/class-inactive.png'),
  classes_filled: require('../assets/icons/class-active.png'),
  attendance_outlined: require('../assets/icons/attendance-inactive.png'),
  attendance_filled: require('../assets/icons/attendance-active.png'),
  account_outlined: require('../assets/icons/account-inactive.png'),
  account_filled: require('../assets/icons/account-active.png'),
  community_outlined: require('../assets/icons/community-inactive.png'),
  community_filled: require('../assets/icons/community-active.png'),
  cross: require('../assets/icons/cross.png'),
  login: require('../assets/icons/Login.png'),
  logout: require('../assets/icons/logout.png'),
  menu: require('../assets/icons/menu.png'),
  user_profile: require('../assets/icons/userprofile.png'),
  notification: require('../assets/icons/notification.png'),
};

export const Auth = {
  header: require('../assets/images/login/login 2.png'),
  loading: require('../assets/images/login/Group 14.png')
}

export const bottom_tabs = [
  {
    id: 0,
    label: screens.home,
    icon: icons.home_outlined,
    activeIcon: icons.home_filled,
  },
  {
    id: 1,
    label: screens.course,
    icon: icons.course_outlined,
    activeIcon: icons.course_filled,
  },
  {
    id: 2,
    label: screens.classes,
    icon: icons.classes_outlined,
    activeIcon: icons.classes_filled,
  },
  {
    id: 3,
    label: screens.attendance,
    icon: icons.attendance_outlined,
    activeIcon: icons.attendance_filled,
  },
  {
    id: 4,
    label: screens.community,
    icon: icons.community_outlined,
    activeIcon: icons.community_filled,
  },
];

export const COLORS = {
  bg_Colour: '#EBEFF3',
  white: '#fff',
  black: '#000',
  text_title: '#2A2A2A',
  text_desc: '#716F6F',
  blue_01: '#0022FF',
  blue_02: '#5585FF',
  blue_user: '#0400FF',
  light_blue: '#7B00FF',
  purple_01: '#A32AF3',
  purple_02: '#B200FF',
  green_text: '#3ABE65',
  light_green: '#11A21E',
  light_green_01: '#18BABA',
  light_green_02: '#38D2DC',
  light_green_03: '#6AE1B7',
  light_red: '#C63028',
  light_orange: '#E67123',
  light_pink: '#DF23E6',
  shadow_01: '#BDC2C7BF',
};

export const SIZES = {
  // global sizes
  full: wp('100%'), // Responsive full width
  extraSmall: wp('1%'), // Responsive base size
  small: wp('2%'), // Responsive base size
  radius: wp('3%'), // Responsive radius
  base: wp('4%'), // Responsive base size
  padding: wp('5%'), // Responsive padding
  margin: wp('6%'), // Responsive margin
  extra: wp('7%'),
  font: RFValue(14), // Responsive font size

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h2_01: 20,
  h2_02: 18,
  h2_03: 24,
  h3: 16,
  h4: 14,
  h5: 12,
  h6: 10,
  h7: 8,
  h8: 6,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  body6: 10,
  body7: 8,
  body8: 6,
  body9: 4,
  newbody: 35,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  h1: {
    fontSize: SIZES.h1,
  },
  h2: {
    fontSize: SIZES.h2,
  },
  h2_01: {
    fontSize: SIZES.h2_01,
  },
  h2_02: {
    fontSize: SIZES.h2_02,
  },
  h3: {
    fontSize: SIZES.h3,
  },
  h4: {
    fontSize: SIZES.h4,
  },
  h5: {
    fontSize: SIZES.h5,
  },
  h6: {
    fontSize: SIZES.h6,
  },
  h7: {
    fontSize: SIZES.h7,
  },
  h8: {
    fontSize: SIZES.h8,
  },
  body1: {
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontSize: SIZES.body3,
  },
  body4: {
    fontSize: SIZES.body4,
  },
  body5: {
    fontSize: SIZES.body5,
  },
  body6: {
    fontSize: SIZES.body6,
  },
  body7: {
    fontSize: SIZES.body7,
  },
  body8: {
    fontSize: SIZES.body8,
  },
};

// Spacing
export const SPACING = {
  small: wp('4%'), // Responsive small spacing
  medium: wp('8%'), // Responsive medium spacing
  medium_01: wp('9%'), // Responsive medium spacing
  medium_02: wp('10%'), // Responsive medium spacing
  large: wp('12%'), // Responsive large spacing
  xl: wp('16%'), // Responsive extra large spacing
  xl_01: wp('18%'), // Responsive extra large spacing
  xl_02: wp('20%'), // Responsive extra large spacing
  xl_03: wp('22%'), // Responsive extra large spacing
  xxl: wp('24%'), // Responsive extra extra large spacing
  xxxl: wp('32%'), // Responsive extra extra extra large spacing
};

// Elevation
export const ELEVATION = {
  low: wp('1%'), // Responsive low elevation
  medium: wp('2%'), // Responsive medium elevation
  high: wp('4%'), // Responsive high elevation
};
