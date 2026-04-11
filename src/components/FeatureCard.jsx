import { TouchableOpacity, View, Text } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";

export default function FeatureCard({ feature, onPress }) {
  const IconComponent = LucideIcons[feature.icon] || LucideIcons.Zap;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.65}
      style={{
        backgroundColor: "#0E0E0E",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#161616",
        flex: 1,
        minHeight: 120,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: feature.color + "12",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <IconComponent size={18} color={feature.color} />
      </View>

      <View>
        <Text
          style={{
            color: "#F0F0F0",
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 2,
            letterSpacing: -0.2,
          }}
          numberOfLines={1}
        >
          {feature.title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#4B5563",
              fontSize: 10,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
            numberOfLines={1}
          >
            {feature.subtitle}
          </Text>
          <ChevronRight size={12} color="#2A2A2A" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
