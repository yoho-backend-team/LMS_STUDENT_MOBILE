import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth * 0.85;

type WaveProps = {
  percentage: number;
  color: string;
  cardId: number;
};

const MinimalWave = ({ percentage, color, cardId }: WaveProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  const waveHeight = 45;
  const waveWidth = cardWidth - 80;
  const amplitude = 6 + (percentage / 100) * 8;

  return (
    <View style={{ height: waveHeight, alignItems: 'center' }}>
      <Animated.View
        style={{
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -25],
              }),
            },
          ],
        }}
      >
        <Svg height={waveHeight} width={waveWidth}>
          <Defs>
            <LinearGradient
              id={`minimal${cardId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor={color} stopOpacity="0.1" />
              <Stop offset="50%" stopColor={color} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
          <G>
            {/* filled wave */}
            <Path
              d={`M0,${waveHeight / 2} ${Array.from({ length: 100 }, (_, i) => {
                const x = (waveWidth / 100) * i;
                const y =
                  waveHeight / 2 +
                  Math.sin(x * 0.03 + percentage * 0.01) * amplitude;
                return `L${x},${y}`;
              }).join(' ')} L${waveWidth},${waveHeight} L0,${waveHeight} Z`}
              fill={`url(#minimal${cardId})`}
            />
            {/* stroke line */}
            <Path
              d={`M0,${waveHeight / 2} ${Array.from({ length: 100 }, (_, i) => {
                const x = (waveWidth / 100) * i;
                const y =
                  waveHeight / 2 +
                  Math.sin(x * 0.03 + percentage * 0.01) * amplitude;
                return `L${x},${y}`;
              }).join(' ')}`}
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

type AttendanceProps = {
  attendance?: {
    data?: {
      attendedClassCount?: number;
      totalPresentDays?: number;
      totalAbsentDays?: number;
      totalWorkingDays?: number;
      onlineClassCount?: number;
      offlineClassCount?: number;
    };
  };
};

type AttendanceCardsProps = {
  attendance?: AttendanceProps['attendance'];
  onScrollIndexChange?: (index: number) => void; 
};

const AttendanceCards = ({
  attendance,
  onScrollIndexChange,
}: AttendanceCardsProps) => {
  const scrollRef = useRef<ScrollView>(null);

  const cards = [
    {
      id: 1,
      title: 'Total Classes',
      attended: attendance?.data?.attendedClassCount,
      total:
        (attendance?.data?.onlineClassCount || 0) +
        (attendance?.data?.offlineClassCount || 0),
      color: '#6366F1',
      bgColor: '#EEF2FF',
    },
    {
      id: 2,
      title: 'Present Days',
      attended: attendance?.data?.totalPresentDays ?? 0,
      total: attendance?.data?.totalWorkingDays,
      color: '#059669',
      bgColor: '#ECFDF5',
    },
    {
      id: 3,
      title: 'Absent Days',
      attended: attendance?.data?.totalAbsentDays ?? 0,
      total: attendance?.data?.totalWorkingDays,
      color: '#DC2626',
      bgColor: '#FEF2F2',
    },
  ];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / cardWidth);
    if (onScrollIndexChange) {
      onScrollIndexChange(index);
    }
  };

  const cardStyle = {
    width: cardWidth,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  };

  return (
    <View style={{ height: 230 }}> 
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ paddingHorizontal: 5 }}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {cards.map((card?:any) => {
          const percentage =
            card.total && card.total > 0
              ? (card.attended / card.total) * 100
              : 0;

          return (
            <View
              key={card.id}
              style={[cardStyle, { backgroundColor: card.bgColor }]}
            >
              {/* header */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#475569',
                    marginBottom: 8,
                  }}
                >
                  {card.title}
                </Text>
              </View>

              {/* attended / total */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: card.color,
                  }}
                >
                  {card.attended}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#94A3B8',
                    alignSelf: 'flex-end',
                  }}
                >
                  / {card.total}
                </Text>
              </View>

              {/* wave */}
              <View style={{ alignItems: 'center', marginTop: 5 }}>
                <MinimalWave
                  percentage={percentage}
                  color={card.color}
                  cardId={card.id}
                />
              </View>

              {/* percentage */}
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 8,
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: card.color,
                  }}
                >
                  {Math.round(percentage)}%
                </Text>
              </View>

              {/* status */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  paddingTop: 8,
                  borderTopWidth: 0.5,
                  borderTopColor: '#E2E8F0',
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      percentage >= 75
                        ? '#10B981'
                        : percentage >= 50
                        ? '#F59E0B'
                        : '#EF4444',
                    marginRight: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: '#64748B',
                  }}
                >
                  {percentage >= 75
                    ? 'Excellent'
                    : percentage >= 50
                    ? 'Good'
                    : 'Low'}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AttendanceCards;
