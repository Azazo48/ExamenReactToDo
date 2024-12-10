import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, FlatList } from 'react-native';
import FloatingButton from '../components/FloatingButton';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };

    fetchTasks();
    //hacer un intervalo para llamar a la API
    const intervalo = setInterval(() => {
      fetchTasks();
    }, 2000); //cada 5 segundos
    return () => clearInterval(intervalo);
  }, []);

  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Tarea agregada con éxito");
      } else {
        console.error('Error al agregar tarea:', result.error);
      }
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${updatedTask.id_task}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks(tasks.map((task) => (task.id_task === updatedTask.id_task ? updatedTask : task)));
      } else {
        console.error('Error al editar tarea:', await response.json());
      }
    } catch (error) {
      console.error('Error al editar tarea:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id_task !== taskId));
      } else {
        console.error('Error al eliminar tarea:', await response.json());
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find((t) => t.id_task === taskId);
    if (!task) return;

    const updatedTask = { ...task, is_completed: !task.is_completed };

    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: updatedTask.is_completed }),
      });

      setTasks(tasks.map((t) => (t.id_task === taskId ? updatedTask : t)));
    } catch (error) {
      console.error('Error al cambiar el estado de la tarea:', error);
    }
  };

  const groupTasksByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  
    const manana = new Date(today);
    manana.setDate(manana.getDate() + 1);

    const groupedTasks = {
      atrasadas: [],
      hoy: [],
      manana: [],
      masTarde: [],
      sinFecha: [],
    };

    tasks.forEach((task) => {
      if (!task.task_date || task.task_date.trim() === '') {
        groupedTasks.sinFecha.push(task);
      } else {
        const taskDate = new Date(task.task_date);

        if (isNaN(taskDate)) {
          groupedTasks.sinFecha.push(task);
        } else {
          const normalizedTaskDate = new Date(taskDate);
          normalizedTaskDate.setHours(0, 0, 0, 0);

          if (normalizedTaskDate < today) {
            groupedTasks.atrasadas.push(task);
          } else if (normalizedTaskDate.getTime() === today.getTime()) {
            groupedTasks.hoy.push(task);
          } else if (normalizedTaskDate.getTime() === manana.getTime()) {
            groupedTasks.manana.push(task);
          } else if (normalizedTaskDate > manana) {
            groupedTasks.masTarde.push(task);
          }
        }
      }
    });

    return groupedTasks;
  };

  const formatTimeTo12Hour = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  const groupedTasks = groupTasksByDate();

  const renderTask = ({ item: task }) => (
    <Pressable
      key={task.id_task}
      style={styles.task}
      onPress={() =>
        navigation.navigate('EditTask', {
          task: task,
          onSave: handleEditTask,
          onDelete: handleDeleteTask,
        })
      }
    >
      <Pressable onPress={() => toggleTaskStatus(task.id_task)}>
        <Text style={task.is_completed ? styles.checkMark : styles.xMark}>
          {task.is_completed ? '✓' : '✗'}
        </Text>
      </Pressable>
      <View style={styles.taskDetails}>
        <Text style={styles.taskName}>{task.task_name}</Text>
        <Text style={styles.taskDate}>
          {formatDate(task.task_date)} {task.task_time && `- ${formatTimeTo12Hour(task.task_time)}`}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteTask(task.id_task)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </Pressable>
  );

  const renderSection = (title, tasks) => (
    tasks.length > 0 && (
      <View style={{height: "40%"}} key={title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id_task.toString()}
        />
      </View>
    )
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask', { onSave: handleAddTask })}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      ),
    });
  }, [navigation]);


  return (
    <View style={styles.container}>
      {renderSection('ATRASADAS', groupedTasks.atrasadas)}
      {renderSection('HOY', groupedTasks.hoy)}
      {renderSection('MAÑANA', groupedTasks.manana)}
      {renderSection('MAS TARDE', groupedTasks.masTarde)}
      {renderSection('SIN FECHA', groupedTasks.sinFecha)}
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    overflow: 'scroll',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 16,
    color: '#3498db',
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderColor: '#3498db',  
    borderWidth: 1,
    
  },
  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginRight: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2980b9',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 36,
  },
  
  xMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginRight: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2980b9',
    textAlign: 'center',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2980b9',
  },
  
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDate: {
    color: '#888',
    marginTop: 5,
  },
  addButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 50,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  
});

export default TaskListScreen;





