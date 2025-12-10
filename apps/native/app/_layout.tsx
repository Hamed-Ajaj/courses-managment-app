import { Stack } from "expo-router";
import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { NAV_THEME } from "@/lib/constants";
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Platform } from "react-native";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { initDb } from "@/db/database";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export const unstable_settings = {
	initialRouteName: "(drawer)",
};

export default function RootLayout() {
	// const hasMounted = useRef(false);
	// const { colorScheme, isDarkColorScheme } = useColorScheme();
	// const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	// useIsomorphicLayoutEffect(() => {
	// 	if (hasMounted.current) {
	// 		return;
	// 	}
	// 	if (Platform.OS === "web") {
	// 		document.documentElement.classList.add("bg-background");
	// 	}
	// 	setAndroidNavigationBar(colorScheme);
	// 	setIsColorSchemeLoaded(true);
	// 	hasMounted.current = true;
	// }, []);

	// if (!isColorSchemeLoaded) {
	// 	return null;
	// }
	useEffect(() => {
		initDb();
	}, []);
	return (
		// <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
		// <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack >
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="courses/[courseId]/index" options={{ headerShown: false }} />
			</Stack>
		</GestureHandlerRootView>
		// </ThemeProvider>
	);
}

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;
