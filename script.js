let tasks = [
    { id: 1, text: 'Complete coding project', completed: false},
    { id: 2, text: 'Read a book', completed: false},
    { id: 3, text: 'Go for a run', completed: false}
];

function renderTasks() {
    const taskContainer = document.getElementById('task-container');
    taskContainer.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        if (task.completed) {
            taskElement.classList.add('completed');
        }

        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = task.text;

        const buttonsContainer = document.createElement('div'); // Container for buttons
        buttonsContainer.classList.add('buttons-container');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.onclick = () => enableEditMode(taskElement, task.id);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Incomplete' : 'Complete';
        toggleButton.classList.add('toggle-button');
        toggleButton.onclick = () => toggleTask(task.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteTask(task.id);

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(toggleButton);
        buttonsContainer.appendChild(deleteButton);

        taskElement.appendChild(taskTextElement);
        taskElement.appendChild(buttonsContainer);

        taskContainer.appendChild(taskElement);
    });
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const text = taskInput.value.trim();

    if (text !== '') {
        const newTask = { id: Date.now(), text, completed: false };
        tasks.push(newTask);
        taskInput.value = '';
        renderTasks();
    } else {
        alert('Please enter a task before adding!');
    }
};

function toggleTask(taskId) {
    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
}

let previousTasksState = [];

function saveTasksState() {
    previousTasksState = [...tasks];
}

function undo() {
    if (previousTasksState.length > 0) {
        tasks = [...previousTasksState];
        renderTasks();
    }
}

function deleteTask(taskId) {
    saveTasksState();
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

function enableEditMode(taskElement, taskId) {
    saveTasksState();
    const taskTextElement = taskElement.querySelector('span');
    const currentText = taskTextElement.textContent;

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;

    inputField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            disableEditMode(taskElement, taskId, inputField.value);
        }
    });

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.classList.add('confirm-button');
    confirmButton.onclick = () => disableEditMode(taskElement, taskId, inputField.value);

    inputField.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            disableEditMode(taskElement, taskId, currentText, true);
        }
    });

    taskTextElement.replaceWith(inputField, confirmButton);

    inputField.focus();
}

function disableEditMode(taskElement, taskId, newText, cancel = false) {
    if (!cancel) {
        tasks = tasks.map(task =>
            task.id === taskId ? { ...task, text: newText } : task
        );
        renderTasks();
    } else {
        renderTasks();
    }
}

renderTasks();
