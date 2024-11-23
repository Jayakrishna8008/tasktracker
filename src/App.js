import React,{useState,useEffect} from 'react';
import "./App.css"
const App=()=>{
  const[tasks,setTasks]=useState([]);
  const[filter,setFilter]=useState("All");
  const[sortby,setSortBy]=useState("None");
  const[taskForm,setTaskForm]=useState({
        title:"",
        description:"",
        dueDate:"",
        status:"pending",
  });
  const [editingTaskId,setEditingTaskId]=useState(null);

useEffect(()=>{
  if(tasks.length>0){
    localStorage.setItem("tasks",JSON.stringify(tasks))
  }
},[tasks])

useEffect(() => {
  try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (Array.isArray(savedTasks)) {
      setTasks(savedTasks);
    } else {
      console.error("Tasks in localStorage are not an array. Resetting...");
      setTasks([]);
    }
  } catch (error) {
    console.error("Failed to parse tasks from localStorage:", error);
    setTasks([]);
  }
}, []);   
 
  const addTask=(event)=>{
    event.preventDefault();
    if(!taskForm.title || !taskForm.dueDate){
      return alert("Fill required fields!")
    };
    if(editingTaskId){
      setTasks(
        tasks.map((task)=>
          task.id===editingTaskId?{...task,...taskForm}:task)
      ); 
      setEditingTaskId(null);
    }else{
      const newTask={...taskForm,id:Date.now()};
      setTasks([...tasks,newTask]);
    }
    setTaskForm({ title:"",
      description:"",
      dueDate:"",
      status:"pending",})
  }

  const deleteTask=(id)=>{
    if(window.confirm("Are you sure you want to delete this task?")){
      setTasks(tasks.filter((task)=>task.id!==id));
    }
  };

  const editTask=(task)=>{
     setTaskForm(task);
     setEditingTaskId(task.id)
  }

  const filteredTask=tasks.filter((task)=>{
    if(filter==="All") return true;
    return task.status===filter;
  });

  const sortedTasks=[...filteredTask].sort((a,b)=>{
    if(sortby==="Due Date") return new Date(a.dueDate)-new Date(b.dueDate);
    return 0;
  });

  return(
    <div className='bgCard'>
      <h1>Task Manager</h1>
      <form onSubmit={addTask}>
        <div className='form-container'>
          <input 
              type="text"
              placeholder='Title'
              value={taskForm.title} 
              onChange={(event)=>setTaskForm({...taskForm,title:event.target.value})}
          />
          <input 
            type="text"
            placeholder='Description'
            value={taskForm.description} 
            onChange={(event)=>setTaskForm({...taskForm,description:event.target.value})}
          />
          <input 
            type="date"
            value={taskForm.dueDate} 
            onChange={(event)=>setTaskForm({...taskForm,dueDate:event.target.value})}
          />
          <div className='select-form'>
            <select>
              value={taskForm.status}
              onChange={(event)=>setTaskForm({...taskForm,status:event.target.value})}
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button type='submit'>{editingTaskId?"Update":"Add"}</button>
          </div>
        </div>
      </form>
      <div className='select-form'>
        <select className="select" value={filter} onChange={(event)=>setFilter(event.target.value)}>
            <option value="All">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
        </select>
        <select className="select"  value={sortby} onChange={(event)=>setSortBy(event.target.value)}>
            <option value="None">None</option>
            <option value="Due Date">Due Date</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedTasks.map((task)=>(
            <tr key={task.id}>
               <td>{task.title}</td>
               <td>{task.description}</td>
               <td>{task.dueDate}</td>
               <td>{task.status}</td>
               <td>
                <button className="table-button" onClick={()=>editTask(task)}>Edit</button>
                <button className="table-button" onClick={()=>deleteTask(task.id)}>Delete</button>
               </td>
            </tr>
          ))}
        </tbody>
       
      </table>
    </div>
  )
}

export default App