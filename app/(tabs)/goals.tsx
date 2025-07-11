import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSimret } from '@/context/SimretContext';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function GoalScreen() {
  const { goals, setGoals, categories } = useSimret();
  const [modalVisible, setModalVisible] = useState(false);
  const [contribModal, setContribModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [contribGoalId, setContribGoalId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [endDate, setEndDate] = useState('');
  const [contribution, setContribution] = useState('');

  const openAdd = () => {
    setEditId(null);
    setName('');
    setTargetAmount('');
    setCategoryId(categories[0]?.id || '');
    setEndDate('');
    setModalVisible(true);
  };
  const openEdit = (id: string) => {
    const g = goals.find(g => g.id === id);
    if (g) {
      setEditId(id);
      setName(g.name);
      setTargetAmount(g.targetAmount.toString());
      setCategoryId(g.categoryId || categories[0]?.id || '');
      setEndDate(g.endDate || '');
      setModalVisible(true);
    }
  };
  const saveGoal = () => {
    if (!name || !targetAmount) return;
    if (editId) {
      setGoals(goals.map(g => g.id === editId ? { ...g, name, targetAmount: parseFloat(targetAmount), categoryId, endDate } : g));
    } else {
      setGoals([...goals, { id: generateId(), name, targetAmount: parseFloat(targetAmount), savedAmount: 0, categoryId, endDate, startDate: new Date().toISOString() }]);
    }
    setModalVisible(false);
    setName('');
    setTargetAmount('');
    setCategoryId(categories[0]?.id || '');
    setEndDate('');
    setEditId(null);
  };
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };
  const openContrib = (goalId: string) => {
    setContribGoalId(goalId);
    setContribution('');
    setContribModal(true);
  };
  const addContribution = () => {
    if (!contribution || !contribGoalId) return;
    setGoals(goals.map(g => g.id === contribGoalId ? { ...g, savedAmount: (g.savedAmount || 0) + parseFloat(contribution) } : g));
    setContribModal(false);
    setContribution('');
    setContribGoalId(null);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Goals</ThemedText>
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const percent = Math.round(((item.savedAmount || 0) / item.targetAmount) * 100);
          let color = '#6c8cff';
          if (percent >= 70) color = '#2ecc40';
          else if (percent >= 11) color = '#ffb300';
          return (
            <View style={[styles.row, { borderLeftWidth: 6, borderLeftColor: color }]}> 
              <View style={{ flex: 2 }}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText style={{ color: '#888', fontSize: 12 }}>{percent}% ({item.savedAmount.toLocaleString()} / {item.targetAmount.toLocaleString()} ETB)</ThemedText>
                {item.endDate && <ThemedText style={{ color: '#888', fontSize: 12 }}>Deadline: {item.endDate}</ThemedText>}
              </View>
              <Pressable onPress={() => openContrib(item.id)} style={styles.editBtn}>
                <ThemedText style={{ color: '#007AFF' }}>Add to Goal</ThemedText>
              </Pressable>
              <Pressable onPress={() => openEdit(item.id)} style={styles.editBtn}>
                <ThemedText style={{ color: '#007AFF' }}>Edit</ThemedText>
              </Pressable>
              <Pressable onPress={() => deleteGoal(item.id)} style={styles.deleteBtn}>
                <ThemedText style={{ color: '#ff5a36' }}>Delete</ThemedText>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 32 }}>No goals yet.</ThemedText>}
      />
      <Pressable style={styles.addButton} onPress={openAdd}>
        <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>+ Add Goal</ThemedText>
      </Pressable>
      {/* Add/Edit Goal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>{editId ? 'Edit' : 'Add'} Goal</ThemedText>
            <TextInput
              placeholder="Goal Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Target Amount"
              value={targetAmount}
              onChangeText={setTargetAmount}
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
            <TextInput
              placeholder="Deadline (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <Pressable onPress={() => setModalVisible(false)}>
                <ThemedText style={{ color: '#888' }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={saveGoal}>
                <ThemedText style={{ color: '#007AFF' }}>{editId ? 'Save' : 'Add'}</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Add Contribution Modal */}
      <Modal visible={contribModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>Add to Goal</ThemedText>
            <TextInput
              placeholder="Amount to Add"
              value={contribution}
              onChangeText={setContribution}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <Pressable onPress={() => setContribModal(false)}>
                <ThemedText style={{ color: '#888' }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={addContribution}>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 4,
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
