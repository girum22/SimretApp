import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSimret } from '@/context/SimretContext';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function CategoryScreen() {
  const { categories, setCategories } = useSimret();
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  // --- Category change history ---
  const [history, setHistory] = useState<{ action: string; name: string; date: string }[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  const openAdd = () => {
    setEditId(null);
    setName('');
    setModalVisible(true);
  };
  const openEdit = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (cat) {
      setEditId(id);
      setName(cat.name);
      setModalVisible(true);
    }
  };
  const saveCategory = () => {
    if (!name) return;
    const now = new Date().toLocaleString();
    if (editId) {
      const old = categories.find(c => c.id === editId);
      setCategories(categories.map(c => c.id === editId ? { ...c, name } : c));
      setHistory(h => [{ action: `Edited`, name: old ? old.name + ' → ' + name : name, date: now }, ...h]);
    } else {
      setCategories([...categories, { id: generateId(), name }]);
      setHistory(h => [{ action: 'Added', name, date: now }, ...h]);
    }
    setModalVisible(false);
    setName('');
    setEditId(null);
  };
  const deleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setCategories(categories.filter(c => c.id !== id));
    setHistory(h => [{ action: 'Deleted', name: cat ? cat.name : id, date: new Date().toLocaleString() }, ...h]);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Manage Categories</ThemedText>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <ThemedText style={{ flex: 1 }}>{item.name}</ThemedText>
            <Pressable onPress={() => openEdit(item.id)} style={styles.editBtn}>
              <ThemedText style={{ color: '#007AFF' }}>Edit</ThemedText>
            </Pressable>
            <Pressable onPress={() => deleteCategory(item.id)} style={styles.deleteBtn}>
              <ThemedText style={{ color: '#ff5a36' }}>Delete</ThemedText>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 32 }}>No categories yet.</ThemedText>}
      />
      <Pressable style={styles.addButton} onPress={openAdd}>
        <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>+ Add Category</ThemedText>
      </Pressable>
      <Pressable style={[styles.addButton, { backgroundColor: '#888', marginTop: 12 }]} onPress={() => setHistoryVisible(true)}>
        <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>View History</ThemedText>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={{ marginBottom: 12 }}>{editId ? 'Edit' : 'Add'} Category</ThemedText>
            <TextInput
              placeholder="Category Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <Pressable onPress={() => setModalVisible(false)}>
                <ThemedText style={{ color: '#888' }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={saveCategory}>
                <ThemedText style={{ color: '#007AFF' }}>{editId ? 'Save' : 'Add'}</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={historyVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: 400 }]}> 
            <ThemedText type="title" style={{ marginBottom: 12 }}>Category History</ThemedText>
            {history.length === 0 ? (
              <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>No history yet.</ThemedText>
            ) : (
              <FlatList
                data={history}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <ThemedText style={{ width: 70 }}>{item.action}</ThemedText>
                    <ThemedText style={{ flex: 1 }}>{item.name}</ThemedText>
                    <ThemedText style={{ color: '#888', marginLeft: 8, fontSize: 12 }}>{item.date}</ThemedText>
                  </View>
                )}
                style={{ marginBottom: 12 }}
              />
            )}
            <Pressable onPress={() => setHistoryVisible(false)} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
              <ThemedText style={{ color: '#007AFF' }}>Close</ThemedText>
            </Pressable>
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
});
