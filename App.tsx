import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import Routes from './src/routes/index';
import { store } from './src/store/store';

export default function App() {
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
