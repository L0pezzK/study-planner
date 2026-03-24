'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Task interface
interface Task {
  id: number | string;
  title: string;
  dueDate: string;
  completed: boolean;
  subject?: string;
  priority?: 'low' | 'medium' | 'high';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  const subjects = Array.from(new Set(tasks.map((t) => t.subject).filter(Boolean))) as string[];
  const filteredAndSortedTasks = tasks
    .filter(t => selectedSubject === 'All' || t.subject === selectedSubject)
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortAscending ? dateA - dateB : dateB - dateA;
    });

  const toggleTaskCompletion = async (id: string | number, currentStatus: boolean) => {
    // Optimistically update UI
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !currentStatus } : t));
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !currentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update task');
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on error
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: currentStatus } : t));
    }
  };

  const deleteTask = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete task');
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task from server.');
      setTasks(previousTasks);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error('Failed to fetch tasks');
        
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold mb-3 tracking-wide uppercase">
              Dashboard
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Your Tasks</h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Manage and track your academic assignments.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tasks/new"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-blue-600 text-white text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back Home
            </Link>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="subject-filter" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                Subject:
              </label>
              <select
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                style={{ paddingRight: '2.5rem', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="All">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setSortAscending(!sortAscending)}
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <svg className={`w-4 h-4 transition-transform ${sortAscending ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Due Date {sortAscending ? '(Nearest)' : '(Furthest)'}
            </button>
          </div>
          
          <div className="text-sm text-zinc-500 font-medium whitespace-nowrap">
            {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {loading ? (
            // Loading State (Skeletons)
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col p-6 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 animate-pulse">
                <div className="flex items-start justify-between gap-4">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : filteredAndSortedTasks.length === 0 ? (
            // Empty State
            <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/50">
              <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No tasks</h3>
              <p className="mt-1 text-sm text-zinc-500">Get started by adding a new task, or adjust your subject filters.</p>
            </div>
          ) : (
            // Tasks List
            filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className={`relative flex flex-col p-6 rounded-2xl border transition-all cursor-default ${
                  task.completed
                    ? 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200/80 dark:border-zinc-800/80 opacity-[0.85]'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {task.title}
                    </h3>
                    {(task.subject || task.priority) && (
                      <div className="mt-2 text-xs flex gap-2 font-medium">
                        {task.subject && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                            {task.subject}
                          </span>
                        )}
                        {task.priority && (
                          <span className={`px-2 py-0.5 rounded-md border ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200/50 dark:bg-red-900/30 dark:text-red-300' :
                            task.priority === 'medium' ? 'bg-orange-100 text-orange-700 border-orange-200/50 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-green-100 text-green-700 border-green-200/50 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                      task.completed 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-transparent border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer'
                    }`}>
                    {task.completed && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-md">
                      <svg className="mr-2 w-4 h-4 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {task.completed && (
                      <div className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1.5 rounded-md">
                        Done
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    aria-label="Delete Task"
                    title="Delete Task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
