
import { Category, getAllCategories } from "@/db/categories";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useCallback } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import CategoryCard from "@/components/category-card";
import { getCoursesByCategory } from "@/db/courses";
import FloatingAddBtn from "@/components/ui/floating-add-btn";

const CategoriesScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-3 pt-2">
        {/* Header Title */}
        <View className="items-center mb-6 mt-2">
          <Text className="text-3xl font-extrabold text-foreground tracking-tight">Categories</Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(item) => <CategoryCard item={item.item} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-20 opacity-50">
                <View className="w-20 h-20 bg-secondary/50 rounded-full items-center justify-center mb-4">
                  <Feather name="grid" size={32} color={isDark ? "#94a3b8" : "#64748b"} />
                </View>
                <Text className="text-lg font-semibold text-foreground">No categories yet</Text>
                <Text className="text-muted-foreground mt-1 text-center">Add your first category to get started!</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Floating Add Button */}
      <FloatingAddBtn url="/category/add-category">Add New Category</FloatingAddBtn>
    </SafeAreaView>
  );
}

export default CategoriesScreen;
