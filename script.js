// Todo List State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tasksCounter = document.getElementById('tasks-counter');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update tasks counter
function updateTasksCounter() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
}

// Create todo element
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
        <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;

    return li;
}

// Render todos based on current filter
function renderTodos() {
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    todoList.innerHTML = '';
    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });

    updateTasksCounter();
}

// Add new todo
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (text) {
        const newTodo = {
            id: Date.now().toString(),
            text,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';

        // Add animation class
        const newTodoElement = todoList.lastElementChild;
        newTodoElement.style.animation = 'slideIn 0.3s ease forwards';
    }
});

// Handle todo actions (toggle and delete)
todoList.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const todoId = todoItem.dataset.id;
    const todo = todos.find(t => t.id === todoId);

    if (e.target.matches('.checkbox')) {
        todo.completed = e.target.checked;
        todoItem.classList.toggle('completed');
        saveTodos();
        updateTasksCounter();
    }

    if (e.target.matches('.delete-btn') || e.target.matches('.fa-trash-alt')) {
        todoItem.style.animation = 'slideOut 0.3s ease forwards';
        todoItem.addEventListener('animationend', () => {
            todos = todos.filter(t => t.id !== todoId);
            saveTodos();
            renderTodos();
        });
    }
});

// Handle filter changes
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderTodos();
    });
});

// Clear completed todos
clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
});

// Initial render
renderTodos(); 