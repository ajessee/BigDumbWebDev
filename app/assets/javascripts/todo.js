const loadTodo = () => {
  if (document.querySelector('#todo-project-container')){
    setVariables();
    //load tasks if they exist in local storage
    setGetDeleteTask(null, 'get');
    loadEventListeners();
  };
}

const setVariables = () => {
  // Declare UI element variables to be able to do cool stuff to them!
  todo = {}
  console.log('setVariables');
  todo.form = document.querySelector('#todo-task-form');
  todo.taskList = document.querySelector('#tasks-collection');
  todo.clearBtn = document.querySelector('#todo-clear-tasks');
  todo.filter = document.querySelector('#todo-tasks-filter');
  todo.taskInput = document.querySelector('#todo-task-input');
  window.projects.todo = todo;
}

// Declare function to add (load) event listeners to elements
const loadEventListeners = () => {
  const todo = window.projects.todo;
  // Listen for the submit event on the form
  todo.form.addEventListener('submit', addTask);
  // Listen for click on delete task icon. However, we are going to listen on taskList element and use event delegation to figure out which one to delete. This is because there are many delete task icons that are being added dynamically and we want to target the correct one.
  todo.taskList.addEventListener('click', deleteTask);
  // Listen for click on clear all tasks button.
  todo.clearBtn.addEventListener('click', deleteAllTasks);
  // Listen for keyup event on filter input to be able to match task with filter query
  todo.filter.addEventListener('keyup', filterTasks)
}

const createTask = (newTask) => {
  const todo = window.projects.todo;
  // Create new task item and add class for material.css to hook into
  const task = document.createElement('li');
  const taskSpan = document.createElement('span');
  taskSpan.innerHTML = newTask;
  taskSpan.className = 'task-span-text';
  task.className = 'collection-item';
  // Create text node, fill it with content from taskInput field, and append to li
  task.appendChild(taskSpan);

  // Create a link that will delete the task and have a font awesome 'x' icon
  const deleteTaskLink = document.createElement('a');
  deleteTaskLink.className = 'delete-task secondary-content';
  deleteTaskLink.innerHTML = '<i class="fas fa-times fa-2x"></i>';

  // Append delete link to task
  task.appendChild(deleteTaskLink);

  // Append task to task list
  todo.taskList.appendChild(task);

  return task;
}

const setGetDeleteTask = (taskItem, setGetDelete) => {
  console.log('set get delete tasks')
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  if (setGetDelete === 'set') {
    tasks.push(taskItem);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } else if (setGetDelete === 'get') {
    tasks.forEach(function (task) {
      createTask(task);
    });
  } else if (setGetDelete === 'delete') {
    tasks.forEach(function (task, index) {
      if (taskItem.textContent === task) {
        tasks.splice(index, 1)
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

}

// Declare event handler function to add task to to-do list
const addTask = (e) => {

  const todo = window.projects.todo;

  e.preventDefault();

  // Check if taskInput field is empty, if so, prompt user for input
  if (todo.taskInput.value === '') {
    alert('Looks like you haven\'t added a task to your to-do list! Please try again.');
  } else {
    let task = createTask(todo.taskInput.value);

    // Store task in local storage
    setGetDeleteTask(task.textContent, 'set');

    // Clear taskList input 
    todo.taskInput.value = '';
  }
}

// Declare event handler to delete task from to-do list
const deleteTask = (e) => {
  if (e.target.parentElement.parentElement.classList.contains('delete-task') ||e.target.parentElement.classList.contains('delete-task')) {
    if (confirm('Delete this task?')) {
      e.target.parentElement.parentElement.remove();
      setGetDeleteTask(e.target.parentElement.parentElement, 'delete');
    }
  }
}

const deleteAllTasks = (e) => {
  const todo = window.projects.todo;
  if (confirm('You sure you want to delete all tasks?')) {
    while (todo.taskList.firstChild) {
      todo.taskList.removeChild(todo.taskList.firstChild);
    }
    localStorage.clear();
  }
}

const highlightText = (element, query) => {
  if (!query) {
    element.innerHTML = element.innerHTML.replace(/<span\b[^>]*>(.*?)<\/span>/g, '$1').trim();
    return;
  }
  const elInnerHTML = element.innerHTML.replace(/<span\b[^>]*>(.*?)<\/span>/g, '$1').trim();
  const elText = element.textContent.toLowerCase();
  const elTextNorm = element.textContent;
  const originalHTML = elInnerHTML.substring(elText.length);
  const queryRegex = new RegExp(query, "g");
  const elTextHighlighted = elTextNorm.replace(queryRegex, "<span class=\"highlight\">$&<\/span>");
  element.innerHTML = elTextHighlighted + originalHTML;
}

const filterTasks = (e) => {
  const textLower = e.target.value.toLowerCase();
  const text = e.target.value;

  document.querySelectorAll('.collection-item').forEach(function (task) {
    const item = task.textContent;
    if (item.toLowerCase().indexOf(textLower) != -1) {
      task.style.display = 'block';
      highlightText(task, text)
    } else {
      task.style.display = 'none';
    }
  })
}

// This is down here because since I'm using arrow functions, they aren't hoisted and therefore need to be declared before they are called.

// For some reason DOMContentLoaded is firing early.
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    loadTodo();
  }
}