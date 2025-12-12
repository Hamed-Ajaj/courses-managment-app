import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteAll } from "@/db/reset";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "@/lib/use-color-scheme";

const SettingsScreen = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error;
        router.replace("/auth");
    }

    const handleReset = () => {
        Alert.alert(
            "Reset Database",
            "Are you sure you want to delete all data? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAll();
                            Alert.alert("Success", "All data has been deleted.");
                        } catch (e) {
                            Alert.alert("Error", "Failed to reset database");
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace("/auth");
            }
        });
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView className="flex-1 px-5 pt-2">
                <View className="items-center mb-6 mt-2">
                    <Text className="text-3xl font-extrabold text-foreground tracking-tight">Settings</Text>
                </View>

                <View className="space-y-4">
                    {/* Logout Button */}
                    <TouchableOpacity
                        onPress={logout}
                        className="flex-row items-center bg-card p-4 rounded-2xl border border-border shadow-sm"
                    >
                        <View className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl mr-4">
                            <Feather name="log-out" size={20} className="text-red-600 dark:text-red-400" color={isDark ? '#f87171' : '#dc2626'} />
                        </View>
                        <Text className="text-lg font-semibold text-foreground">Logout</Text>
                    </TouchableOpacity>

                    {/* Reset Database Button */}
                    <TouchableOpacity
                        onPress={handleReset}
                        className="flex-row items-center bg-card p-4 rounded-2xl border border-border shadow-sm"
                    >
                        <View className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl mr-4">
                            <Feather name="trash-2" size={20} className="text-orange-600 dark:text-orange-400" color={isDark ? '#fb923c' : '#ea580c'} />
                        </View>
                        <View>
                            <Text className="text-lg font-semibold text-foreground">Reset Database</Text>
                            <Text className="text-sm text-muted-foreground">Delete all courses and categories</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
export default SettingsScreen;