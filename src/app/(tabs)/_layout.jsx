import { Tabs } from "expo-router";
import { Home, Layers, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#050505",
          borderTopWidth: 1,
          borderTopColor: "#111111",
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#2A2A2A",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Tools",
          tabBarIcon: ({ color }) => <Home size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color }) => <Layers size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={21} color={color} />,
        }}
      />
    </Tabs>
  );
}
