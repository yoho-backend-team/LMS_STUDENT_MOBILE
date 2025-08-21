import { useDrawerProgress } from '@react-navigation/drawer';
import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  outerContainerStyle,
  innerContainerStyle,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
          },
          outerContainerStyle,
        ]}>
        <Animated.View
          style={[
            {
              flexDirection: 'column',
              width: '100%',
              height: SPACING.small,
              borderRadius: 25,
              backgroundColor: undefined,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 0,
              shadowColor: COLORS.blue_01,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0,
              shadowRadius: 6,
            },
            innerContainerStyle,
          ]}>
          <View
            style={{
              backgroundColor: isFocused ? undefined : undefined,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Image
              source={icon}
              style={{
                width: 20,
                height: 20,
                tintColor: isFocused ? COLORS.blue_01 : COLORS.shadow_01,
              }}
            />
          </View>

          <Text
            numberOfLines={1}
            style={{
              color: isFocused ? COLORS.blue_01 : COLORS.shadow_01,
              ...FONTS.h7,
              fontWeight: 600,
            }}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const progress = useDrawerProgress();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
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
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: false });
    }
  }, [selectedTab]);

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: COLORS.white }, animatedStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : -50}>
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          <FlatList
            ref={flatListRef}
            onScrollToIndexFailed={({ index }) => {
              flatListRef.current?.scrollToOffset({
                offset: index * SIZES.width,
                animated: true,
              });
            }}
            horizontal
            scrollEnabled={false}
            pagingEnabled
            snapToAlignment="center"
            snapToInterval={SIZES.width}
            showsHorizontalScrollIndicator={false}
            data={bottom_tabs}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <View style={{ width: SIZES.width, height: SIZES.height }}>
                {item.label === screens.home && <HomeScreen />}
                {item.label === screens.course && <CouresScreen />}
                {item.label === screens.classes && <ClassesScreen />}
                {item.label === screens.attendance && <AttendanceScreen />}
                {item.label === screens.community && <CommunitiesScreen />}
              </View>
            )}
          />
        </View>

        {/* Bottom Tab Bar - Outside of the scrollable content */}
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.white }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: COLORS.white,
              paddingHorizontal: SIZES.radius,
              paddingTop: 20,
              paddingBottom: Platform.OS === 'android' ? 20 : 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              elevation: 10,
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
                    onPress={() => dispatch(setSelectedTab(tab.label))}
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
