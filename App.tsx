import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import Routes from './src/routes/index';
import { store } from './src/store/store';
import { useFonts } from 'expo-font';

export default function App() {
    const [fontsLoaded] = useFonts({
    QuicksandRegular: require('./src/assets/fonts/Quicksand-Regular.ttf'),
    QuicksandBold: require('./src/assets/fonts/Quicksand-Bold.ttf'),
    QuicksandSemiBold: require('./src/assets/fonts/Quicksand-SemiBold.ttf'),
  });
  
  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Routes />
            <Toast />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </>
  );
}
