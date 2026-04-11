import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Plus,
  User,
  Crown,
  Phone,
  AtSign,
  Shield,
  ChevronRight,
  Trash2,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@/utils/settingsStore";

const MOCK_SESSIONS = [
  {
    id: "1",
    name: "yuurisan",
    phone: "+628123456xxxx",
    username: "@yuurisan",
    firstName: "Yuuri",
    lastName: "San",
    premium: true,
    active: true,
    has2FA: true,
  },
  {
    id: "2",
    name: "account2",
    phone: "+628987654xxxx",
    username: null,
    firstName: "Account",
    lastName: "Two",
    premium: false,
    active: true,
    has2FA: false,
  },
  {
    id: "3",
    name: "backup_acc",
    phone: "+621122334xxxx",
    username: "@backup_acc",
    firstName: "Backup",
    lastName: "",
    premium: false,
    active: false,
    has2FA: false,
  },
];

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [refreshing, setRefreshing] = useState(false);
  const backendUrl = useSettingsStore((s) => s.backendUrl);
  const isConfigured = !!backendUrl;

  const activeCount = sessions.filter((s) => s.active).length;

  const handleCreateSession = useCallback(() => {
    router.push("/feature/create-session");
  }, [router]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isConfigured) {
      try {
        const response = await fetch("/api/telegram/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: "/sessions/list",
            method: "POST",
            payload: {},
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.sessions) {
            setSessions(data.sessions);
          }
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    }

    setRefreshing(false);
  }, [isConfigured]);

  const handleDelete = useCallback((session) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Session", `Hapus session "${session.name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          setSessions((prev) => prev.filter((s) => s.id !== session.id));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar style="light" />

      {/* Header */}
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
          <View>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "700",
                letterSpacing: -0.6,
              }}
            >
              Sessions
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
              {activeCount} active · {sessions.length} total
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCreateSession}
            activeOpacity={0.7}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={18} color="#050505" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4B5563"
          />
        }
      >
        {sessions.map((session) => (
          <TouchableOpacity
            key={session.id}
            activeOpacity={0.7}
            onLongPress={() => handleDelete(session)}
            style={{
              backgroundColor: "#0E0E0E",
              borderRadius: 12,
              padding: 14,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#161616",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Avatar */}
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: session.active ? "#FFFFFF08" : "#EF444408",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <User
                  size={20}
                  color={session.active ? "#E5E5E5" : "#EF4444"}
                />
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <Text
                    style={{
                      color: "#F0F0F0",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    {session.name}
                  </Text>
                  {session.premium && (
                    <View
                      style={{
                        backgroundColor: "#FBBF2415",
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Crown size={9} color="#FBBF24" />
                    </View>
                  )}
                  {session.has2FA && (
                    <View
                      style={{
                        backgroundColor: "#10B98115",
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Shield size={9} color="#10B981" />
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Phone size={9} color="#4B5563" />
                    <Text style={{ color: "#4B5563", fontSize: 11 }}>
                      {session.phone}
                    </Text>
                  </View>
                  {session.username && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <AtSign size={9} color="#4B5563" />
                      <Text style={{ color: "#4B5563", fontSize: 11 }}>
                        {session.username.replace("@", "")}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Status indicator */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: session.active ? "#10B981" : "#EF4444",
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add session button */}
        <TouchableOpacity
          onPress={handleCreateSession}
          activeOpacity={0.7}
          style={{
            borderWidth: 1,
            borderColor: "#161616",
            borderStyle: "dashed",
            borderRadius: 12,
            padding: 18,
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 4,
          }}
        >
          <Plus size={20} color="#2A2A2A" />
          <Text style={{ color: "#2A2A2A", fontSize: 12, fontWeight: "500" }}>
            Add New Session
          </Text>
        </TouchableOpacity>

        {/* Hint */}
        <Text
          style={{
            color: "#1A1A1A",
            fontSize: 10,
            textAlign: "center",
            marginTop: 16,
            letterSpacing: 0.3,
          }}
        >
          Long press to delete · Pull to refresh
        </Text>
      </ScrollView>
    </View>
  );
}
