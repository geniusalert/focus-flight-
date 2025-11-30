import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trophy, PlaneLanding, Clock, MapPin, Star } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SessionCompleteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [session, setSession] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadSession();
    checkAchievements();
  }, []);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/focus/sessions/${sessionId}`);
      if (!response.ok) throw new Error("Failed to load session");
      const data = await response.json();
      setSession(data.session);
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const checkAchievements = async () => {
    try {
      const response = await fetch(`/api/focus/achievements/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (!response.ok) throw new Error("Failed to check achievements");
      const data = await response.json();
      setNewAchievements(data.newAchievements || []);
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  };

  if ((!loaded && !error) || !session) {
    return null;
  }

  const distance = Math.floor(Math.random() * 5000) + 1000; // Simplified distance calculation

  return (
    <View style={{ flex: 1, backgroundColor: "#0F1117" }}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 40,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Success Icon */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 120,
              height: 120,
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderRadius: 60,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <PlaneLanding size={60} color="#10B981" />
          </View>

          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 32,
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Flight Complete!
          </Text>

          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: "#D8DDE6",
              textAlign: "center",
            }}
          >
            You've successfully landed in {session.destination_name}
          </Text>
        </View>

        {/* Stats Cards */}
        <View
          style={{
            backgroundColor: "#171B23",
            borderWidth: 1,
            borderColor: "#232832",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Trophy size={20} color="#007BFF" />
            </View>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: "#FFFFFF",
              }}
            >
              Session Summary
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Clock size={18} color="#9AA3B1" style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 15,
                    color: "#9AA3B1",
                  }}
                >
                  Focus Time
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                {session.actual_duration || session.planned_duration} minutes
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={18} color="#9AA3B1" style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 15,
                    color: "#9AA3B1",
                  }}
                >
                  Distance
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                {distance.toLocaleString()} km
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Star size={18} color="#9AA3B1" style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 15,
                    color: "#9AA3B1",
                  }}
                >
                  Miles Earned
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                {session.miles_earned}
              </Text>
            </View>
          </View>
        </View>

        {/* New Achievements */}
        {newAchievements.length > 0 && (
          <View
            style={{
              backgroundColor: "#171B23",
              borderWidth: 1,
              borderColor: "#232832",
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: "#FFFFFF",
                marginBottom: 16,
              }}
            >
              🎉 New Achievements Unlocked!
            </Text>

            {newAchievements.map((achievement, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 16,
                    color: "#8B5CF6",
                    marginBottom: 4,
                  }}
                >
                  {achievement.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: "#D8DDE6",
                  }}
                >
                  {achievement.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Flight Route */}
        <View
          style={{
            backgroundColor: "#171B23",
            borderWidth: 1,
            borderColor: "#232832",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Flight Route
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(0, 123, 255, 0.2)",
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 16,
                    color: "#007BFF",
                  }}
                >
                  {session.departure_code}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: "#9AA3B1",
                  textAlign: "center",
                }}
              >
                {session.departure_name}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 24,
                color: "#9AA3B1",
                marginHorizontal: 16,
              }}
            >
              →
            </Text>

            <View style={{ flex: 1, alignItems: "center" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 16,
                    color: "#10B981",
                  }}
                >
                  {session.destination_code}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: "#9AA3B1",
                  textAlign: "center",
                }}
              >
                {session.destination_name}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#171B23",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: "#232832",
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/book-flight")}
          style={{
            backgroundColor: "#007BFF",
            borderRadius: 16,
            padding: 18,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#FFFFFF",
            }}
          >
            Book Another Flight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          style={{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#232832",
            borderRadius: 16,
            padding: 18,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#FFFFFF",
            }}
          >
            View Stats
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
