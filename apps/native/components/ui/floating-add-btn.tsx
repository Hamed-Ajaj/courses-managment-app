import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function FloatingAddBtn({ children }: { children: React.ReactNode }) {
    return (
        <View className="absolute bottom-6 left-0 right-0 items-center px-4">
            <Link href="/courses/add-course" asChild>
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="bg-primary w-full py-4 rounded-2xl dark:bg-slate-100 shadow-xl shadow-slate-300 dark:shadow-none flex-row justify-center items-center"
                >
                    <Feather name="plus" size={20} color={'#000'} style={{ marginRight: 8 }} />
                    <Text className="text-primary-foreground dark:text-black font-bold text-lg">{children}</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}