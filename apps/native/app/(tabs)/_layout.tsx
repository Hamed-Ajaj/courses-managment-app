import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDark ? '#3b82f6' : '#2563eb', // blue-500 : blue-600
        tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8', // slate-500 : slate-400
        tabBarStyle: {
          backgroundColor: isDark ? '#020617' : '#ffffff', // slate-950 : white
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0', // slate-800 : slate-200
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <Feather name="grid" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
