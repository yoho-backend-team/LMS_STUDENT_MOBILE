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
      Animated.timing(animatedValue, { toValue: 1, duration: 5000, useNativeDriver: false })
    ).start();
  }, []);

  const waveHeight = 45; 
  const waveWidth = cardWidth - 80;
  const amplitude = 6 + (percentage / 100) * 8; 

  return (
    <View style={{ height: waveHeight, alignItems: 'center' }}>
      <Svg height={waveHeight} width={waveWidth}>
        <Defs>
          <LinearGradient id={`minimal${cardId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <Stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        <G
          transform={`translate(${animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, -25] }).__getValue()}, 0)`}
        >
          <Path
            d={`M0,${waveHeight/2} ${Array.from({length: 100}, (_, i) => {
              const x = (waveWidth/100) * i;
              const y = waveHeight/2 + Math.sin((x * 0.03) + (percentage * 0.01)) * amplitude;
              return `L${x},${y}`;
            }).join(' ')} L${waveWidth},${waveHeight} L0,${waveHeight} Z`}
            fill={`url(#minimal${cardId})`}
          />
          <Path
            d={`M0,${waveHeight/2} ${Array.from({length: 100}, (_, i) => {
              const x = (waveWidth/100) * i;
              const y = waveHeight/2 + Math.sin((x * 0.03) + (percentage * 0.01)) * amplitude;
              return `L${x},${y}`;
            }).join(' ')}`}
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </G>
      </Svg>
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
    }
  }
};

const AttendanceCards = ({ attendance }: AttendanceProps) => {
const cards = [
  {
    id: 1,
    title: "Classes Attended",
    attended: attendance?.data?.attendedClassCount,
    total: attendance?.data?.totalWorkingDays,
    color: "#6366F1",
    bgColor: "#EEF2FF",
  },
  {
    id: 2,
    title: "Present Days",
    attended: attendance?.data?.totalPresentDays,
    total: attendance?.data?.totalWorkingDays,
    color: "#059669",
    bgColor: "#ECFDF5",
  },
  {
    id: 3,
    title: "Absent Days",
    attended: attendance?.data?.totalAbsentDays,
    total: attendance?.data?.totalWorkingDays,
    color: "#DC2626",
    bgColor: "#FEF2F2",
  },
];
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

  const headerStyle = {
    marginBottom: 12,
  };

  const titleStyle = {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#475569',
    marginBottom: 8,
  };

  return (
    <View style={{ flex: 1 }}>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={{ paddingHorizontal: 5 }}
        contentContainerStyle={{ paddingRight: 20 }} 
      >
        {cards.map((card) => {
         const percentage =
  card.total && card.attended
    ? (card.attended / card.total) * 100
    : 0;
          
          return (
            <View key={card.id} style={[cardStyle, { backgroundColor: card.bgColor }]}>
              <View style={headerStyle}>
                <Text style={titleStyle}>{card.title}</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: 12, 
              }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: card.color }}> 
                  {card.attended}
                </Text>
                <Text style={{ fontSize: 14, color: '#94A3B8', alignSelf: 'flex-end' }}>
                  / {card.total}
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', marginTop: 5 }}> 
                <MinimalWave percentage={percentage} color={card.color} cardId={card.id} />
              </View>

              
              <View style={{
                alignItems: 'center',
                marginTop: 8, 
                marginBottom: 5,
              }}>
                <Text style={{
                  fontSize: 22, 
                  fontWeight: '800',
                  color: card.color,
                }}>
                  {Math.round(percentage)}%
                </Text>
              </View>

             
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 8, 
                paddingTop: 8, 
                borderTopWidth: 0.5,
                borderTopColor: '#E2E8F0',
              }}>
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: percentage >= 75 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444',
                  marginRight: 6, 
                }} />
                <Text style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: '#64748B',
                }}>
                  {percentage >= 75 ? 'Excellent' : percentage >= 50 ? 'Good' : 'Low'}
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