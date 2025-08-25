import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { icons, SIZES } from '~/constants';

interface HeaderProps {
  containerStyle?: object;
  logo?: string;
  titleStyle?: object;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  containerStyle,
  logo,
  titleStyle,
  leftComponent,
  rightComponent,
}) => {
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 35,
        paddingHorizontal: SIZES.padding,
        alignItems: 'center',
      }}>
      {/**Left */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image source={icons.menu} style={{ height: 25, width: 25 }} />
      </TouchableOpacity>
      {/**Title */}
      <View
        style={{
          flex: 1,
          marginHorizontal: SIZES.padding,
          opacity: 0.9,
          justifyContent: 'center',
          alignItems: 'center',
        }}></View>
      {/** Right **/}
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile' as never);
          }}>
          <Image source={icons.user_profile} className="w-25 h-25 rounded-full object-cover" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
