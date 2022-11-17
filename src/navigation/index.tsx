/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "src/utils/constants/Colors";
import useColorScheme from "src/utils/hooks/useColorScheme";
import ModalScreen from "src/app/screens/ModalScreen";
import NotFoundScreen from "src/app/screens/NotFoundScreen";
import Home from "src/app/screens/Home";
import Contact from "src/app/screens/Contact";

// [IMPORT NEW COMPONENT SCREEN ABOVE] < Needed for importing screen

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "src/utils/types/types";
import LinkingConfiguration from "./LinkingConfiguration";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { selectTheme } from "src/app/screens/defaultLayout/slice/selectors";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

const Drawer = createDrawerNavigator<RootTabParamList>();
const DrawerNavigator = () => {
  const colorScheme = useColorScheme();
  const theme = useSelector(selectTheme);
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveBackgroundColor: theme.colors.gray[300],
        drawerIcon: () => (
          <DrawerIcon color={theme.colors.background} name="hand-o-up" />
        ),
        headerTintColor: theme.colors.text,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "Home",
          drawerIcon: ({ color }) => <DrawerIcon name="home" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="Contact"
        component={Contact}
        options={{
          title: "Contact",
          drawerIcon: ({ color }) => (
            <DrawerIcon name="dot-circle-o" color={color} />
          ),
        }}
      />

      {/* // [INSERT NEW SCREEN COMPONENT ABOVE] < Needed for generating screen */}

      {/**@End  */}
    </Drawer.Navigator>
  );
};

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function DrawerIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
