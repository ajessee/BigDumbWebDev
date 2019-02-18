/* 
  On DOM content loaded, check if todo project section is on page
  I do this so that I can reduce memory usage and only load parts of project JS that I need.
  I add todo object to window.projects namespace, and then all properties and
  methods to that object. I store DOM elements in the object and add event listeners to elements
  the user will interact with.

  Note - I am using arrow functions. I started because I wanted to be fancy and use them everywhere,
  until I realized that I shouldn't just do something because it is cool. One issue that arises is that arrow functions are not hoisted, so I have to put the event listener at the bottom of the page. Also, arrow functions don't have a 'this' object (unless you pass it one), so 'this' === window for all these functions. This isn't a 
  problem, because I am creating an object per each project, and attaching properties and methods to that. Need to think about whether I want to refactor to use regular ol' functions, or if I can keep like this. 7/22/18, don't see the need to refactor now.

  Todo:
  1. Set object to null on page reload to wipe from memory - is this needed?
  2. Refactor to ES6 classes
  3. Change from arrow functions to regular functions?
*/

const loadTodoProject = () => {
  console.log("Loading Todo Project");
  // Declare UI element variables to be able to do cool stuff to them!
  todo = {}
  console.log('set todo project variables');
  todo.form = document.querySelector('#todo-task-form');
  todo.taskList = document.querySelector('#tasks-collection');
  todo.clearBtn = document.querySelector('#todo-clear-tasks');
  todo.filter = document.querySelector('#todo-tasks-filter');
  todo.taskInput = document.querySelector('#todo-task-input');

  // Declare function to add (load) event listeners to elements
  todo.loadEventListeners = () => {
    // Listen for the submit event on the form
    todo.form.addEventListener('submit', todo.addTask);
    // Listen for click on delete task icon. However, we are going to listen on taskList element and use event delegation to figure out which one to delete. This is because there are many delete task icons that are being added dynamically and we want to target the correct one.
    todo.taskList.addEventListener('click', todo.deleteTask);
    // Listen for click on clear all tasks button.
    todo.clearBtn.addEventListener('click', todo.deleteAllTasks);
    // Listen for keyup event on filter input to be able to match task with filter query
    todo.filter.addEventListener('keyup', todo.filterTasks)
  }

  todo.createTask = (newTask) => {
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

  todo.setGetDeleteTask = (taskItem, setGetDelete) => {
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
        todo.createTask(task);
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
  todo.addTask = (e) => {

    e.preventDefault();

    // Check if taskInput field is empty, if so, prompt user for input
    if (todo.taskInput.value === '') {
      alert('Looks like you haven\'t added a task to your to-do list! Please try again.');
    } else {
      let task = todo.createTask(todo.taskInput.value);

      // Store task in local storage
      todo.setGetDeleteTask(task.textContent, 'set');

      // Clear taskList input 
      todo.taskInput.value = '';
    }
  }

  // Declare event handler to delete task from to-do list
  todo.deleteTask = (e) => {
    if (e.target.parentElement.parentElement.classList.contains('delete-task') || e.target.parentElement.classList.contains('delete-task')) {
      if (confirm('Delete this task?')) {
        e.target.closest('.collection-item').remove();
        todo.setGetDeleteTask(e.target.closest('.collection-item'), 'delete');
      }
    }
  }

  todo.deleteAllTasks = (e) => {
    if (confirm('You sure you want to delete all tasks?')) {
      while (todo.taskList.firstChild) {
        todo.taskList.removeChild(todo.taskList.firstChild);
      }
      localStorage.clear();
    }
  }

  todo.highlightText = (element, query) => {
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

  todo.filterTasks = (e) => {
    const textLower = e.target.value.toLowerCase();
    const text = e.target.value;

    document.querySelectorAll('.collection-item').forEach(function (task) {
      const item = task.textContent;
      if (item.toLowerCase().indexOf(textLower) != -1) {
        task.style.display = 'block';
        todo.highlightText(task, text)
      } else {
        task.style.display = 'none';
      }
    })
  }
  //load tasks if they exist in local storage
  todo.setGetDeleteTask(null, 'get');
  todo.loadEventListeners();
  // Add todo object to project namespace
  window.projects.todo = todo;
}

document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelector('#todo-project-container')) {
    loadTodoProject();
  };
});