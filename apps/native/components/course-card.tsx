import { Course, deleteCourse } from "@/db/courses";
import { formatUrl, getStatusStyle } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useMutation } from "@tanstack/react-query";
import { useDeleteCourse } from "@/lib/query/courses.query";

const CourseCard = ({ course }: { course: Course }) => {
    const { mutateAsync: deleteCourse, isPending } = useDeleteCourse()
    const router = useRouter()
    const statusStyle = getStatusStyle(course.status);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#000' : '#64748b'; // slate-400 / slate-500

    const handleDelete = async (id: number) => {
        await deleteCourse(id)
    }
    return (
        <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)} className="bg-card p-4 rounded-2xl mb-3 border border-border shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-2">
                    <Text className="text-lg font-bold text-foreground leading-snug mb-1">{course.title}</Text>
                    {course.link && (
                        <View className="flex-row items-center">
                            <Feather name="link" size={12} color={iconColor} style={{ marginRight: 4 }} />
                            <Text className="text-xs text-muted-foreground" numberOfLines={1}>{formatUrl(course.link)}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity onPress={() => handleDelete(course.id)} className="p-1 opacity-50 hover:opacity-100">
                    <Feather name="x" size={16} color={isPending ? '#fff' : iconColor} />
                </TouchableOpacity>
            </View>

            {/* Bottom Row: Status Badge */}
            <View className="flex-row justify-between items-center mt-1">
                <View className={`px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                    <Text className={`text-[10px] font-bold uppercase tracking-wider ${statusStyle.text}`}>
                        {course.status.replace('-', ' ')}
                    </Text>
                </View>

                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center">
                        <Feather name="clock" size={12} color={iconColor} style={{ marginRight: 4 }} />
                        <Text className="text-[10px] text-muted-foreground font-medium">Updated recently</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CourseCard;