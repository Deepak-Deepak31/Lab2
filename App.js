import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";

const configOfFirebase = {
  apiKey: "AIzaSyDMCEwcgHaulm14qc5p3pIUa2Rxi4ykMW0",
  authDomain: "reactnativetodo-2d4a8.firebaseapp.com",
  projectId: "reactnativetodo-2d4a8",
  storageBucket: "reactnativetodo-2d4a8.appspot.com",
  messagingSenderId: "666170040666",
  appId: "1:666170040666:web:fba0ea09986c3b2a9c9363",
  measurementId: "G-TK7PB0HMYS"
};

const appOfFirebase = firebase.initializeApp(configOfFirebase);

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    const unsubscribe = appOfFirebase
      .firestore()
      .collection("Todo")
      .onSnapshot((querySnapshot) => {
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasks);
      });

    return () => unsubscribe();
  }, []);

  const addTask = () => {
    if (taskTitle.trim()) {
      appOfFirebase.firestore().collection("Todo").add({
        title: taskTitle,
        taskStatus: false,
      });
      setTaskTitle("");
    }
  };

  const toggleTaskStatus = (id, taskStatus) => {
    appOfFirebase.firestore().collection("Todo").doc(id).update({
      taskStatus: !taskStatus,
    });
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, taskStatus: !taskStatus } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    appOfFirebase.firestore().collection("Todo").doc(id).delete();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ToDo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <Button
          title="Add Task"
          onPress={addTask}
          disabled={!taskTitle.trim()}
        />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <CheckBox
              checked={item.taskStatus}
              onPress={() => toggleTaskStatus(item.id, item.taskStatus)}
            />
            <Text style={styles.taskTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Icon name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  taskTitle: {
    flex: 1,
  },
});

export default App;