
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function AuthScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    // Check if user is already authenticated
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.replace("/");
            } else {
                setCheckingSession(false);
            }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                router.replace("/");
            }
        });
    }, []);

    const authSchema = z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            setLoading(false);
        }
        catch (error: any) {
            Alert.alert("Error", error.message);
            setLoading(false);
        }
    }

    const signUp = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            // Alert.alert("Success", "Please check your inbox for email verification!");
            setLoading(false);
        }
        catch (error: any) {
            Alert.alert("Error", error.message);
            setLoading(false);
        }
    }

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onChange: authSchema,
        },
        onSubmit: async ({ value }) => {
            if (loading) return;
            setLoading(true);
            const { email, password } = value;
            try {
                if (isSignUp) {
                    await signUp(email, password);
                } else {
                    signIn(email, password)
                }
            } catch (error: any) {
                Alert.alert("Error", error.message);
                setLoading(false);
            }
        },
    });

    if (checkingSession) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#000000"} />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    className="px-6"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View className="items-center mb-10">
                        <View className="bg-primary/10 p-4 rounded-full mb-4">
                            <Feather name="lock" size={32} color={isDark ? "#3b82f6" : "#2563eb"} />
                        </View>
                        <Text className="text-3xl font-extrabold text-foreground tracking-tight text-center">
                            {isSignUp ? "Create Account" : "Welcome Back"}
                        </Text>
                        <Text className="text-muted-foreground text-center mt-2 text-base">
                            {isSignUp
                                ? "Sign up to start managing your courses"
                                : "Sign in to continue your progress"}
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        <form.Field name="email">
                            {(field) => (
                                <View className="mb-4">
                                    <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Email</Text>
                                    <View className={`bg-secondary/50 border rounded-2xl px-4 h-14 justify-center flex-row items-center ${field.state.meta.errors.length ? 'border-red-500' : 'border-input'}`}>
                                        <Feather name="mail" size={20} color={isDark ? '#94a3b8' : '#64748b'} style={{ marginRight: 10 }} />
                                        <TextInput
                                            className="flex-1 text-foreground font-medium text-base h-full"
                                            placeholder="hello@example.com"
                                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                            value={field.state.value}
                                            onChangeText={field.handleChange}
                                            onBlur={field.handleBlur}
                                            autoCapitalize="none"
                                            inputMode="email"
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

                        <form.Field name="password">
                            {(field) => (
                                <View className="mb-6">
                                    <Text className="mb-2 text-foreground font-semibold ml-1 text-base">Password</Text>
                                    <View className={`bg-secondary/50 border rounded-2xl px-4 h-14 justify-center flex-row items-center ${field.state.meta.errors.length ? 'border-red-500' : 'border-input'}`}>
                                        <Feather name="key" size={20} color={isDark ? '#94a3b8' : '#64748b'} style={{ marginRight: 10 }} />
                                        <TextInput
                                            className="flex-1 text-foreground font-medium text-base h-full"
                                            placeholder="••••••••"
                                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                            value={field.state.value}
                                            onChangeText={field.handleChange}
                                            onBlur={field.handleBlur}
                                            autoCapitalize="none"
                                            secureTextEntry
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

                        {/* Submit Button */}
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <TouchableOpacity
                                    disabled={!canSubmit || loading}
                                    onPress={form.handleSubmit}
                                    className={`w-full py-4 rounded-2xl flex-row justify-center items-center ${(!canSubmit || loading)
                                        ? 'bg-slate-200 dark:bg-slate-800 opacity-50 shadow-none'
                                        : 'bg-primary  dark:bg-slate-100 shadow-xl shadow-slate-300 dark:shadow-none'
                                        }`}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={isDark ? "#000" : "#fff"} />
                                    ) : (
                                        <>
                                            <Text className={`font-bold text-lg ${(!canSubmit || loading) ? 'text-slate-400 dark:text-slate-500' : 'text-primary-foreground dark:text-black'}`}>
                                                {isSignUp ? "Sign Up" : "Sign In"}
                                            </Text>
                                            <Feather name="arrow-right" size={20} color={(!canSubmit || loading) ? (isDark ? '#3b82f6' : '#000') : (isDark ? '#000' : '#3b82f6')} style={{ marginLeft: 8 }} />
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {/* Toggle Mode */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-muted-foreground text-base">
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        </Text>
                        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                            <Text className="text-primary font-bold text-base text-blue-600 dark:text-blue-400">
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
