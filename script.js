let tasks = [];
let currentFilter = 'all';
let taskIdCounter = 1;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTasksFromLocalStorage();
    updateDisplay();

    // Add Enter key support for input
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        input.focus();
        return;
    }

    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(task);
    saveTasksToLocalStorage();
    input.value = '';
    input.focus();

    updateDisplay();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToLocalStorage();
        updateDisplay();
    }
}

function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasksToLocalStorage();
            updateDisplay();
        }, 300);
    }
}

function filterTasks(filter) {
    currentFilter = filter;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    updateDisplay();
}

function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        tasks = tasks.filter(task => !task.completed);
        saveTasksToLocalStorage();
        updateDisplay();
    }
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'pending':
            return tasks.filter(task => !task.completed);
        default:
            return tasks;
    }
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;

    // Update clear button state
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.disabled = completed === 0;
}

function updateDisplay() {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = getFilteredTasks();

    updateStats();

    if (filteredTasks.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyState);
        return;
    }

    container.innerHTML = '';

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.setAttribute('data-task-id', task.id);

        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">
                ×
            </button>
        `;

        container.appendChild(taskElement);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    }
}

// Add some sample tasks on first load for demonstration
if (tasks.length === 0) {
    tasks.push(
        { id: taskIdCounter++, text: "Complete the Daily Coding Challenges", completed: false, createdAt: new Date() },
        { id: taskIdCounter++, text: "Get the things from the grocery store", completed: false, createdAt: new Date() },
        { id: taskIdCounter++, text: "Give pill to Granny", completed: false, createdAt: new Date() }
    );
    saveTasksToLocalStorage();
}
