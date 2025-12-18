import { View, Text, TextInput, FlatList, TouchableOpacity, Platform, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { supabase } from "@/utils/supabase"
import { useColorScheme } from "@/lib/use-color-scheme"
import CourseCard from "@/components/course-card"
import { useQuery } from "@tanstack/react-query"
import { fetchCourses } from "@/lib/api/courses.api"
import FloatingAddBtn from "@/components/ui/floating-add-btn"

type FilterStatus = 'all' | 'not-started' | 'in-progress' | 'completed';
type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a' | 'status';

export default function HomeScreen() {

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const { data: courses, isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetchCourses(),
    staleTime: Infinity,
  })

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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    )
  }
  // Colors
  const iconColor = isDark ? '#000' : '#64748b'; // slate-400 / slate-500

  // Filter by search and status
  const filteredCourses = courses?.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search?.toLowerCase()) ||
      (c.link && c.link.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort courses
  const sortedCourses = [...(filteredCourses || [])].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'a-z':
        return a.title.localeCompare(b.title);
      case 'z-a':
        return b.title.localeCompare(a.title);
      case 'status':
        const statusOrder = { 'not-started': 0, 'in-progress': 1, 'completed': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      default:
        return 0;
    }
  });

  const getFilterLabel = () => {
    switch (filterStatus) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'All';
    }
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case 'newest': return 'Newest';
      case 'oldest': return 'Oldest';
      case 'a-z': return 'A-Z';
      case 'z-a': return 'Z-A';
      case 'status': return 'Status';
      default: return 'Newest';
    }
  };

  const FilterOption = ({ label, value, onSelect }: { label: string; value: FilterStatus; onSelect: (value: FilterStatus) => void }) => (
    <TouchableOpacity
      className={`py-3 px-4 border-b border-border rounded-xl ${filterStatus === value ? 'bg-primary/10' : ''}`}
      onPress={() => {
        onSelect(value);
        setShowFilterModal(false);
      }}
    >
      <View className="flex-row justify-between items-center">
        <Text className={`font-medium ${filterStatus === value ? 'text-primary' : 'text-foreground'}`}>{label}</Text>
        {filterStatus === value && <Feather name="check" size={16} color={'#000'} />}
      </View>
    </TouchableOpacity>
  );

  const SortOption = ({ label, value, onSelect }: { label: string; value: SortOption; onSelect: (value: SortOption) => void }) => (
    <TouchableOpacity
      className={`py-3 px-4 border-b border-border rounded-lg ${sortOption === value ? 'bg-primary/10' : ''}`}
      onPress={() => {
        onSelect(value);
        setShowSortModal(false);
      }}
    >
      <View className="flex-row justify-between items-center">
        <Text className={`font-medium ${sortOption === value ? 'text-primary' : 'text-foreground'}`}>{label}</Text>
        {sortOption === value && <Feather name="check" size={16} color={'#000'} />}
      </View>
    </TouchableOpacity>
  );

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
        <View className="flex-row justify-between mb-6 relative">
          <View className="flex-1 mr-2 relative">
            <TouchableOpacity
              className="bg-background border border-border py-2.5 rounded-xl flex-row justify-center items-center shadow-sm"
              onPress={() => {
                setShowFilterModal(!showFilterModal);
                setShowSortModal(false);
              }}
            >
              <Feather name="filter" size={16} color={'#000'} style={{ marginRight: 6 }} />
              <Text className="font-semibold text-foreground">{getFilterLabel()}</Text>
            </TouchableOpacity>

            {showFilterModal && (
              <>
                <TouchableOpacity
                  className="absolute inset-0 w-screen h-screen"
                  style={{ left: -20, top: -200, zIndex: 998 }}
                  onPress={() => setShowFilterModal(false)}
                  activeOpacity={1}
                />
                <View
                  className="absolute left-0 right-0 bg-card rounded-xl border border-border shadow-xl overflow-hidden"
                  style={{
                    top: 50,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 999,
                    zIndex: 999,
                  }}
                >
                  <FilterOption label="All Courses" value="all" onSelect={setFilterStatus} />
                  <FilterOption label="Not Started" value="not-started" onSelect={setFilterStatus} />
                  <FilterOption label="In Progress" value="in-progress" onSelect={setFilterStatus} />
                  <FilterOption label="Completed" value="completed" onSelect={setFilterStatus} />
                </View>
              </>
            )}
          </View>

          <View className="flex-1 ml-2 relative">
            <TouchableOpacity
              className="bg-background border border-border py-2.5 rounded-xl flex-row justify-center items-center shadow-sm"
              onPress={() => {
                setShowSortModal(!showSortModal);
                setShowFilterModal(false);
              }}
            >
              <Text className="font-semibold text-foreground mr-2">{getSortLabel()}</Text>
              <Feather name="chevron-down" size={16} color={'#000'} />
            </TouchableOpacity>

            {showSortModal && (
              <>
                <TouchableOpacity
                  className="absolute inset-0 w-screen h-screen"
                  style={{ left: -200, top: -200, zIndex: 998 }}
                  onPress={() => setShowSortModal(false)}
                  activeOpacity={1}
                />
                <View
                  className="absolute left-0 right-0 bg-card rounded-xl border border-border shadow-xl overflow-hidden"
                  style={{
                    top: 50,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 999,
                    zIndex: 999,
                  }}
                >
                  <SortOption label="Newest First" value="newest" onSelect={setSortOption} />
                  <SortOption label="Oldest First" value="oldest" onSelect={setSortOption} />
                  <SortOption label="A-Z" value="a-z" onSelect={setSortOption} />
                  <SortOption label="Z-A" value="z-a" onSelect={setSortOption} />
                  <SortOption label="Status" value="status" onSelect={setSortOption} />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Course List */}
        <FlatList
          data={sortedCourses}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <CourseCard course={item} />}
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
      <FloatingAddBtn>Add New Course</FloatingAddBtn>
    </SafeAreaView>
  )
}
