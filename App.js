import { KeyboardAvoidingView, StyleSheet, Text, View, Platform, FlatList } from "react-native";
import Task from "./components/Task";
import AddTask from "./components/AddTask";
import { useEffect, useState } from "react";
import axios from 'axios'; //http requests

export default function App() {
    const [items, setItems] = useState([]);

    const flatListData = items.map((item, index) => ({
        id: index.toString(), 
        isCompleted: item.isCompleted,
        text: item.title,
        onPress: item.onPress
    }));
    const filteredData = flatListData.filter(item => item.isCompleted !== 2);
    const sortedData = filteredData.slice().sort((a, b) => a.isCompleted - b.isCompleted);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://192.168.33.36:5000/api/tasks'); //fetch
            setItems(response.data)
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching tasks from server: ", error);
        }
    }

    const handleTaskUpdate = async (index) => {
        const updatedTasks = [...items];
        updatedTasks[index].isCompleted = updatedTasks[index].isCompleted + 1;
        console.log(updatedTasks[index].isCompleted);
        if (updatedTasks[index].isCompleted > 1) {
            try {
                await axios.delete('http://192.168.33.36:5000/api/tasks/' + updatedTasks[index].id);
                setItems(prevItems => prevItems.filter(item => item.id !== updatedTasks[index].id));
            } catch (error) {
                console.error("Error deleting task from server: ", error)
            }
        }
        else {
            setItems(updatedTasks);

            try {
                await axios.put('http://192.168.33.36:5000/api/tasks/' + updatedTasks[index].id, { isCompleted: updatedTasks[index].isCompleted });
            } catch (error) {
                console.error("Error updating task to server: ", error);
            }
        }
    };

    const handleAddTask = async (task) => {
        if (task == undefined) { console.error("Text is empty") }
        else {
            try {
                const response = await axios.post('http://192.168.33.36:5000/api/tasks', { title: task, isCompleted: 0 }); // add task to server
                console.log(response.data)
                setItems(prevItems => [...prevItems, response.data]); // update state with added task
            } catch (error) {
                console.error("Error adding task to server: ", error);
            }
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.tasksWrapper}>
                <Text style={styles.sectionTitle}>Today's Tasks</Text>
                <View style={styles.items}>
                    {/*{items.map((item, index) => {
                        return <Task text={item.text} isCompleted={item.isCompleted} key={index}
                            onPress={() => handleTaskPressed(index)}></Task>;
                    })}*/}
                    <FlatList
                        data={sortedData}
                        renderItem={({ item }) => <Task text={item.text} isCompleted={item.isCompleted ? true : false}
                            onPress={() => handleTaskUpdate(item.id)} />}
                        keyExtractor={item => item.id}
                    />

                                       
                </View>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.addTaskContainer}
            >
                <AddTask onAddTaskPress={handleAddTask} />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F1F1",
    },
    tasksWrapper: {
        paddingTop: 80,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 34,
        fontWeight: "bold",
    },
    items: {
        marginTop: 32,
    },
    addTaskContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});