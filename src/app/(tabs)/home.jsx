import { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Terminal, Zap } from "lucide-react-native";
import { FEATURES } from "@/data/features";
import FeatureCard from "@/components/FeatureCard";
import { useSettingsStore } from "@/utils/settingsStore";

const CATEGORY_FILTERS = [
  { key: "all", label: "All" },
  { key: "session", label: "Session" },
  { key: "channels", label: "Channels" },
  { key: "bot", label: "Bot" },
  { key: "account", label: "Account" },
  { key: "data", label: "Data" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const backendUrl = useSettingsStore((s) => s.backendUrl);
  const load = useSettingsStore((s) => s.load);
  const isConfigured = !!backendUrl;

  useEffect(() => {
    load();
  }, []);

  const filteredFeatures =
    activeFilter === "all"
      ? FEATURES
      : FEATURES.filter((f) => f.category === activeFilter);

  const handleFeaturePress = useCallback(
    (feature) => {
      router.push(`/feature/${feature.id}`);
    },
    [router],
  );

  const featureRows = [];
  for (let i = 0; i < filteredFeatures.length; i += 2) {
    featureRows.push(filteredFeatures.slice(i, i + 2));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar style="light" />

      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "#00E5FF12",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Terminal size={18} color="#00E5FF" />
            </View>
            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: "700",
                  letterSpacing: -0.6,
                }}
              >
                Yuuri Tools
              </Text>
              <Text
                style={{
                  color: "#4B5563",
                  fontSize: 11,
                  fontWeight: "500",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Telegram Automation
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: isConfigured ? "#10B98112" : "#EF444412",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: isConfigured ? "#10B981" : "#EF4444",
              }}
            />
            <Text
              style={{
                color: isConfigured ? "#10B981" : "#EF4444",
                fontSize: 10,
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              {isConfigured ? "CONNECTED" : "OFFLINE"}
            </Text>
          </View>
        </View>
      </View>

      {!isConfigured && (
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings")}
          activeOpacity={0.8}
          style={{
            marginHorizontal: 20,
            marginBottom: 12,
            backgroundColor: "#1A1005",
            borderRadius: 10,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderWidth: 1,
            borderColor: "#F59E0B20",
          }}
        >
          <Zap size={16} color="#F59E0B" />
          <Text
            style={{
              color: "#F59E0B",
              fontSize: 12,
              fontWeight: "500",
              flex: 1,
            }}
          >
            Set Backend URL di Settings untuk connect
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginBottom: 6 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
      >
        {CATEGORY_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              activeOpacity={0.7}
              style={{
                backgroundColor: isActive ? "#FFFFFF" : "#111111",
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isActive ? "#FFFFFF" : "#1A1A1A",
              }}
            >
              <Text
                style={{
                  color: isActive ? "#050505" : "#6B7280",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {featureRows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}
          >
            {row.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onPress={() => handleFeaturePress(feature)}
              />
            ))}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
