import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

const CourseScreen = () => {
    const { courseId } = useLocalSearchParams()
    return <Text>Course Details {courseId}</Text>;
}

export default CourseScreen;
