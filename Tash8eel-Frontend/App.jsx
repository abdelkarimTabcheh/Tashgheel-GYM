import React, { useState } from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import store from './app/features/store';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  const [isSignedIn, setSignedIn] = useState(false);

  return (
    
      <Provider store={store}>
        <AppNavigator isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
      </Provider>

  );
}
