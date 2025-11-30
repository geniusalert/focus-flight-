import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plane, Pause, Play, X, Volume2, VolumeX } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter, useLocalSearchParams } from "expo-router";
import usePreventBack from "@/utils/usePreventBack";
import Svg, { Path, Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function FlightProgressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [session, setSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const intervalRef = useRef(null);

  usePreventBack();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (session && !paused) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [session, paused]);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/focus/sessions/${sessionId}`);
      if (!response.ok) throw new Error("Failed to load session");
      const data = await response.json();
      setSession(data.session);

      // Start the session
      await fetch(`/api/focus/sessions/${sessionId}/start`, { method: "POST" });
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const newElapsed = prev + 1;
        if (session && newElapsed >= session.planned_duration * 60) {
          completeSession();
          return prev;
        }
        return newElapsed;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const completeSession = async () => {
    stopTimer();
    try {
      await fetch(`/api/focus/sessions/${sessionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actual_duration: Math.floor(elapsed / 60) }),
      });
      router.replace(`/(tabs)/session-complete/${sessionId}`);
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  const giveUp = async () => {
    stopTimer();
    try {
      await fetch(`/api/focus/sessions/${sessionId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actual_duration: Math.floor(elapsed / 60) }),
      });
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error canceling session:", error);
    }
  };

  if ((!loaded && !error) || !session) {
    return null;
  }

  const progress = Math.min(
    (elapsed / (session.planned_duration * 60)) * 100,
    100,
  );
  const remainingSeconds = Math.max(session.planned_duration * 60 - elapsed, 0);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsDisplay = remainingSeconds % 60;

  // Calculate airplane position on the curve
  const startX = 50;
  const startY = height * 0.5;
  const endX = width - 50;
  const endY = height * 0.5;
  const controlY = height * 0.3;

  const t = progress / 100;
  const planeX =
    Math.pow(1 - t, 2) * startX +
    2 * (1 - t) * t * (width / 2) +
    Math.pow(t, 2) * endX;
  const planeY =
    Math.pow(1 - t, 2) * startY +
    2 * (1 - t) * t * controlY +
    Math.pow(t, 2) * endY;

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0E27" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 20,
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
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: "#FFFFFF",
              }}
            >
              {session.departure_code} → {session.destination_code}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: "#9AA3B1",
                marginTop: 4,
              }}
            >
              {session.category_name}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setSoundEnabled(!soundEnabled)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {soundEnabled ? (
              <Volume2 size={20} color="#FFFFFF" />
            ) : (
              <VolumeX size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View
          style={{
            height: 8,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#007BFF",
              borderRadius: 4,
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 12,
            color: "#9AA3B1",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {Math.round(progress)}% Complete
        </Text>
      </View>

      {/* Flight Visualization */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Svg width={width} height={height * 0.6}>
          {/* Flight path */}
          <Path
            d={`M ${startX} ${startY} Q ${width / 2} ${controlY} ${endX} ${endY}`}
            stroke="rgba(0, 123, 255, 0.3)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10, 5"
          />

          {/* Departure point */}
          <Circle cx={startX} cy={startY} r="8" fill="#007BFF" />

          {/* Destination point */}
          <Circle cx={endX} cy={endY} r="8" fill="#10B981" />

          {/* Airplane */}
          <Circle cx={planeX} cy={planeY} r="20" fill="#007BFF" opacity="0.2" />
          <Circle cx={planeX} cy={planeY} r="12" fill="#007BFF" />
        </Svg>

        {/* City labels */}
        <View
          style={{
            position: "absolute",
            left: 30,
            top: height * 0.5 + 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            {session.departure_code}
          </Text>
        </View>

        <View
          style={{
            position: "absolute",
            right: 30,
            top: height * 0.5 + 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            {session.destination_code}
          </Text>
        </View>
      </View>

      {/* Time Remaining */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            color: "#9AA3B1",
            marginBottom: 8,
          }}
        >
          Time Remaining
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 48,
            color: "#FFFFFF",
          }}
        >
          {String(remainingMinutes).padStart(2, "0")}:
          {String(remainingSecondsDisplay).padStart(2, "0")}
        </Text>
      </View>

      {/* Controls */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={togglePause}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "#007BFF",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 12,
          }}
        >
          {paused ? (
            <Play size={32} color="#FFFFFF" />
          ) : (
            <Pause size={32} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onLongPress={giveUp}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderWidth: 2,
            borderColor: "#EF4444",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 12,
          }}
        >
          <X size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 12,
          color: "#9AA3B1",
          textAlign: "center",
          paddingBottom: insets.bottom + 8,
        }}
      >
        Hold the ✕ button to give up
      </Text>
    </View>
  );
}
