import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TASKS = gql`
    query GetTasks {
        tasks {
            id
            title
            completed
        }
    }
`;

const ADD_TASK = gql`
    mutation AddTask($title: String!) {
        addTask(title: $title) {
            id
            title
            completed
        }
    }
`;

const App = () => {
    const { loading, error, data } = useQuery(GET_TASKS);
    const [addTask] = useMutation(ADD_TASK, {
        refetchQueries: [{ query: GET_TASKS }],
    });

    const [newTaskTitle, setNewTaskTitle] = useState('');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleAddTask = () => {
        if (newTaskTitle.trim() === '') return;
        addTask({ variables: { title: newTaskTitle } });
        setNewTaskTitle('');
    };

    return (
        <div>
            <h1>Task Manager</h1>
            <ul>
                {data.tasks.map((task) => (
                    <li key={task.id}>
                        {task.title} {task.completed ? '(Completed)' : ''}
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task"
            />
            <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
};

export default App;
