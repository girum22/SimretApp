import { Tabs } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function ScrollableTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#fff', elevation: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderBottomWidth: isFocused ? 3 : 0,
                borderBottomColor: isFocused ? '#6c8cff' : 'transparent',
                alignItems: 'center',
              }}
            >
              {options.tabBarIcon
                ? options.tabBarIcon({ color: isFocused ? '#6c8cff' : '#888', focused: isFocused, size: 28 })
                : null}
              <Text style={{ color: isFocused ? '#6c8cff' : '#888', fontWeight: isFocused ? 'bold' : 'normal', fontSize: 13 }}>
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
        tabBarInactiveTintColor: '#b0b0b0',
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 68,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'house.fill' : 'house'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Income',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'dollarsign.circle.fill' : 'dollarsign.circle'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'creditcard.fill' : 'creditcard'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'chart.pie.fill' : 'chart.pie'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'square.grid.2x2.fill' : 'square.grid.2x2'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'target' : 'scope'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'chart.bar.fill' : 'chart.bar'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
