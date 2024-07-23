import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AddContactScreen from './src/Screens/AddContactScreen';
import ContactListScreen from './src/Screens/ContactListScreen';
import FavoriteContactListScreen from './src/Screens/FavoriteContactListScreen';
import UpdateContactScreen from './src/Screens/UpdateContactScreen';
import ContactDetailsScreen from './src/Screens/ContactDetailsScreen';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ContactListStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="ContactList"
        component={ContactListScreen}
        options={{
          headerLeft: () => (
            <Icon
              name="menu"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              size={30}
            />
          ),
        }}
      />
      <Stack.Screen name="AddContact" component={AddContactScreen} />
      <Stack.Screen name="UpdateContact" component={UpdateContactScreen} />
      <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="ContactList"
        component={ContactListStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="FavoriteContacts"
        component={FavoriteContactListScreen}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNav />
    </NavigationContainer>
  );
}
