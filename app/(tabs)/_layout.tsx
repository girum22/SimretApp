import { Tabs } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function ScrollableTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();

  // Define background color based on color scheme for distinction
  const tabBarBackgroundColor = colorScheme === 'dark' ? '#2c2c2c' : '#f2f2f2';
  // Use colors from screenOptions for active/inactive states
  const activeColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveColor = colorScheme === 'dark' ? '#888' : '#b0b0b0'; // Adjusted inactive color for dark mode

  return (
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: tabBarBackgroundColor, 
      elevation: 8,
      alignItems: 'center', 
      paddingHorizontal: 0, 
    }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          minWidth: state.routes.length * 90, 
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: isFocused ? 3 : 0,
                borderBottomColor: isFocused ? activeColor : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 80,
              }}
            >
              {options.tabBarIcon
                ? options.tabBarIcon({ color: isFocused ? activeColor : inactiveColor, focused: isFocused, size: 24 })
                : null}
              <Text style={{ 
                color: isFocused ? activeColor : inactiveColor, 
                fontWeight: isFocused ? 'bold' : 'normal', 
                fontSize: 12, 
                textAlign: 'center' 
              }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={props => <ScrollableTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#b0b0b0', // Explicitly set for dark mode
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 58, 
          // Set tab bar background to be consistent with the ScrollableTabBar's view
          backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f2f2f2', 
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Income',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'cash' : 'cash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'card' : 'card-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'pie-chart' : 'pie-chart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'grid' : 'grid-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'trophy' : 'trophy-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
