import { Text, TouchableOpacity, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getCoursesByCategory } from "@/db/courses";
import { FlatList } from "react-native-gesture-handler";
import CourseCard from "@/components/course-card";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import FloatingAddBtn from "@/components/ui/floating-add-btn";

const CategoryDetails = () => {
    const { categoryId } = useLocalSearchParams()

    const { data: courses, isLoading, error, isError } = useQuery({
        queryKey: ['categories', categoryId],
        queryFn: () => getCoursesByCategory(Number(categoryId)),
    })

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View>
                <Text>Error: {error.message}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>

            <View className="flex-1 px-3 py-4">
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CourseCard course={item} />}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={true}

                    ListEmptyComponent={
                        <View className="items-center justify-center py-20 opacity-50">
                            <Feather name="inbox" size={48} color={'#64748b'} />
                            <Text className="text-muted-foreground mt-4 text-center">No courses found.{'\n'}Add one to get started!</Text>
                        </View>
                    }
                />
            </View>

            {/* Floating Add Button Area */}
            <FloatingAddBtn url="/courses/add-course">Add new course</FloatingAddBtn>
        </SafeAreaView>
    )
}

export default CategoryDetails;