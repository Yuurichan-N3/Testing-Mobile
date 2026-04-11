import { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Animated,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import {
  ChevronLeft,
  Play,
  Loader,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import LogTerminal from "@/components/LogTerminal";
import { FEATURES, EMOJIS } from "@/data/features";
import { api } from "@/utils/api";
import { useSettingsStore } from "@/utils/settingsStore";

function SelectField({ field, value, onChange }) {
  return (
    <View style={{ gap: 5 }}>
      {field.options.map((option) => {
        const isSelected = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(option.value);
            }}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isSelected ? "#FFFFFF08" : "#080808",
              borderRadius: 10,
              paddingHorizontal: 13,
              paddingVertical: 11,
              borderWidth: 1,
              borderColor: isSelected ? "#FFFFFF20" : "#161616",
              gap: 10,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 1.5,
                borderColor: isSelected ? "#FFFFFF" : "#2A2A2A",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSelected && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                  }}
                />
              )}
            </View>
            <Text
              style={{
                color: isSelected ? "#FFFFFF" : "#6B7280",
                fontSize: 13,
                fontWeight: "500",
                flex: 1,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function EmojiField({ value, onChange }) {
  const selectedEmojis = value ? value.split(",") : [];

  const toggleEmoji = (emoji) => {
    Haptics.selectionAsync();
    const current = [...selectedEmojis];
    const idx = current.indexOf(emoji);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(emoji);
    }
    onChange(current.join(","));
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
      {EMOJIS.map((item) => {
        const isSelected = selectedEmojis.includes(item.emoji);
        return (
          <TouchableOpacity
            key={item.emoji}
            onPress={() => toggleEmoji(item.emoji)}
            activeOpacity={0.7}
            style={{
              width: 46,
              height: 46,
              borderRadius: 10,
              backgroundColor: isSelected ? "#FFFFFF10" : "#080808",
              borderWidth: 1,
              borderColor: isSelected ? "#FFFFFF30" : "#161616",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function FeatureDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [formValues, setFormValues] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [taskStatus, setTaskStatus] = useState(null); // 'success' | 'error' | null
  const progressAnim = useRef(new Animated.Value(0)).current;
  const backendUrl = useSettingsStore((s) => s.backendUrl);

  const paddingAnimation = useRef(
    new Animated.Value(insets.bottom + 12),
  ).current;

  const animateTo = (val) => {
    Animated.timing(paddingAnimation, {
      toValue: val,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputFocus = () => {
    if (Platform.OS === "web") return;
    animateTo(12);
  };

  const handleInputBlur = () => {
    if (Platform.OS === "web") return;
    animateTo(insets.bottom + 12);
  };

  const feature = useMemo(() => FEATURES.find((f) => f.id === id), [id]);

  const updateField = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addLog = useCallback((type, message) => {
    setLogs((prev) => [...prev, { type, message }]);
  }, []);

  const runTask = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setLogs([]);
    setTaskStatus(null);
    progressAnim.setValue(0);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.timing(progressAnim, {
      toValue: 0.9,
      duration: 8000,
      useNativeDriver: false,
    }).start();

    addLog("process", "Initializing task...");

    if (!backendUrl) {
      addLog("info", "Demo mode — backend not configured");
      addLog("process", `Running ${feature.title}...`);

      const fieldSummary = Object.entries(formValues)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(
          ([k, v]) =>
            `${k}: ${typeof v === "boolean" ? (v ? "Yes" : "No") : v}`,
        )
        .join(", ");

      if (fieldSummary) {
        addLog("info", `Params: ${fieldSummary}`);
      }

      await new Promise((r) => setTimeout(r, 600));
      addLog("process", "Processing session: yuurisan");
      await new Promise((r) => setTimeout(r, 500));
      addLog("success", `Task completed → yuurisan`);
      await new Promise((r) => setTimeout(r, 400));
      addLog("process", "Processing session: account2");
      await new Promise((r) => setTimeout(r, 500));
      addLog("success", `Task completed → account2`);
      await new Promise((r) => setTimeout(r, 300));
      addLog("success", `Done. 2/2 sessions processed.`);

      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setTaskStatus("success");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsRunning(false);
      return;
    }

    try {
      addLog("process", `Connecting to ${backendUrl}...`);

      const apiMethod = feature.apiMethod;
      if (!apiMethod || !api[apiMethod]) {
        throw new Error(`API method "${apiMethod}" not found`);
      }

      const args = Object.values(formValues);
      addLog("process", `Executing ${feature.title}...`);

      const result = await api[apiMethod](...args);

      if (result.results) {
        for (const r of result.results) {
          if (r.success) {
            addLog(
              "success",
              `${r.session}: ${JSON.stringify(r.result).substring(0, 100)}`,
            );
          } else {
            addLog("error", `${r.session}: ${r.error}`);
          }
        }
      }

      const summary = result.summary || {};
      const successCount =
        summary.successfulSessions || summary.activeSessions || 0;
      const totalCount = summary.totalSessions || 0;

      addLog(
        "success",
        `Done. ${successCount}/${totalCount} sessions processed.`,
      );

      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setTaskStatus("success");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      addLog("error", error.message || "Task failed");
      setTaskStatus("error");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, formValues, feature, backendUrl, progressAnim, addLog]);

  if (!feature) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050505",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#EF4444", fontSize: 16 }}>
          Feature not found
        </Text>
      </View>
    );
  }

  const IconComponent = LucideIcons[feature.icon] || LucideIcons.Zap;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const getButtonColor = () => {
    if (isRunning) return "#111111";
    if (taskStatus === "success") return "#10B981";
    if (taskStatus === "error") return "#EF4444";
    return "#FFFFFF";
  };

  const getButtonTextColor = () => {
    if (isRunning) return "#4B5563";
    return "#050505";
  };

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: "#050505" }}
      behavior="padding"
    >
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 4,
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#111111",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: "#0E0E0E",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
              borderWidth: 1,
              borderColor: "#161616",
            }}
          >
            <ChevronLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: feature.color + "12",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <IconComponent size={16} color={feature.color} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
                letterSpacing: -0.3,
              }}
            >
              {feature.title}
            </Text>
            <Text style={{ color: "#4B5563", fontSize: 11 }} numberOfLines={1}>
              {feature.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress bar */}
      {isRunning && (
        <View style={{ height: 2, backgroundColor: "#111111" }}>
          <Animated.View
            style={{
              height: "100%",
              width: progressWidth,
              backgroundColor: feature.color,
            }}
          />
        </View>
      )}

      {/* Form */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {feature.fields.length === 0 ? (
          <View
            style={{
              backgroundColor: "#0E0E0E",
              borderRadius: 12,
              padding: 24,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#161616",
            }}
          >
            <IconComponent
              size={28}
              color={feature.color}
              style={{ marginBottom: 12 }}
            />
            <Text
              style={{
                color: "#E5E5E5",
                fontSize: 15,
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              No Configuration Needed
            </Text>
            <Text
              style={{
                color: "#4B5563",
                fontSize: 12,
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Fitur ini berjalan otomatis tanpa input. Tekan Run untuk memulai.
            </Text>
          </View>
        ) : (
          feature.fields.map((field) => (
            <View key={field.key} style={{ marginBottom: 16 }}>
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 10,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 6,
                  marginLeft: 2,
                }}
              >
                {field.label}
                {field.required && <Text style={{ color: "#EF4444" }}> *</Text>}
              </Text>

              {(field.type === "text" || field.type === "password") && (
                <TextInput
                  value={formValues[field.key] || ""}
                  onChangeText={(v) => updateField(field.key, v)}
                  placeholder={field.placeholder}
                  placeholderTextColor="#2A2A2A"
                  secureTextEntry={field.type === "password"}
                  keyboardType={field.keyboardType || "default"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    backgroundColor: "#0E0E0E",
                    borderRadius: 10,
                    paddingHorizontal: 13,
                    paddingVertical: 11,
                    borderWidth: 1,
                    borderColor: "#161616",
                  }}
                />
              )}

              {field.type === "textarea" && (
                <TextInput
                  value={formValues[field.key] || ""}
                  onChangeText={(v) => updateField(field.key, v)}
                  placeholder={field.placeholder}
                  placeholderTextColor="#2A2A2A"
                  multiline
                  numberOfLines={4}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    backgroundColor: "#0E0E0E",
                    borderRadius: 10,
                    paddingHorizontal: 13,
                    paddingVertical: 11,
                    borderWidth: 1,
                    borderColor: "#161616",
                    minHeight: 90,
                    textAlignVertical: "top",
                  }}
                />
              )}

              {field.type === "toggle" && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#0E0E0E",
                    borderRadius: 10,
                    paddingHorizontal: 13,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: "#161616",
                  }}
                >
                  <Text style={{ color: "#E5E5E5", fontSize: 13 }}>
                    {field.label}
                  </Text>
                  <Switch
                    value={formValues[field.key] ?? field.defaultValue ?? false}
                    onValueChange={(v) => {
                      Haptics.selectionAsync();
                      updateField(field.key, v);
                    }}
                    trackColor={{ false: "#1A1A1A", true: "#FFFFFF30" }}
                    thumbColor={formValues[field.key] ? "#FFFFFF" : "#4B5563"}
                  />
                </View>
              )}

              {field.type === "select" && (
                <SelectField
                  field={field}
                  value={formValues[field.key] || ""}
                  onChange={(v) => updateField(field.key, v)}
                />
              )}

              {field.type === "emoji" && (
                <EmojiField
                  value={formValues[field.key] || ""}
                  onChange={(v) => updateField(field.key, v)}
                />
              )}
            </View>
          ))
        )}

        {/* Log terminal */}
        <LogTerminal logs={logs} />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Run button */}
      <Animated.View
        style={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: paddingAnimation,
          borderTopWidth: 1,
          borderTopColor: "#111111",
          backgroundColor: "#050505",
        }}
      >
        <TouchableOpacity
          onPress={runTask}
          disabled={isRunning}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: getButtonColor(),
            borderRadius: 12,
            paddingVertical: 14,
            gap: 8,
          }}
        >
          {isRunning ? (
            <>
              <Loader size={16} color="#4B5563" />
              <Text
                style={{
                  color: getButtonTextColor(),
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Running...
              </Text>
            </>
          ) : taskStatus === "success" ? (
            <>
              <CheckCircle2 size={16} color="#050505" />
              <Text
                style={{
                  color: getButtonTextColor(),
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Completed — Run Again
              </Text>
            </>
          ) : taskStatus === "error" ? (
            <>
              <XCircle size={16} color="#050505" />
              <Text
                style={{
                  color: getButtonTextColor(),
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Failed — Retry
              </Text>
            </>
          ) : (
            <>
              <Play size={16} color="#050505" />
              <Text
                style={{
                  color: getButtonTextColor(),
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Run Task
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingAnimatedView>
  );
}
