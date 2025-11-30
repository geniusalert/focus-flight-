import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trophy, Target, Flame, Award } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: active ? "#007BFF" : "transparent",
      borderRadius: 20,
      marginRight: 12,
    }}
  >
    <Text
      style={{
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: active ? "#FFFFFF" : "#9AA3B1",
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const CategoryBreakdown = ({ name, minutes, color, total }) => {
  const percentage = total > 0 ? (minutes / total) * 100 : 0;

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: color,
              borderRadius: 6,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: "#262F40",
            }}
          >
            {name}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 14,
            color: "#262F40",
          }}
        >
          {minutes} min
        </Text>
      </View>

      <View
        style={{
          height: 8,
          backgroundColor: "#F1F4F6",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};

const AchievementCard = ({ name, description, icon, earned, earnedDate }) => (
  <View
    style={{
      backgroundColor: earned ? "#FFFFFF" : "#F8F9FA",
      borderWidth: 1,
      borderColor: earned ? "#E5E9F0" : "#E5E9F0",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      opacity: earned ? 1 : 0.6,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 48,
          height: 48,
          backgroundColor: earned ? "#007BFF15" : "#F1F4F6",
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 24 }}>{earned ? "🏆" : "🔒"}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: "#262F40",
            marginBottom: 4,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            color: "#9AA3B1",
          }}
        >
          {earned && earnedDate
            ? `Earned ${new Date(earnedDate).toLocaleDateString()}`
            : description}
        </Text>
      </View>
    </View>
  </View>
);

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("daily");
  const [stats, setStats] = useState({
    todayMinutes: 0,
    weekMinutes: 0,
    monthMinutes: 0,
    streak: 0,
    totalFlights: 0,
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadStats();
    loadCategoryBreakdown();
    loadAchievements();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/focus/stats");
      if (!response.ok) throw new Error("Failed to load stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadCategoryBreakdown = async () => {
    try {
      const period =
        activeTab === "daily"
          ? "day"
          : activeTab === "weekly"
            ? "week"
            : "month";
      const response = await fetch(
        `/api/focus/stats/categories?period=${period}`,
      );
      if (!response.ok) throw new Error("Failed to load category breakdown");
      const data = await response.json();
      setCategoryBreakdown(data.breakdown || []);
    } catch (error) {
      console.error("Error loading category breakdown:", error);
    }
  };

  const loadAchievements = async () => {
    try {
      const [achievementsRes, userAchievementsRes] = await Promise.all([
        fetch("/api/focus/achievements"),
        fetch("/api/focus/achievements/user"),
      ]);

      if (!achievementsRes.ok || !userAchievementsRes.ok) {
        throw new Error("Failed to load achievements");
      }

      const achievementsData = await achievementsRes.json();
      const userAchievementsData = await userAchievementsRes.json();

      setAchievements(achievementsData.achievements || []);
      setUserAchievements(userAchievementsData.achievements || []);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  const currentMinutes =
    activeTab === "daily"
      ? stats.todayMinutes
      : activeTab === "weekly"
        ? stats.weekMinutes
        : stats.monthMinutes;

  const totalCategoryMinutes = categoryBreakdown.reduce(
    (sum, cat) => sum + cat.minutes,
    0,
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0F1117" }}>
      <StatusBar style="light" />

      <View style={{ paddingTop: insets.top, paddingHorizontal: 20 }}>
        <View style={{ paddingTop: 16, paddingBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 32,
              color: "#FFFFFF",
              lineHeight: 38,
            }}
          >
            Your Stats
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: "#D8DDE6",
              marginTop: 8,
            }}
          >
            Track your focus journey
          </Text>
        </View>

        {/* Key Metrics */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#171B23",
              borderWidth: 1,
              borderColor: "#232832",
              borderRadius: 16,
              padding: 20,
              flex: 1,
              marginRight: 12,
            }}
          >
            <Flame size={24} color="#F59E0B" style={{ marginBottom: 12 }} />
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 28,
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              {stats.streak}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                color: "#9AA3B1",
              }}
            >
              Day Streak
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#171B23",
              borderWidth: 1,
              borderColor: "#232832",
              borderRadius: 16,
              padding: 20,
              flex: 1,
            }}
          >
            <Target size={24} color="#8B5CF6" style={{ marginBottom: 12 }} />
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 28,
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              {stats.totalFlights}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                color: "#9AA3B1",
              }}
            >
              Total Flights
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingTop: 24,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            {/* Period Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 24 }}
            >
              <TabButton
                title="Daily"
                active={activeTab === "daily"}
                onPress={() => setActiveTab("daily")}
              />
              <TabButton
                title="Weekly"
                active={activeTab === "weekly"}
                onPress={() => setActiveTab("weekly")}
              />
              <TabButton
                title="Monthly"
                active={activeTab === "monthly"}
                onPress={() => setActiveTab("monthly")}
              />
            </ScrollView>

            {/* Total Focus Time */}
            <View
              style={{
                backgroundColor: "#007BFF15",
                borderRadius: 16,
                padding: 24,
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: "#007BFF",
                  marginBottom: 8,
                }}
              >
                Total Focus Time
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 48,
                  color: "#007BFF",
                }}
              >
                {currentMinutes}
                <Text style={{ fontSize: 24 }}> min</Text>
              </Text>
            </View>

            {/* Category Breakdown */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: "#262F40",
                  marginBottom: 16,
                }}
              >
                Category Breakdown
              </Text>

              {categoryBreakdown.length === 0 ? (
                <View
                  style={{
                    backgroundColor: "#F8F9FA",
                    borderRadius: 12,
                    padding: 24,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
                      color: "#9AA3B1",
                    }}
                  >
                    No focus sessions yet
                  </Text>
                </View>
              ) : (
                categoryBreakdown.map((cat, index) => (
                  <CategoryBreakdown
                    key={index}
                    name={cat.name}
                    minutes={cat.minutes}
                    color={cat.color}
                    total={totalCategoryMinutes}
                  />
                ))
              )}
            </View>

            {/* Achievements */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Award size={24} color="#F59E0B" style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 20,
                    color: "#262F40",
                  }}
                >
                  Achievements
                </Text>
              </View>

              {achievements.map((achievement) => {
                const earned = userAchievements.find(
                  (ua) => ua.achievement_id === achievement.id,
                );
                return (
                  <AchievementCard
                    key={achievement.id}
                    name={achievement.name}
                    description={achievement.description}
                    icon={achievement.icon}
                    earned={!!earned}
                    earnedDate={earned?.earned_at}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
