import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService, Task } from '../service/todo.service';
import { WeatherService } from './../service/weather.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  tasks: (Task & { editing: boolean })[] = [];
  newTask: string = '';

  constructor(
    private router: Router,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.loadTasks();

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    setInterval(() => {
      this.showTaskNotification();
    }, 3600000); // toutes les 60 minutes
  }

  private loadTasks() {
    this.todoService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data.map(t => ({ ...t, editing: false }));
      },
      error: (err) => {
        console.error('Erreur chargement tâches :', err);
      }
    });
  }

  addTask() {
    if (this.newTask.trim()) {
      this.todoService.addTask({ text: this.newTask }).subscribe({
        next: (newTask) => {
          this.tasks.unshift({ ...newTask, editing: false });
          this.newTask = '';
        },
        error: (err) => {
          console.error('Erreur ajout tâche :', err);
        }
      });
    }
  }

  toggleTaskCompletion(index: number) {
    const task = this.tasks[index];
    const updated = { completed: !task.completed };

    this.todoService.updateTask(task.id, updated).subscribe({
      next: (updatedTask) => {
        this.tasks[index].completed = updatedTask.completed;
      },
      error: (err) => {
        console.error('Erreur mise à jour :', err);
      }
    });
  }

  toggleEditTask(index: number) {
    const task = this.tasks[index];

    if (task.editing) {
      this.todoService.updateTask(task.id, { text: task.text }).subscribe({
        next: () => {
          task.editing = false;
        },
        error: (err) => {
          console.error('Erreur enregistrement édition :', err);
        }
      });
    } else {
      task.editing = true;
    }
  }

  deleteTask(index: number) {
    const task = this.tasks[index];

    this.todoService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks.splice(index, 1);
      },
      error: (err) => {
        console.error('Erreur suppression :', err);
      }
    });
  }

  get remainingTasks() {
    return this.tasks.filter(task => !task.completed).length;
  }

  get completedTasks() {
    return this.tasks.filter(task => task.completed).length;
  }

  private showTaskNotification() {
    const userName = localStorage.getItem('userName') || 'User';
    const appName = localStorage.getItem('appName') || 'Todo App';

    if (Notification.permission === "granted") {
      let message = this.remainingTasks > 0
        ? `Hey ${userName}, you have ${this.remainingTasks} tasks to complete! ✅`
        : `Hey ${userName}, you have no tasks! Add new tasks in "${appName}" to stay productive. 🚀`;

      const notification = new Notification("🚀 Reminder!", {
        body: message,
        icon: "/favicon.png"
      });

      notification.onclick = () => {
        window.focus();
        this.router.navigate(['/todos']);
      };
    } else {
      Notification.requestPermission();
    }
  }
}
