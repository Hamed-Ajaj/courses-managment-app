
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useForm } from "@tanstack/react-form";
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useAddCategory } from "@/lib/query/categories.query";

const COLORS = [
    "#3b82f6", // Blue
    "#22c55e", // Green
    "#ef4444", // Red
    "#eab308", // Yellow
    "#a855f7", // Purple
    "#ec4899", // Pink
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#64748b", // Slate
];

const ICONS = [
    "grid",
    "code",
    "book",
    "cpu",
    "database",
    "layout",
    "smartphone",
    "monitor",
    "briefcase",
    "coffee",
    "music",
    "video",
    "image",
    "map",
    "star",
    "heart"
];

const AddCategory = () => {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { mutateAsync: createCategory, isPending, isSuccess } = useAddCategory();

    const addCategorySchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters long"),
        color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color hex code"),
        icon: z.string().min(1, "Please select an icon"),
    });

    const form = useForm({
        defaultValues: {
            name: '',
            color: COLORS[0],
            icon: ICONS[0],
        },
        validators: {
            onChange: addCategorySchema
        },
        onSubmit: async ({ value }) => {
            await createCategory(value);
            router.back();
        },
    });

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 px-5 pt-2">

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                        <View className="space-y-6">
                            <form.Field name="name">
                                {(field) => (
                                    <View className="mb-4">
                                        <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Category Name</Text>
                                        <View className={`bg-secondary/50 border rounded-2xl px-4 h-14 justify-center ${field.state.meta.errors.length ? 'border-red-500' : 'border-input'}`}>
                                            <TextInput
                                                className="text-foreground font-medium text-base h-full"
                                                placeholder="e.g. Work, Personal"
                                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                                value={field.state.value}
                                                onChangeText={field.handleChange}
                                                onBlur={field.handleBlur}
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

                            <form.Field name="color">
                                {(field) => (
                                    <View className="mb-4">
                                        <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Color Tag</Text>
                                        <View className="flex-row flex-wrap gap-4 justify-start">
                                            {COLORS.map((color) => (
                                                <TouchableOpacity
                                                    key={color}
                                                    onPress={() => field.handleChange(color)}
                                                    className={`w-12 h-12 rounded-full justify-center items-center border-[3px] ${field.state.value === color ? 'border-foreground' : 'border-transparent'}`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {field.state.value === color && (
                                                        <Feather name="check" size={20} color="white" />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {field.state.meta.errors.length > 0 ? (
                                            <Text className="text-red-500 text-sm mt-1.5 ml-1 font-medium">
                                                {field.state.meta.errors[0]?.message}
                                            </Text>
                                        ) : null}
                                    </View>
                                )}
                            </form.Field>

                            <form.Field name="icon">
                                {(field) => (
                                    <View className="mb-4">
                                        <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Icon</Text>
                                        <View className="flex-row flex-wrap gap-4 justify-start">
                                            {ICONS.map((iconName) => (
                                                <TouchableOpacity
                                                    key={iconName}
                                                    onPress={() => field.handleChange(iconName)}
                                                    className={`w-12 h-12 rounded-2xl justify-center items-center border ${field.state.value === iconName ? 'bg-primary border-primary' : 'bg-secondary/50 border-input'}`}
                                                >
                                                    <Feather
                                                        name={iconName as any}
                                                        size={24}
                                                        color={field.state.value === iconName ? (isDark ? '#000' : '#fff') : (isDark ? '#94a3b8' : '#64748b')}
                                                    />
                                                </TouchableOpacity>
                                            ))}
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
                                            <Feather name="plus-circle" size={20} color={!canSubmit ? (isDark ? '#64748b' : '#94a3b8') : (isDark ? '#fff' : '#000')} style={{ marginRight: 8 }} />
                                            <Text className={`font-bold text-lg ${!canSubmit ? 'text-slate-400 dark:text-slate-500' : 'text-primary-foreground dark:text-black'}`}>
                                                Create Category
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
export default AddCategory;