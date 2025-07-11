import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSimret } from '@/context/SimretContext';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function ExpenseScreen() {
  const { expenses, setExpenses, categories } = useSimret();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const addExpense = () => {
    if (!amount) return;
    setExpenses([
      ...expenses,
      {
        id: generateId(),
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        categoryId,
        description,
      },
    ]);
    setAmount('');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setModalVisible(false);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Total Expenses: {totalExpenses.toLocaleString()}</ThemedText>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <ThemedText type="defaultSemiBold" style={styles.headerCell}>Description</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.headerCell}>Amount</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.headerCell}>Date</ThemedText>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <ThemedText style={styles.cell}>{item.description || 'Expense'}</ThemedText>
            <ThemedText style={styles.cell}>{item.amount.toLocaleString()}</ThemedText>
            <ThemedText style={styles.cell}>{item.date.split('T')[0]}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 32 }}>No expenses yet.</ThemedText>}
      />
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>+ Add Expense</ThemedText>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>Add Expense</ThemedText>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.pickerRow}>
              <ThemedText style={{ marginRight: 8 }}>Category:</ThemedText>
              <Picker
                selectedValue={categoryId}
                onValueChange={setCategoryId}
                style={{ flex: 1 }}
              >
                {categories.map(cat => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Picker>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <Pressable onPress={() => setModalVisible(false)}>
                <ThemedText style={{ color: '#888' }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={addExpense}>
                <ThemedText style={{ color: '#007AFF' }}>Add</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 6,
    marginBottom: 6,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  cell: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#ff5a36',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '90%',
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    fontSize: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
});
