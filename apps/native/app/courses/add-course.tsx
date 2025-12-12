import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useForm } from "@tanstack/react-form";
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { addCategoryCourse, addCourse } from "@/db/courses";
import RNPickerSelect from 'react-native-picker-select';
import { useCallback, useState } from "react";
import { getAllCategories } from "@/db/categories";
import { Category } from "@/db/categories";
import { useColorScheme } from "@/lib/use-color-scheme";

const AddCourse = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const fetchData = async () => {
        try {
            setLoading(true)
            const data = await getAllCategories()
            console.log(data)
            setCategories(data)
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

    console.log(categories)

    const addCourseSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        link: z.string().url("Must be a valid URL (e.g., https://example.com)"),
        description: z.string().min(10, "Description must be at least 10 characters long"),
        status: z.enum(["not-started", "in-progress", "completed"]),
        category: z.string()
    })

    const form = useForm({
        defaultValues: {
            title: '',
            link: '',
            description: '',
            category: 'frontend',
            status: 'not-started' as "not-started" | "in-progress" | "completed",
        },
        validators: {
            onChange: addCourseSchema
        },
        onSubmit: async ({ value }) => {
            try {
                const course = await addCourse(value.title, value.link, value.description, value.status);

                if (!course) {
                    throw new Error("Failed to add course");
                }

                router.replace("/");
            } catch (error) {
                console.log(error);
            }
        },
    })

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 px-5 pt-2">
                    {/* Header */}
                    <View className="flex-row items-center mb-8 mt-2">
                        <Text className="text-3xl font-extrabold text-foreground tracking-tight">Add Course</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                        <View className="space-y-6">
                            <form.Field name="title">
                                {(field) => (
                                    <View className="mb-4">
                                        <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Title</Text>
                                        <View className={`bg-secondary/50 border rounded-2xl px-4 h-14 justify-center ${field.state.meta.errors.length ? 'border-red-500' : 'border-input'}`}>
                                            <TextInput
                                                className="text-foreground font-medium text-base h-full"
                                                placeholder="e.g. Master React Native"
                                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                                value={field.state.value}
                                                onChangeText={field.handleChange}
                                                onBlur={field.handleBlur}
                                            />
                                        </View>
                                        {field.state.meta.errors.length > 0 ? (
                                            <Text className="text-red-500 text-sm mt-1.5 ml-1 font-medium flex-row items-center">
                                                {field.state.meta.errors[0]?.message}
                                            </Text>
                                        ) : null}
                                    </View>
                                )}
                            </form.Field>

                            <form.Field name="link">
                                {(field) => (
                                    <View className="mb-4">
                                        <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Link</Text>
                                        <View className={`bg-secondary/50 border rounded-2xl px-4 h-14 justify-center ${field.state.meta.errors.length ? 'border-red-500' : 'border-input'}`}>
                                            <TextInput
                                                className="text-foreground font-medium text-base h-full"
                                                placeholder="https://..."
                                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                                value={field.state.value}
                                                onChangeText={field.handleChange}
                                                onBlur={field.handleBlur}
                                                autoCapitalize="none"
                                                inputMode="url"
                                            />
                                        </View>
                                        {field.state.meta.errors.length > 0 ? (
                                            <Text className="text-red-500 text-sm mt-1.5 ml-1 font-medium">
                                                {field.state.meta.errors[0]?.message}
                                            </Text>
                                        ) : null}
                                    </View>
                                )}
                            </form.Field>

                            <form.Field name="description">
                                {(field) => (
                                    <View className="mb-4">
                                        <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Description</Text>
                                        <View className={`bg-secondary/50 border rounded-2xl px-4 py-3 h-32 ${field.state.meta.errors.length ? 'border-red-500' : 'border-input'}`}>
                                            <TextInput
                                                className="text-foreground font-medium text-base h-full text-top"
                                                placeholder="What is this course about?"
                                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                                value={field.state.value}
                                                onChangeText={field.handleChange}
                                                onBlur={field.handleBlur}
                                                multiline
                                                textAlignVertical="top"
                                            />
                                        </View>
                                        {field.state.meta.errors.length > 0 ? (
                                            <Text className="text-red-500 text-sm mt-1.5 ml-1 font-medium">
                                                {field.state.meta.errors[0]?.message}
                                            </Text>
                                        ) : null}
                                    </View>
                                )}
                            </form.Field>

                            <form.Field name="category">
                                {(field) => (
                                    <View className="mb-4">
                                        <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Category</Text>
                                        <View className={`bg-secondary/50 border rounded-2xl px-4 h-14 justify-center ${field.state.meta.errors.length ? 'border-red-500' : 'border-input'}`}>
                                            <RNPickerSelect
                                                onValueChange={field.handleChange}
                                                value={field.state.value}
                                                items={categories.map((category) => ({
                                                    label: category.name,
                                                    value: category.id,
                                                }))}
                                                style={{
                                                    inputIOS: {
                                                        fontSize: 16,
                                                        lineHeight: 24,
                                                        paddingVertical: 12,
                                                        paddingHorizontal: 0,
                                                        color: isDark ? '#fff' : '#000',
                                                        fontFamily: 'System',
                                                        fontWeight: '500',
                                                        paddingRight: 30,
                                                    },
                                                    inputAndroid: {
                                                        fontSize: 16,
                                                        paddingHorizontal: 0,
                                                        paddingVertical: 8,
                                                        color: isDark ? '#fff' : '#000',
                                                        fontWeight: '500',
                                                        paddingRight: 30,
                                                    },
                                                    placeholder: {
                                                        color: "#fff",
                                                    },
                                                    iconContainer: {
                                                        top: 15,
                                                        right: 0,
                                                    }
                                                }}
                                                useNativeAndroidPickerStyle={false}
                                                placeholder={{}}
                                            />
                                        </View>
                                        {field.state.meta.errors.length > 0 ? (
                                            <Text className="text-red-500 text-sm mt-1.5 ml-1 font-medium">
                                                {field.state.meta.errors[0]?.message}
                                            </Text>
                                        ) : null}
                                    </View>
                                )}
                            </form.Field>
                        </View>
                    </ScrollView>

                    {/* Submit Button */}
                    <View className="py-6">
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <TouchableOpacity
                                    disabled={!canSubmit}
                                    onPress={form.handleSubmit}
                                    className={`w-full py-4 rounded-2xl flex-row justify-center items-center ${!canSubmit
                                        ? 'bg-slate-200 dark:bg-slate-800 opacity-50 shadow-none'
                                        : 'bg-primary dark:bg-slate-100 shadow-xl shadow-slate-300 dark:shadow-none'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <Text className={`font-bold text-lg ${!canSubmit ? 'text-slate-400 dark:text-slate-500' : 'text-primary-foreground dark:text-black'}`}>
                                            Creating...
                                        </Text>
                                    ) : (
                                        <>
                                            <Feather name="plus-circle" size={20} color={!canSubmit ? (isDark ? '#64748b' : '#94a3b8') : (isDark ? '#fff' : '#fff')} style={{ marginRight: 8 }} />
                                            <Text className={`font-bold text-lg ${!canSubmit ? 'text-slate-400 dark:text-slate-500' : 'text-primary-foreground dark:text-black'}`}>
                                                Create Course
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddCourse;