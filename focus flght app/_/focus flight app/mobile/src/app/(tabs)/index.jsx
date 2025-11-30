import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PlaneTakeoff,
  Clock,
  Zap,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <View
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#E5E9F0",
      padding: 20,
      flex: 1,
      marginHorizontal: 6,
    }}
  >
    <View
      style={{
        width: 48,
        height: 48,
        backgroundColor: `${color}15`,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      <Icon size={24} color={color} />
    </View>
    <Text
      style={{
        fontFamily: "Poppins_600SemiBold",
        fontSize: 24,
        color: "#262F40",
        marginBottom: 4,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontFamily: "Poppins_400Regular",
        fontSize: 13,
        color: "#9AA3B1",
      }}
    >
      {label}
    </Text>
  </View>
);

const RecentFlightCard = ({
  departure,
  destination,
  duration,
  category,
  date,
}) => (
  <View
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E5E9F0",
      padding: 16,
      marginBottom: 12,
    }}
  >
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#007BFF15",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <PlaneTakeoff size={20} color="#007BFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: "#262F40",
          }}
        >
          {departure} → {destination}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            color: "#9AA3B1",
          }}
        >
          {category}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: "#007BFF",
          }}
        >
          {duration} min
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            color: "#9AA3B1",
          }}
        >
          {date}
        </Text>
      </View>
    </View>
  </View>
);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [stats, setStats] = useState({
    todayMinutes: 0,
    weekMinutes: 0,
    monthMinutes: 0,
    totalFlights: 0,
    streak: 0,
  });
  const [recentFlights, setRecentFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadStats();
    loadRecentFlights();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/focus/stats");
      if (!response.ok) throw new Error("Failed to load stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentFlights = async () => {
    try {
      const response = await fetch(
        "/api/focus/sessions?limit=3&status=completed",
      );
      if (!response.ok) throw new Error("Failed to load recent flights");
      const data = await response.json();
      setRecentFlights(data.sessions || []);
    } catch (error) {
      console.error("Error loading recent flights:", error);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0F1117" }}>
      <StatusBar style="light" />

      <View style={{ paddingTop: insets.top, paddingHorizontal: 20 }}>
        {/* Header */}
        <View style={{ paddingTop: 16, paddingBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#D8DDE6",
              marginBottom: 4,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 32,
              color: "#FFFFFF",
              lineHeight: 38,
            }}
          >
            Ready to Focus?
          </Text>
        </View>

        {/* Quick Action Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/book-flight")}
          style={{
            backgroundColor: "#007BFF",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            shadowColor: "#007BFF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <PlaneTakeoff size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#FFFFFF",
            }}
          >
            Book a Flight
          </Text>
        </TouchableOpacity>

        {/* Today's Progress */}
        <View
          style={{
            backgroundColor: "#171B23",
            borderWidth: 1,
            borderColor: "#232832",
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
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
              <Zap size={20} color="#007BFF" />
            </View>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: "#FFFFFF",
              }}
            >
              Today's Focus Time
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 48,
              color: "#FFFFFF",
              marginBottom: 8,
            }}
          >
            {stats.todayMinutes}
            <Text style={{ fontSize: 24, color: "#9AA3B1" }}> min</Text>
          </Text>

          {stats.streak > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: "#9AA3B1",
                }}
              >
                🔥 {stats.streak} day streak
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* White Content Container */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          marginTop: -16,
          paddingTop: 32,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            {/* Quick Stats Row */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 24,
                marginHorizontal: -6,
              }}
            >
              <StatCard
                icon={Calendar}
                label="This Week"
                value={`${stats.weekMinutes}m`}
                color="#8B5CF6"
              />
              <StatCard
                icon={TrendingUp}
                label="This Month"
                value={`${stats.monthMinutes}m`}
                color="#10B981"
              />
            </View>

            {/* Recent Flights */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 20,
                    color: "#262F40",
                  }}
                >
                  Recent Flights
                </Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/stats")}>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: "#007BFF",
                    }}
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              {recentFlights.length === 0 ? (
                <View
                  style={{
                    backgroundColor: "#F8F9FA",
                    borderRadius: 12,
                    padding: 32,
                    alignItems: "center",
                  }}
                >
                  <Target
                    size={48}
                    color="#9AA3B1"
                    style={{ marginBottom: 12 }}
                  />
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 16,
                      color: "#262F40",
                      marginBottom: 8,
                    }}
                  >
                    No flights yet
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
                      color: "#9AA3B1",
                      textAlign: "center",
                    }}
                  >
                    Book your first flight to start your focus journey
                  </Text>
                </View>
              ) : (
                recentFlights.map((flight, index) => (
                  <RecentFlightCard
                    key={index}
                    departure={flight.departure_code}
                    destination={flight.destination_code}
                    duration={flight.actual_duration || flight.planned_duration}
                    category={flight.category_name}
                    date={new Date(flight.completed_at).toLocaleDateString()}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
