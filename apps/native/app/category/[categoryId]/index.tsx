import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getCoursesByCategory } from "@/db/courses";
import { FlatList } from "react-native-gesture-handler";
import CourseCard from "@/components/course-card";
import { SafeAreaView } from "react-native-safe-area-context";

const CategoryDetails = () => {
    const { categoryId } = useLocalSearchParams()
    const { data: courses, isLoading, error, isError } = useQuery({
        queryKey: ['categories', categoryId],
        queryFn: () => getCoursesByCategory(Number(categoryId)),
    })
    console.log(courses)
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

            <View className="flex-1 px-3">
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CourseCard course={item} />}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={true}
                />
            </View>
        </SafeAreaView>
    )
}

export default CategoryDetails;