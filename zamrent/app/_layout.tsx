
import {Tabs} from"expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function Layout(){
  return <Tabs
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName = 'alert-circle-outline';

      console.log('Route ', route.name);;

      if (route.name === '(tabs)/home') {
        iconName = 'home-outline';
      } else if (route.name === '(tabs)/sign-in') {
        iconName = 'log-in-outline';
      } else if (route.name === '(tabs)/sign-up') {
        iconName = 'person-add-outline';
      } else if (route.name === '(tabs)/profile') {
        iconName = 'person-circle-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#2f95dc',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
  })}

/>

}