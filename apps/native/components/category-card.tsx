import { Category } from "@/db/categories";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useQuery } from "@tanstack/react-query";
import { getCourseByCategoryCount } from "@/db/courses";
import { Link, useRouter } from "expo-router";

const CategoryCard = ({ item }: { item: Category }) => {
    const { colorScheme } = useColorScheme();
    const router = useRouter()
    const isDark = colorScheme === 'dark';
    const { data: courseCount } = useQuery({
        queryKey: ['courses', item.id],
        queryFn: () => getCourseByCategoryCount(item.id),
    })

    return (
        <TouchableOpacity
            className="flex-1 m-2 bg-card p-4 rounded-2xl border border-border shadow-sm justify-between h-36"
            activeOpacity={0.7}
            style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.00,
                elevation: 1,
            }}
            onPress={() => router.push(`/category/${item.id}`)}
        >
            <View className="flex-row justify-between items-start">
                <View
                    className="p-3 rounded-xl justify-center items-center"
                    style={{ backgroundColor: item.color + '15' }}
                >
                    <Feather name={(item.icon || 'grid') as any} size={24} color={item.color} />
                </View>
                <TouchableOpacity>
                    <Feather name="more-horizontal" size={20} color={isDark ? "#94a3b8" : "#cbd5e1"} />
                </TouchableOpacity>
            </View>

            <View>
                <Text className="text-lg font-bold text-foreground mb-1" numberOfLines={1}>{item.name}</Text>
                <View className="flex-row items-center">
                    <Text className="text-xs text-muted-foreground mr-1">{courseCount} Courses</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

export default CategoryCard;
