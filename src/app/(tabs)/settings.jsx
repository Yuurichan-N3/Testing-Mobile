import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Server,
  Key,
  Hash,
  Shield,
  Info,
  ExternalLink,
  Github,
  ChevronRight,
  Check,
  Moon,
  FolderOpen,
} from "lucide-react-native";
import { useSettingsStore } from "@/utils/settingsStore";
import * as Haptics from "expo-haptics";

function SettingsGroup({ title, children }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: "#4B5563",
          fontSize: 11,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 8,
          marginLeft: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: "#0E0E0E",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#161616",
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function SettingsRow({
  icon: Icon,
  iconColor = "#6B7280",
  label,
  value,
  onPress,
  rightElement,
  isLast,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#161616",
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          backgroundColor: iconColor + "12",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Icon size={15} color={iconColor} />
      </View>
      <Text
        style={{ color: "#E5E5E5", fontSize: 14, fontWeight: "500", flex: 1 }}
      >
        {label}
      </Text>
      {rightElement ? (
        rightElement
      ) : value ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ color: "#4B5563", fontSize: 13 }}>{value}</Text>
          {onPress && <ChevronRight size={14} color="#2A2A2A" />}
        </View>
      ) : onPress ? (
        <ChevronRight size={14} color="#2A2A2A" />
      ) : null}
    </TouchableOpacity>
  );
}

function InputRow({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  isLast,
}) {
  return (
    <View
      style={{
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#161616",
      }}
    >
      <Text
        style={{
          color: "#4B5563",
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#2A2A2A"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          color: "#FFFFFF",
          fontSize: 14,
          backgroundColor: "#080808",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: "#161616",
        }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { backendUrl, apiId, apiHash, update, load, isLoaded } =
    useSettingsStore();
  const [localUrl, setLocalUrl] = useState("");
  const [localApiId, setLocalApiId] = useState("");
  const [localApiHash, setLocalApiHash] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setLocalUrl(backendUrl);
      setLocalApiId(apiId);
      setLocalApiHash(apiHash);
    }
  }, [isLoaded, backendUrl, apiId, apiHash]);

  const hasChanges =
    localUrl !== backendUrl || localApiId !== apiId || localApiHash !== apiHash;

  const handleSave = useCallback(async () => {
    await update({
      backendUrl: localUrl.trim(),
      apiId: localApiId.trim(),
      apiHash: localApiHash.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [localUrl, localApiId, localApiHash, update]);

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar style="light" />

      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: "700",
              letterSpacing: -0.6,
            }}
          >
            Settings
          </Text>
          <Text
            style={{
              color: "#4B5563",
              fontSize: 11,
              fontWeight: "500",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Configuration
          </Text>
        </View>

        {hasChanges && (
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "#050505", fontSize: 13, fontWeight: "700" }}>
              Save
            </Text>
          </TouchableOpacity>
        )}

        {saved && (
          <View
            style={{
              backgroundColor: "#10B98120",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 7,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Check size={14} color="#10B981" />
            <Text style={{ color: "#10B981", fontSize: 12, fontWeight: "600" }}>
              Saved
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsGroup title="Backend Server">
          <InputRow
            label="Backend URL"
            value={localUrl}
            onChangeText={setLocalUrl}
            placeholder="http://your-server:5000"
            isLast
          />
        </SettingsGroup>

        <SettingsGroup title="Telegram API Credentials">
          <InputRow
            label="API ID"
            value={localApiId}
            onChangeText={setLocalApiId}
            placeholder="Masukkan API ID dari my.telegram.org"
            keyboardType="number-pad"
          />
          <InputRow
            label="API Hash"
            value={localApiHash}
            onChangeText={setLocalApiHash}
            placeholder="Masukkan API Hash"
            secureTextEntry
            isLast
          />
        </SettingsGroup>

        <SettingsGroup title="Info">
          <SettingsRow
            icon={Info}
            iconColor="#60A5FA"
            label="Version"
            value="1.0.0"
          />
          <SettingsRow
            icon={ExternalLink}
            iconColor="#00E5FF"
            label="Telegram Tools by 佐賀県産"
            isLast
            onPress={() =>
              Alert.alert(
                "Credits",
                "Telegram Tools by YUURI (佐賀県産)\n\nAll 15 automation features built from Python → Mobile",
              )
            }
          />
        </SettingsGroup>

        <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text
            style={{
              color: "#1A1A1A",
              fontSize: 10,
              fontWeight: "500",
              letterSpacing: 1,
            }}
          >
            YUURI TOOLS · v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
