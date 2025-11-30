import { Tabs } from "expo-router";
import { Home, PlaneTakeoff, Map, BarChart3 } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E9F0",
          paddingBottom: 10,
          paddingTop: 10,
          height: 90,
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "#7D8794",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          fontFamily: "Poppins_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="book-flight"
        options={{
          title: "Book Flight",
          tabBarIcon: ({ color, size }) => (
            <PlaneTakeoff color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Routes",
          tabBarIcon: ({ color, size }) => <Map color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="flight-progress/[sessionId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="select-seat/[sessionId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="boarding-pass/[sessionId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="session-complete/[sessionId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
