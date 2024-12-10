import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const EditTaskScreen = ({ route, navigation }) => {
  const { task, onSave, onDelete } = route.params;

  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState(task.date ? new Date(task.date) : null);
  const [time, setTime] = useState(task.time ? new Date(`1970-01-01T${task.time}`) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    if (name.trim() === '') {
      alert('El nombre de la tarea es obligatorio');
      return;
    }
  
    const updatedTask = {
      ...task,
      name,
      description,
      date: date ? date.toISOString().split('T')[0] : null,
      time: time || null,
    };
  
    onSave(updatedTask);
    navigation.goBack();
  };
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="checkmark"
          size={24}
          color="green"
          style={{ marginRight: 15 }}
          onPress={handleSave}
        />
      ),
    });
  }, [navigation, handleSave, name, description, date, time]);

  const handleDelete = () => {
    onDelete(task.id);
    navigation.goBack();
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={date ? date.toISOString().split('T')[0] : ''}
          onChange={(e) => setDate(new Date(e.target.value))}
          style={styles.dateInput}
        />
      );
    }
    return (
      <>
        <Text style={styles.date} onPress={() => setShowDatePicker(true)}>
          {date ? date.toISOString().split('T')[0] : 'Seleccionar Fecha'}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setDate(selectedDate || date);
              setShowDatePicker(false);
            }}
          />
        )}
      </>
    );
  };

  const renderTimePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="time"
          value={time || ''}
          onChange={(e) => setTime(e.target.value)}
          style={styles.timeInput}
        />
      );
    }
    return (
      <>
        <Text style={styles.time} onPress={() => setShowTimePicker(true)}>
          {time || 'Seleccionar Hora'}
        </Text>
        {showTimePicker && (
          <DateTimePicker
            value={time ? new Date(`1970-01-01T${time}`) : new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              const hours = selectedTime.getHours().toString().padStart(2, '0');
              const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
              setTime(`${hours}:${minutes}`);
              setShowTimePicker(false);
            }}
          />
        )}
      </>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Fecha</Text>
      {renderDatePicker()}

      <Text style={styles.label}>Hora</Text>
      {renderTimePicker()}

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', 
  },
  label: {
    fontSize: 16,
    fontWeight: '600', 
    marginVertical: 5,
    color: '#34495e', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8, 
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff', 
    fontSize: 16,
    color: '#34495e',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#34495e',
  },
  deleteContainer: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#ffe6e6', 
    padding: 10,
    borderRadius: 8,
  },
  date: {
    color: '#3498db',
    borderWidth: 1,
    borderColor: '#3498db',
    textDecorationLine: 'underline',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  time: {
    color: '#3498db',
    textDecorationLine: 'underline',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#34495e',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#34495e',
  },
});

export default EditTaskScreen;
