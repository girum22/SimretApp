import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSimret } from '@/context/SimretContext';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function ReportScreen() {
  const { incomeSources, expenses, goals, budgets, categories } = useSimret();

  // Calculate totals
  const totalIncome = incomeSources.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + (g.savedAmount || 0), 0);

  // Category breakdown
  const categoryTotals = categories.map(cat => {
    const spent = expenses.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0);
    return { ...cat, spent };
  }).filter(c => c.spent > 0);

  // Budget vs actuals
  const budgetRows = budgets.map(b => {
    const cat = categories.find(c => c.id === b.categoryId);
    const spent = expenses.filter(e => e.categoryId === b.categoryId).reduce((sum, e) => sum + e.amount, 0);
    return { ...b, category: cat?.name || 'Category', spent };
  });

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Reports & Analytics</ThemedText>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <ThemedText type="defaultSemiBold">Total Income</ThemedText>
          <ThemedText type="title" style={{ color: '#2ecc40' }}>{totalIncome.toLocaleString()} ETB</ThemedText>
        </View>
        <View style={styles.summaryCard}>
          <ThemedText type="defaultSemiBold">Total Expenses</ThemedText>
          <ThemedText type="title" style={{ color: '#ff5a36' }}>{totalExpenses.toLocaleString()} ETB</ThemedText>
        </View>
        <View style={styles.summaryCard}>
          <ThemedText type="defaultSemiBold">Total Saved</ThemedText>
          <ThemedText type="title" style={{ color: '#6c8cff' }}>{totalSaved.toLocaleString()} ETB</ThemedText>
        </View>
      </View>
      <ThemedText type="defaultSemiBold" style={{ marginTop: 24, marginBottom: 8 }}>Spending by Category</ThemedText>
      {categoryTotals.length === 0 ? (
        <ThemedText style={{ color: '#888', marginBottom: 12 }}>No expenses yet.</ThemedText>
      ) : (
        <FlatList
          data={categoryTotals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ThemedText style={{ flex: 1 }}>{item.name}</ThemedText>
              <ThemedText style={{ color: '#ff5a36' }}>{item.spent.toLocaleString()} ETB</ThemedText>
            </View>
          )}
        />
      )}
      <ThemedText type="defaultSemiBold" style={{ marginTop: 24, marginBottom: 8 }}>Budget vs Actual</ThemedText>
      {budgetRows.length === 0 ? (
        <ThemedText style={{ color: '#888', marginBottom: 12 }}>No budgets yet.</ThemedText>
      ) : (
        <FlatList
          data={budgetRows}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const remaining = item.amount - item.spent;
            let color = '#2ecc40';
            if (remaining < 0) color = '#ff5a36';
            else if (remaining < item.amount * 0.3) color = '#ffb300';
            return (
              <View style={styles.row}>
                <ThemedText style={{ flex: 1 }}>{item.category}</ThemedText>
                <ThemedText style={{ flex: 1 }}>{item.amount.toLocaleString()} ETB</ThemedText>
                <ThemedText style={{ flex: 1, color: '#ff5a36' }}>{item.spent.toLocaleString()} ETB</ThemedText>
                <ThemedText style={{ flex: 1, color }}>{remaining.toLocaleString()} ETB</ThemedText>
              </View>
            );
          }}
          ListHeaderComponent={() => (
            <View style={styles.row}>
              <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Category</ThemedText>
              <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Budget</ThemedText>
              <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Spent</ThemedText>
              <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Remaining</ThemedText>
            </View>
          )}
        />
      )}
      {/* Chart placeholders: You can add react-native-chart-kit or similar for real charts */}
      <ThemedText style={{ color: '#888', marginTop: 32, textAlign: 'center' }}>
        (Charts coming soon: Pie, Bar, Line, etc.)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
});
