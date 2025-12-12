
import { Category, getAllCategories } from "@/db/categories";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useCallback } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import CategoryCard from "@/components/category-card";

const CategoriesScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );


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
      <View className="absolute bottom-6 left-0 right-0 items-center px-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/categories/add-category')}
          className="bg-primary w-full py-4 rounded-2xl bg-slate-900 dark:bg-slate-100 shadow-xl shadow-slate-300 dark:shadow-none flex-row justify-center items-center"
        >
          <Feather name="plus" size={20} color={isDark ? '#000' : '#fff'} style={{ marginRight: 8 }} />
          <Text className="text-primary-foreground dark:text-black font-bold text-lg">Add New Category</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default CategoriesScreen;
