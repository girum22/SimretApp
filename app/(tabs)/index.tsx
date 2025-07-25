import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSimret } from '@/context/SimretContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [showOverall, setShowOverall] = useState(false);
  const router = useRouter();
  const { incomeSources, expenses, budgets, goals } = useSimret();

  const overallBalance = incomeSources.reduce((sum, src) => sum + src.amount, 0) - expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => {
    const startDate = new Date(budget.startDate);
    const endDate = budget.endDate ? new Date(budget.endDate) : null;
    const now = new Date();

    // Skip expired budgets
    if (endDate && now > endDate) {
      return sum;
    }

    // Skip yearly budgets as requested
    if (budget.period === 'yearly') {
      return sum;
    }

    let budgetedAmount = budget.amount;

    // Adjust for weekly budgets to a monthly equivalent
    if (budget.period === 'weekly') {
      // Using 52 weeks / 12 months for a more accurate monthly average
      budgetedAmount = budget.amount * (52 / 12);
    }
    // Monthly budgets are used as is

    return sum + budgetedAmount;
  }, 0);
  const totalGoalsTarget = goals.reduce((sum, goal) => {
    return sum + (goal.targetAmount || 0);
  }, 0);
  
  const availableBalance = overallBalance - totalBudget - totalGoalsTarget;
  // Show up to 3 most recent expenses
  const recentExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      {/* Balance Display */}
      <View style={styles.balanceRow}>
        <ThemedText type="title" style={{ fontSize: 28 }}>
          {showOverall ? 'Overall Balance' : 'Available Balance'}:
        </ThemedText>
        <Pressable onPress={() => setShowOverall(v => !v)} style={{ marginLeft: 10 }}>
          <Ionicons name={showOverall ? 'eye-off' : 'eye'} size={28} color="#888" />
        </Pressable>
      </View>
      <ThemedText type="title" style={{ fontSize: 32, marginBottom: 18 }}>
        {showOverall ? overallBalance.toLocaleString() : availableBalance.toLocaleString()} ETB
      </ThemedText>

      {/* Goals Overview */}
      <ThemedText type="subtitle" style={{ marginBottom: 8 }}>Goals Overview</ThemedText>
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
        renderItem={({ item }) => {
          const percent = Math.round(((item.savedAmount || 0) / item.targetAmount) * 100);
          let color = '#6c8cff'; // Neutral
          if (percent >= 70) color = '#2ecc40'; // Green
          else if (percent >= 11) color = '#ffb300'; // Amber
          return (
            <View style={[styles.goalCard, { borderColor: color }]}> 
              <View style={styles.circleWrap}>
                <View style={[styles.circle, { borderColor: color }]}> 
                  <ThemedText style={{ color, fontWeight: 'bold', fontSize: 18 }}>{percent}%</ThemedText>
                </View>
              </View>
              <ThemedText type="defaultSemiBold" style={{ marginTop: 6, color: '#888', textAlign: 'center', flexWrap: 'wrap', maxWidth: 150 }}>{item.name}</ThemedText>
              <ThemedText style={{ fontSize: 12, color: '#888' }}>{(item.savedAmount || 0).toLocaleString()} / {item.targetAmount.toLocaleString()} ETB</ThemedText>
            </View>
          );
        }}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 16 }}>No goals yet.</ThemedText>}
      />

      {/* Recent Expenses */}
      <ThemedText type="subtitle" style={{ marginBottom: 8 }}>Recent Expenses</ThemedText>
      <FlatList
        data={recentExpenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseRow}>
            <ThemedText style={{ flex: 2 }}>{item.description || 'Expense'}</ThemedText>
            <ThemedText style={{ flex: 1, textAlign: 'right' }}>{item.amount.toLocaleString()} ETB</ThemedText>
            <ThemedText style={{ flex: 1, textAlign: 'right', color: '#888' }}>{item.date}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 16 }}>No recent expenses.</ThemedText>}
        style={{ marginBottom: 18 }}
      />

      {/* Quick Add Buttons */}
      <View style={styles.quickAddRow}>
        <Pressable style={[styles.quickAddBtn, { backgroundColor: '#6c8cff' }]} onPress={() => router.push('/(tabs)/goals')}>
          <ThemedText style={{ color: '#fff' }}>+ Add to Goal</ThemedText>
        </Pressable>
        <Pressable style={[styles.quickAddBtn, { backgroundColor: '#ff5a36' }]} onPress={() => router.push('/(tabs)/expenses')}>
          <ThemedText style={{ color: '#fff' }}>+ Add Expense</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginRight: 14,
    alignItems: 'center',
    minWidth: 140,
    backgroundColor: '#f8faff',
    maxHeight: 160,
  },
  circleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  expenseRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  quickAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 12,
  },
  quickAddBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
});
