import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/features/index";

import LoginScreen from "./src/screens/Authentication/LoginScreen";
import UserTypeScreen from "./src/screens/Authentication/UserTypeScreen";
import CredentialsScreen from "./src/screens/Authentication/CredentialsScreen";

import Tabs from "./src/screens/Navigation/Tabs";
import SplashScreen from "./src/screens/Onboarding/SplashScreen";

import Toast from "react-native-toast-message";
import { toastConfig } from "./src/components/General/Toaster";
import { Logout, sendIsAuth } from "./src/features/auth-actions";
import { useEffect, useMemo, useRef } from "react";
import EditProfileScreen from "./src/screens/HomeStack/EditProfileScreen";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import Mapbox from "@rnmapbox/maps";
import { requestCrops } from "./src/features/crop-actions";

Mapbox.setAccessToken(
  "pk.eyJ1IjoiemVsbGRlbGwiLCJhIjoiY2x0d3hjdG91MDBheTJqczdqcHRjdWhpZSJ9.UyWdrUlPhJlQN-XE_JoP6Q"
);

//Authentication Screens

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Layout style={styles.AndroidSafeArea}></Layout>
      </GestureHandlerRootView>
    </Provider>
  );
}

const AuthStack = () => {
  isNewUser = useSelector((state) => state.ui.isNewUser);
  return (
    <Stack.Navigator>
      {isNewUser ? (
        <>
          <Stack.Screen
            name="Splash"
            options={{ headerShown: false }}
            component={SplashScreen}
          />

          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="UserType"
            options={{ headerShown: false, animation: "slide_from_right" }}
            component={UserTypeScreen}
          />
          <Stack.Screen
            name="Credentials"
            options={{ headerShown: false, animation: "slide_from_right" }}
            component={CredentialsScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="UserType"
            options={{ headerShown: false, animation: "slide_from_right" }}
            component={UserTypeScreen}
          />
          <Stack.Screen
            name="Credentials"
            options={{ headerShown: false, animation: "slide_from_right" }}
            component={CredentialsScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const MainStack = () => {
  const isNewUser = useSelector((state) => state.ui.isNewUser);

  return (
    <Stack.Navigator>
      <>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />

        {isNewUser && (
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        )}
      </>
    </Stack.Navigator>
  );
};

export const Layout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const initializeDependecies = async () => {
      try {
        dispatch(Logout());
        // await dispatch(sendIsAuth());
        await dispatch(requestCrops());
      } catch (err) {
        console.log(err);
      }
    };
    initializeDependecies();
  }, []);
  const isAuthenticated = useSelector((state) => state.auth.authenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}

      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
