import { useDrawerProgress } from '@react-navigation/drawer';
import React, { useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  Image,
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { useDispatch, useSelector } from 'react-redux';
import { bottom_tabs, COLORS, FONTS, screens, SIZES, SPACING } from '../constants';
import {
  AttendanceScreen,
  ClassesScreen,
  CommunitiesScreen,
  CouresScreen,
  HomeScreen,
} from '../screens';
import { setSelectedTab } from '../store/tab/tabSlice';

type TabButtonProps = {
  label: string;
  icon: any;
  isFocused: boolean;
  onPress: () => void;
  outerContainerStyle?: any;
  innerContainerStyle?: any;
};

const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isFocused,
  onPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 60, 
          height: 65,
          marginTop: -10, 
          marginBottom: -5,
        }}
      >
        {/* Outer white container */}
        <View
          style={{
            backgroundColor: "#fff", 
            borderRadius: 12, 
            padding: 6,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 4,
            width: 40, 
            height: 40, 
          }}
        >
          {/* Icon */}
          <Image
            source={icon}
            style={{ 
              width: 18,
              height: 18, 
              tintColor: isFocused ? "#7B00FF" : "#777" 
            }}
          />
        </View>
        
        {/* Text - Outside the white container, below it */}
        <Text
          style={{
            marginTop: 6, 
            color: isFocused ? "#B200FF" : "#777", 
            ...FONTS.h7,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const progress = useDrawerProgress();
  const { width } = useWindowDimensions();
  const pagerRef = useRef<PagerView>(null);
  const selectedTab = useSelector((state: any) => state.tabReducer.selectedTab);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      {
        scale: interpolate(progress.value, [0, 1], [1, 0.8], 'clamp'),
      },
      {
        rotateY: `${interpolate(progress.value, [0, 1], [0, -10], 'clamp')}deg`,
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, Platform.OS === 'android' ? width - 130 : -60],
          'clamp'
        ),
      },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, 20], 'clamp'),
    overflow: 'hidden',
  }));

  useEffect(() => {
    if (!selectedTab) dispatch(setSelectedTab(screens.home));
  }, [dispatch, selectedTab]);

  useEffect(() => {
    const index = bottom_tabs.findIndex((t) => t.label === selectedTab);
    if (index !== -1 && pagerRef.current) {
      pagerRef.current.setPage(index);
    }
  }, [selectedTab]);

  // Handle page change from PagerView
  const handlePageSelected = (event: any) => {
    const index = event.nativeEvent.position;
    const newTab = bottom_tabs[index]?.label;
    if (newTab && newTab !== selectedTab) {
      dispatch(setSelectedTab(newTab));
    }
  };

  // Handle tab button press
  const handleTabPress = (tabLabel: string) => {
    const index = bottom_tabs.findIndex((t) => t.label === tabLabel);
    if (index !== -1 && pagerRef.current) {
      pagerRef.current.setPage(index);
    }
    dispatch(setSelectedTab(tabLabel));
  };

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: COLORS.white }, animatedStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : -50}>
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          {/* PagerView for smooth scrolling */}
          <PagerView
            ref={pagerRef}
            style={{ flex: 1 }}
            initialPage={0}
            onPageSelected={handlePageSelected}
            scrollEnabled={true}
            overdrag={false} // Prevents over-scrolling
            offscreenPageLimit={1} // Keeps adjacent pages in memory for smoother transitions
          >
            {bottom_tabs.map((item) => (
              <View key={item.id} style={{ width: SIZES.width, height: '100%' }}>
                {item.label === screens.home && <HomeScreen />}
                {item.label === screens.course && <CouresScreen />}
                {item.label === screens.classes && <ClassesScreen />}
                {item.label === screens.attendance && <AttendanceScreen />}
                {item.label === screens.community && <CommunitiesScreen />}
              </View>
            ))}
          </PagerView>
        </View>

        {/* Bottom Tab Bar - Fixed at bottom */}
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.white }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: COLORS.white,
              paddingHorizontal: SIZES.radius,
              paddingTop: 10,
              paddingBottom: Platform.OS === 'android' ? 10 : 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}>
            {bottom_tabs.map((tab) => {
              const isFocused = selectedTab === tab.label;

              return (
                <View
                  key={tab.id}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 0,
                  }}>
                  <TabButton
                    label={tab.label}
                    icon={isFocused ? tab.activeIcon : tab.icon}
                    isFocused={isFocused}
                    onPress={() => handleTabPress(tab.label)}
                    outerContainerStyle={{}}
                  />
                </View>
              );
            })}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default MainLayout;