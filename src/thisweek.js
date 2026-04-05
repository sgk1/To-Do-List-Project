// thisweek.js

import { format, formatDistance, compareAsc } from "date-fns";

export function getThisWeek() {

    
    
    // declaration of content, addTodoList, renderTodoList, addTodoListBtn
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const addTodoList = document.createElement('div');
    addTodoList.classList.add('addTodoList');
    const renderTodoListContainer = document.createElement('div');
    renderTodoListContainer.classList.add('renderTodoListContainer');
    const addTodoListBtn = document.createElement('button');
    addTodoListBtn.classList.add('addTodoListBtn');
    addTodoListBtn.textContent = 'Add List';
    addTodoList.appendChild(addTodoListBtn);
    content.appendChild(addTodoList);
    content.appendChild(renderTodoListContainer);
    let todoList = [];


    // function to load todoList from localStorage
    function loadTodoListFromLocalStorage() {
        const stored = localStorage.getItem('todoList');
        if (stored) {
            todoList = JSON.parse(stored);
        }
    }
    
    //getting start of week and end of week date range for rendering todoList for a week
    const {startOfWeek, endOfWeek} = getWeekDateRange();

    


    
    loadTodoListFromLocalStorage();
    getProjects();
    renderTodoList();

    // get list of projects from todoList for project filter
    
    function getProjects() {
        const projectList = document.querySelector('.Projects-list-left-pane');
        projectList.innerHTML = '';

        if (todoList.length === 0) return;
        
        const projects = [...new Set(todoList
            .map(todo => todo.project?.trim().toLowerCase())
            .filter(Boolean)
        )];
        
        projects.forEach((project) => {
            const projectBtn = document.createElement('button');
            projectBtn.classList.add('projectBtn');
            projectBtn.textContent = project.charAt(0).toUpperCase() + project.slice(1);
            projectBtn.addEventListener('click', () => {
                document.querySelectorAll('.projectBtn').forEach(
                    btn => {btn.classList.remove('active')}
                );
                projectBtn.classList.add('active');
                renderTodoList(project);
            });
            projectList.appendChild(projectBtn);
        });
    }



    //adding event listener for addTodoListBtn
    addTodoListBtn.addEventListener('click', loadTodoListBox);

    // function to load todoListBox
    function loadTodoListBox() {
        // creation of todoListBox container
        const todoListBox = document.createElement('dialog');

        // creation of title and description
        const titleInput = document.createElement('input');
        titleInput.placeholder = 'Title';
        const descriptionInput = document.createElement('input');
        descriptionInput.placeholder = 'Description (optional)';

        //creation of date and deadline container and inputs
        const dueDateDeadlineInput = document.createElement('div');
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.placeholder = 'Due Date';
        const deadlineInput = document.createElement('input');
        deadlineInput.type = 'date';
        deadlineInput.placeholder = 'Deadline (optional)';
        dueDateDeadlineInput.appendChild(dateInput);
        dueDateDeadlineInput.appendChild(deadlineInput);

        //creation of project container and priority and inputs
        const projectInput = document.createElement('input');
        projectInput.placeholder = 'Project (optional)';
        const prioritySelect = document.createElement('select');
        const defaultOption = document.createElement('option');
        defaultOption.value = 'No priority set';
        defaultOption.textContent = 'Priority (optional)';
        prioritySelect.appendChild(defaultOption);
        ['Low', 'Medium', 'High'].forEach((priority) => {
            const option = document.createElement('option');
            option.value = priority.toLowerCase();
            option.textContent = priority;
            prioritySelect.appendChild(option);
        });

        //creation of todoListBox buttons - save, cancel, clear
        const todoListBoxbuttons = document.createElement('div');
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        todoListBoxbuttons.appendChild(saveBtn);
        todoListBoxbuttons.appendChild(cancelBtn);
        todoListBoxbuttons.appendChild(clearBtn);

        // appending title, description, date, deadline and buttons to todoListBox and todoListBox to content
        todoListBox.appendChild(titleInput);
        todoListBox.appendChild(descriptionInput);
        todoListBox.appendChild(dueDateDeadlineInput);
        todoListBox.appendChild(projectInput);
        todoListBox.appendChild(prioritySelect);
        todoListBox.appendChild(todoListBoxbuttons);
        content.appendChild(todoListBox);
        todoListBox.showModal();

        //declaring variables for todoList
        let title;
        let description;
        let date;
        let deadline;
        let project;
        let priority;
        let completed = Boolean(false);
        
        // adding event listener for save button
        saveBtn.addEventListener('click', () => {
            title = titleInput.value;
            description = descriptionInput.value;
            date = dateInput.value || null;
            deadline = deadlineInput.value;
            project = projectInput.value;
            priority = prioritySelect.value;
            
            if (title) {
                const todo = { title, description, date, deadline, project, priority, completed};
                todoList.push(todo);
                saveTodoList();
                getProjects();
                renderTodoList();
                todoListBox.close();
                todoListBox.remove();
            }
        });
        
        // adding event listener for cancel button
        cancelBtn.addEventListener('click', () => {
            todoListBox.close();
            todoListBox.remove();
        });

        // adding event listener for clear button
        clearBtn.addEventListener('click', () => {
            titleInput.value = '';
            descriptionInput.value = '';
            dateInput.value = '';
            deadlineInput.value = '';
            projectInput.value = '';
            prioritySelect.value = 'No priority set';
        });
    }

        


    // function to save todoList to localStorage    
    function saveTodoList() {
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }

    //getting today's date in YYYY-MM-DD format
    function getTodayDate() {
                return new Date().toISOString().split('T')[0];
            }

    //getting the week date range for rendering todoList for a week

    function getWeekDateRange() {
        const today = new Date();
        const day = today.getDay(); // 0 (Sun) to 6 (Sat)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate()-day); // Set to Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Saturday

        const format = (date) => {
            return date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2,'0');
        }


        return {
            startOfWeek: format(startOfWeek),
            endOfWeek: format(endOfWeek)
        };
    }

    

    //function to render todoList
    function renderTodoList(selectedProject = null) {

        renderTodoListContainer.innerHTML = '';

        const filteredTodoList = todoList
            .filter(todo => {
                // if project selected, ignore week completely
                if (selectedProject) {
                    return todo.project?.trim().toLowerCase() === selectedProject.trim().toLowerCase();
                }

                // if no project selected, filter by week
                const today = getTodayDate();
                const inWeek = todo.date >= startOfWeek && todo.date <= endOfWeek;
                return today && inWeek;
            })
            .sort((a,b) => {
                if (!a.date) return 1; // if a has no date, place it after b
                if (!b.date) return -1; // if b has no date, place it after a
                // return new Date(a.date) - new Date(b.date);
                return compareAsc(new Date(a.date), new Date(b.date));
            })
            ;
                



        filteredTodoList.forEach((todo) => {

        
            // defining todoItemContainer, checkbox, todoItem, deleteBtn
            const todoItemContainer = document.createElement('div');
            todoItemContainer.classList.add('todoItemContainer');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            const todoItemTitle = document.createElement('span');
            todoItemTitle.classList.add('todoItemTitle');
            const todoItemDueDate = document.createElement('span');
            todoItemDueDate.classList.add('todoItemDueDate');
            const projectTag = document.createElement('span');
            projectTag.classList.add('projectTag');
            const priorityTag = document.createElement('span');
            priorityTag.classList.add('priorityTag');
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('deleteBtn');
            deleteBtn.textContent = 'Delete';

            

            // setting text content for todoItem

            todoItemTitle.textContent = todo.title;
            todoItemDueDate.textContent = todo.date ? format(new Date(todo.date), 'PPP') : 'no due date';
            if (todo.completed) {
                todoItemTitle.style.textDecoration = 'line-through';
            }
            projectTag.textContent = todo.project || 'no Tag';
            priorityTag.textContent = todo.priority || 'no priority';
        
            
            //adding event listener for checkbox
            checkbox.addEventListener('change', ()=> {
                todo.completed = checkbox.checked;
                todoItemTitle.style.textDecoration = todo.completed ? 'line-through' : 'none';
                saveTodoList();
            })
            
            //adding event listener for delete button
            deleteBtn.addEventListener('click', () => {
                todoList = todoList.filter((t) => t !== todo);
                saveTodoList();
                getProjects();
                renderTodoList();
                
            });

            todoItemContainer.appendChild(checkbox);
            todoItemContainer.appendChild(todoItemDueDate);
            todoItemContainer.appendChild(todoItemTitle);
            todoItemContainer.appendChild(projectTag);
            todoItemContainer.appendChild(priorityTag);
            todoItemContainer.appendChild(deleteBtn);
            renderTodoListContainer.appendChild(todoItemContainer);
        

        });



    }
    
}