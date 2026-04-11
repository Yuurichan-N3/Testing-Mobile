import { useRef, useEffect } from "react";
import { View, Text, ScrollView, Animated } from "react-native";

export default function LogTerminal({ logs = [] }) {
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (logs.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [logs.length]);

  useEffect(() => {
    if (scrollRef.current && logs.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [logs.length]);

  if (logs.length === 0) return null;

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "process":
        return "#FBBF24";
      case "info":
        return "#60A5FA";
      default:
        return "#4B5563";
    }
  };

  const getPrefix = (type) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "process":
        return "→";
      case "info":
        return "i";
      default:
        return "·";
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        backgroundColor: "#080808",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#131313",
        maxHeight: 240,
        marginTop: 14,
        overflow: "hidden",
      }}
    >
      {/* Terminal header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderBottomWidth: 1,
          borderBottomColor: "#131313",
          gap: 5,
        }}
      >
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: "#EF4444",
          }}
        />
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: "#FBBF24",
          }}
        />
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: "#10B981",
          }}
        />
        <Text
          style={{
            color: "#2A2A2A",
            fontSize: 10,
            marginLeft: 6,
            fontFamily: "monospace",
            letterSpacing: 0.5,
          }}
        >
          output
        </Text>
      </View>

      {/* Log lines */}
      <ScrollView
        ref={scrollRef}
        style={{ padding: 10, maxHeight: 190 }}
        showsVerticalScrollIndicator={false}
      >
        {logs.map((log, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              marginBottom: 1,
              paddingVertical: 1,
            }}
          >
            <Text
              style={{
                color: getColor(log.type),
                fontSize: 10.5,
                fontFamily: "monospace",
                lineHeight: 17,
                width: 14,
                textAlign: "center",
              }}
            >
              {getPrefix(log.type)}
            </Text>
            <Text
              style={{
                color: getColor(log.type),
                fontSize: 10.5,
                fontFamily: "monospace",
                lineHeight: 17,
                flex: 1,
                marginLeft: 6,
                opacity: 0.9,
              }}
            >
              {log.message}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}
