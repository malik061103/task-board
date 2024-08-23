// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || [];


// Todo: create a function to generate a unique task id
function generateTaskId() {
if(nextId===null){
    nextId=1
}else{
    nextId++
}
localStorage.setItem("nextId",JSON.stringify(nextId))
return nextId
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    console.log(task)
    const taskCard = `
<div class="card w-75 task-card draggable my-3" data-task-id="${task.id}">
<div class="card-header">
<h4>${task.title}</h4>
</div>
<div claas= "card-body">
<p class="card-text">${task.task}</p>
<p class="card-text">${task.date}</p>
</div>
<button data-task-id="${task.id}">delete</button>
</div>
`

if(task.date && task.status !== "done"){
    const now = dayjs()
    const taskdue = dayjs(task.date,"DD/MM/YYYY")
    if(now.isSame(taskdue,"day")){
        taskCard.className+="bg-warning text-white"
    }else if(now.isAfter(taskdue)){
        taskCard.className+="bg-danger text-white"
    }
}
return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    console.log("hello")
const todoList = $("#todo-cards")
todoList.empty()
const inprogresslist = $("#in-progree-card")
inprogresslist.empty()
const donecard = $("#done-cards")
donecard.empty()

for(let task of taskList){
    console.log(task)
if(task.status==="to-do"){console.log("here")
    todoList.append(createTaskCard(task))
}else if(task.status==="in-progress"){
inprogresslist.append(createTaskCard(task))
}else if(task.status==="done"){
    donecard.append(createTaskCard(task))
}
     
}
$('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    
    helper: function (e) {
     
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      return original.clone().css({
        maxWidth: original.outerWidth(),
      });
    },
  });
} 

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault()
    const title = $('#taskTitle').val().trim()
    const date = $('#dueDate').val().trim()
    const task = $('#description').val().trim()

    const newTask = {
        title: title,
        date: date,
        task: task,
        status: "to-do",
        id: generateTaskId()
    }
    taskList.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(taskList))
    $('#formModal').modal('hide');
    renderTaskList()
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    
        event.preventDefault();
        const taskIdToDelete = $(event.currentTarget).data('task-id');
        taskList = taskList.filter(task => task.id !== parseInt(taskIdToDelete));
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList(); // Refresh the task list to reflect the change

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
        event.preventDefault();
        const taskId = ui.draggable.data('task-id');
        const targetLane = $(event.target).attr('id'); // Assuming the lane's ID corresponds to its status
    
        // Update the task's status in the taskList array
        const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
        if (taskIndex > -1) {
            taskList[taskIndex].status = targetLane;
            localStorage.setItem('tasks', JSON.stringify(taskList));
    
            // Optionally, refresh the task list to show the updated status
            renderTaskList();
        }
    }


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
renderTaskList()

    $('#submitTask').on("click", handleAddTask)
    $(".lane").droppable({
        accept:".draggable",
        drop: handleDrop
    })


})

