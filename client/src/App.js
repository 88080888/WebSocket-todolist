import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: ' ',
  };

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000/');
    this.socket.on('addTask', newTask => {
      this.addTask(newTask);
    });
    this.socket.on('removeTask', removedTask => {
      this.removeTask(removedTask);
    });
    this.socket.on('updateData', allTasks => {
      this.updateTasks(allTasks);
    });
  }

  removeTask(task) {
    const {tasks} = this.state;
    this.setState({ tasks: tasks.filter(element => {return element.id !== task.id })});

    this.socket.emit('removeTask', task);
  }

  submitForm(event) {
    event.preventDefault();
    const id = uuidv4();
    this.addTask({id: id, name: this.state.taskName});
    this.socket.emit('addTask', ({id: id, name: this.state.taskName}));
    this.setState({taskName: ''});
  }

  addTask (task) {
    this.setState({tasks: [...this.state.tasks, task]});
  }

  updateTasks(allTasks) {
    this.setState({tasks: allTasks});
  }

  render() {
    const {tasks, taskName} = this.state;
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
                <li key={task.id}> {task.name}
                  <button className="btn btn--red" onClick={() => this.removeTask(task)}>Remove</button>
                </li>
            ))}
          </ul>
    
          <form id="add-task-form">
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={(e) => {this.setState({taskName: e.target.value})}}/>
            <button className="btn" type="submit" onClick={(event) => this.submitForm(event)}>Add</button>
          </form>
    
        </section>
      </div>
    );
  };
};

export default App;
