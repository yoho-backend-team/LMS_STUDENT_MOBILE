import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import Routes from './src/routes/index';
import { store } from './src/store/store';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { COLORS } from '~/constants';

// Network Provider Component - Add this to App.tsx
const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Regular network check every 3 seconds
  const checkNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      const online = state.isConnected ?? false;

      if (online !== isOnline) {
        setIsOnline(online);

        if (online) {
          setShowOfflineModal(false);
          // Toast.show({
          //   type: 'success',
          //   text1: 'Connection Restored',
          //   text2: 'You are back online',
          //   visibilityTime: 2000,
          // });
        } else {
          setShowOfflineModal(true);
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Internet Connection',
          //   text2: 'Please check your network',
          //   visibilityTime: 2000,
          // });
        }
      }
    } catch (error) {
      console.error('Network check error:', error);
    }
  };

  useEffect(() => {
    // Initial check
    checkNetworkStatus();

    // Set up interval for regular checks every 3 seconds
    const interval = setInterval(checkNetworkStatus, 3000);
    setCheckInterval(interval);

    // Listen to network state changes (real-time)
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = state.isConnected ?? false;
      if (online !== isOnline) {
        checkNetworkStatus(); // Trigger immediate check on change
      }
    });

    // Handle app state changes (background/foreground)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkNetworkStatus(); // Check immediately when app comes to foreground
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      unsubscribe();
      appStateSubscription.remove();
    };
  }, [isOnline]);

  const handleRetry = async () => {
    await checkNetworkStatus();
  };

  return (
    <>
      {children}

      {/* Global Offline Modal */}
      <Modal
        visible={showOfflineModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
            </View>

            <Text style={styles.modalTitle}>No Internet Connection</Text>

            <Text style={styles.modalMessage}>
              Please check your Wi-Fi or mobile data connection.
            </Text>

            <View style={styles.connectionInfo}>
              <Text style={styles.connectionText}>
                Last checked: {new Date().toLocaleTimeString()}
              </Text>
              <Text style={styles.connectionText}>Next check in: 3 seconds</Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Check Now</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowOfflineModal(false)}>
              <Text style={styles.continueButtonText}>Continue Offline</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>

      {/* Global Offline Banner - Shows on all screens */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📡 No Internet Connection</Text>
          <Text style={styles.offlineSubText}>Last check: {new Date().toLocaleTimeString()}</Text>
        </View>
      )}
    </>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    QuicksandRegular: require('./src/assets/fonts/Quicksand-Regular.ttf'),
    QuicksandBold: require('./src/assets/fonts/Quicksand-Bold.ttf'),
    QuicksandSemiBold: require('./src/assets/fonts/Quicksand-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          {/* Single Network Provider that works for ALL screens */}
          <NetworkProvider>
            <NavigationContainer>
              <Routes />
              <Toast />
            </NavigationContainer>
          </NetworkProvider>
        </SafeAreaProvider>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  offlineIcon: {
    fontSize: 48,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  connectionInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  connectionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  retryButton: {
    backgroundColor: '#7B00FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  continueButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  offlineBanner: {
    backgroundColor: COLORS.purple_01,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  offlineSubText: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.9,
  },
});
