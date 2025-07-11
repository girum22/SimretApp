import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSimret } from '@/context/SimretContext';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function IncomeScreen() {
  const { incomeSources, setIncomeSources } = useSimret();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const totalIncome = incomeSources.reduce((sum, src) => sum + src.amount, 0);

  const addIncomeSource = () => {
    if (!name || !amount) return;
    setIncomeSources([
      ...incomeSources,
      {
        id: generateId(),
        name,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
      },
    ]);
    setName('');
    setAmount('');
    setModalVisible(false);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Total Income: {totalIncome.toLocaleString()}</ThemedText>
      <FlatList
        data={incomeSources}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <ThemedText type="defaultSemiBold" style={styles.headerCell}>Source</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.headerCell}>Amount</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.headerCell}>Date</ThemedText>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <ThemedText style={styles.cell}>{item.name}</ThemedText>
            <ThemedText style={styles.cell}>{item.amount.toLocaleString()}</ThemedText>
            <ThemedText style={styles.cell}>{item.date.split('T')[0]}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 32 }}>No income sources yet.</ThemedText>}
      />
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>+ Add Income Source</ThemedText>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>Add Income Source</ThemedText>
            <TextInput
              placeholder="Source Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <Pressable onPress={() => setModalVisible(false)}>
                <ThemedText style={{ color: '#888' }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={addIncomeSource}>
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
});
