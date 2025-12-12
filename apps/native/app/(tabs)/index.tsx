import { View, Text, TextInput, FlatList, TouchableOpacity, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react"
import { Link, useFocusEffect, useRouter } from "expo-router"
import { supabase } from "@/utils/supabase"
import { Course, getAllCourses, addCourse, deleteCourse, CourseStatus } from "@/db/courses"
import { formatUrl, getStatusStyle } from "@/lib/utils"
import { useColorScheme } from "@/lib/use-color-scheme"

export default function HomeScreen() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/auth");
      }
    });
  }, []);

  // Colors
  const iconColor = isDark ? '#000' : '#64748b'; // slate-400 / slate-500
  const activeIconColor = isDark ? '#000' : '#fff'; // slate-100 / slate-900

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await getAllCourses()
      setCourses(data)
    } catch (e) {
      console.error(e)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )


  const handleDelete = async (id: number) => {
    await deleteCourse(id)
    fetchData()
  }

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.link && c.link.toLowerCase().includes(search.toLowerCase()))
  )




  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    )
  }

  const renderCard = ({ item }: { item: Course }) => {
    const statusStyle = getStatusStyle(item.status);
    const iconColor = isDark ? '#000' : '#64748b'; // slate-400 / slate-500
    return (
      <View className="bg-card p-4 rounded-2xl mb-3 border border-border shadow-sm">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-2">
            <Link href={`/courses/${item.id}`} asChild>
              <Text className="text-lg font-bold text-foreground leading-snug mb-1">{item.title}</Text>
            </Link>
            {item.link && (
              <View className="flex-row items-center">
                <Feather name="link" size={12} color={iconColor} style={{ marginRight: 4 }} />
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>{formatUrl(item.link)}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-1 opacity-50 hover:opacity-100">
            <Feather name="x" size={16} color={iconColor} />
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Status Badge */}
        <View className="flex-row justify-between items-center mt-1">
          <View className={`px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${statusStyle.text}`}>
              {item.status.replace('-', ' ')}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Feather name="clock" size={12} color={iconColor} style={{ marginRight: 4 }} />
              <Text className="text-[10px] text-muted-foreground font-medium">Updated recently</Text>
            </View>
          </View>
        </View>
      </View>
    )
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-5 pt-2">
        {/* Header Title */}
        <View className="items-center mb-6 mt-2">
          <Text className="text-3xl font-extrabold text-foreground tracking-tight">Courses</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-secondary/50 border border-input rounded-2xl px-4 h-12 mb-4">
          <Feather name="search" size={20} color={iconColor} style={{ marginRight: 10 }} />
          <TextInput
            className="flex-1 text-foreground font-medium h-full text-base"
            placeholder="Search..."
            placeholderTextColor={iconColor}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter / Sort Controls */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity className="flex-1 mr-2 bg-background border border-border py-2.5 rounded-xl flex-row justify-center items-center shadow-sm">
            <Text className="font-semibold text-foreground">Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 ml-2 bg-background border border-border py-2.5 rounded-xl flex-row justify-center items-center shadow-sm">
            <Text className="font-semibold text-foreground mr-2">All</Text>
            <Feather name="chevron-down" size={16} color={activeIconColor} />
          </TouchableOpacity>
        </View>

        {/* Course List */}
        <FlatList
          data={filteredCourses}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 opacity-50">
              <Feather name="inbox" size={48} color={iconColor} />
              <Text className="text-muted-foreground mt-4 text-center">No courses found.{'\n'}Add one to get started!</Text>
            </View>
          }
        />
      </View>

      {/* Floating Add Button Area */}
      <View className="absolute bottom-6 left-0 right-0 items-center px-4">
        <Link href="/courses/add-course" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={handleAddRandomCourse}
            className="bg-primary w-full py-4 rounded-2xl bg-slate-900 dark:bg-slate-100 shadow-xl shadow-slate-300 dark:shadow-none flex-row justify-center items-center"
          >
            <Feather name="plus" size={20} color={isDark ? '#fff' : '#000'} style={{ marginRight: 8 }} />
            <Text className="text-primary-foreground dark:text-black font-bold text-lg">Add New Course</Text>
          </TouchableOpacity>
        </Link>

      </View>
    </SafeAreaView>
  )
}
