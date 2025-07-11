import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSimret } from '@/context/SimretContext';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function BudgetScreen() {
  const { budgets, setBudgets, categories, expenses } = useSimret();
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  const openAdd = () => {
    setEditId(null);
    setAmount('');
    setCategoryId(categories[0]?.id || '');
    setPeriod('monthly');
    setModalVisible(true);
  };
  const openEdit = (id: string) => {
    const b = budgets.find(b => b.id === id);
    if (b) {
      setEditId(id);
      setAmount(b.amount.toString());
      setCategoryId(b.categoryId);
      setPeriod(b.period);
      setModalVisible(true);
    }
  };
  const saveBudget = () => {
    if (!amount || !categoryId) return;
    if (editId) {
      setBudgets(budgets.map(b => b.id === editId ? { ...b, amount: parseFloat(amount), categoryId, period } : b));
    } else {
      setBudgets([...budgets, { id: generateId(), amount: parseFloat(amount), categoryId, period, startDate: new Date().toISOString() }]);
    }
    setModalVisible(false);
    setAmount('');
    setCategoryId(categories[0]?.id || '');
    setEditId(null);
    setPeriod('monthly');
  };
  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  // Helper: get spent for a category
  const getSpent = (catId: string) => expenses.filter(e => e.categoryId === catId).reduce((sum, e) => sum + e.amount, 0);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Budgets</ThemedText>
      <FlatList
        data={budgets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const cat = categories.find(c => c.id === item.categoryId);
          const spent = getSpent(item.categoryId);
          const remaining = item.amount - spent;
          let color = '#6c8cff';
          if (remaining < 0) color = '#ff5a36'; // Over budget
          else if (remaining < item.amount * 0.3) color = '#ffb300'; // Near limit
          else color = '#2ecc40'; // Safe
          return (
            <View style={styles.row}>
              <ThemedText style={{ flex: 1 }}>{cat?.name || 'Category'}</ThemedText>
              <ThemedText style={{ flex: 1 }}>{item.amount.toLocaleString()} ETB</ThemedText>
              <ThemedText style={{ flex: 1, color }}>{spent.toLocaleString()} ETB</ThemedText>
              <ThemedText style={{ flex: 1, color }}>{remaining.toLocaleString()} ETB</ThemedText>
              <Pressable onPress={() => openEdit(item.id)} style={styles.editBtn}>
                <ThemedText style={{ color: '#007AFF' }}>Edit</ThemedText>
              </Pressable>
              <Pressable onPress={() => deleteBudget(item.id)} style={styles.deleteBtn}>
                <ThemedText style={{ color: '#ff5a36' }}>Delete</ThemedText>
              </Pressable>
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <View style={styles.row}>
            <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Category</ThemedText>
            <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Budget</ThemedText>
            <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Spent</ThemedText>
            <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Remaining</ThemedText>
            <View style={{ width: 60 }} />
            <View style={{ width: 60 }} />
          </View>
        )}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 32 }}>No budgets yet.</ThemedText>}
      />
      <Pressable style={styles.addButton} onPress={openAdd}>
        <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>+ Add Budget</ThemedText>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>{editId ? 'Edit' : 'Add'} Budget</ThemedText>
            <View style={styles.pickerRow}>
              <ThemedText style={{ marginRight: 8 }}>Category:</ThemedText>
              <View style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, overflow: 'hidden' }}>
                <Picker
                  selectedValue={categoryId}
                  onValueChange={setCategoryId}
                  style={{ width: '100%' }}
                  dropdownIconColor="#007AFF"
                >
                  {categories.map(cat => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                  ))}
                </Picker>
              </View>
            </View>
            <TextInput
              placeholder="Budget Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.pickerRow}>
              <ThemedText style={{ marginRight: 8 }}>Period:</ThemedText>
              <View style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, overflow: 'hidden' }}>
                <Picker
                  selectedValue={period}
                  onValueChange={itemValue => setPeriod(itemValue as 'monthly' | 'weekly' | 'yearly')}
                  style={{ width: '100%' }}
                  dropdownIconColor="#007AFF"
                >
                  <Picker.Item label="Monthly" value="monthly" />
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Yearly" value="yearly" />
                </Picker>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <Pressable onPress={() => setModalVisible(false)}>
                <ThemedText style={{ color: '#888' }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={saveBudget}>
                <ThemedText style={{ color: '#007AFF' }}>{editId ? 'Save' : 'Add'}</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  editBtn: {
    marginLeft: 12,
    padding: 6,
  },
  deleteBtn: {
    marginLeft: 6,
    padding: 6,
  },
  addButton: {
    backgroundColor: '#007AFF',
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
