export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the tasks.json file
const dataFilePath = path.join(process.cwd(), 'data', 'tasks.json');

// Helper function to read tasks
function getTasks() {
  if (!fs.existsSync(dataFilePath)) {
    // Return empty array if file/directory doesn't exist to prevent crashes
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
    return [];
  }
  
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  try {
    return JSON.parse(fileContents || '[]');
  } catch (e) {
    console.error("Error parsing tasks.json", e);
    return [];
  }
}

export async function GET() {
  try {
    const tasks = getTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to read tasks:", error);
    return NextResponse.json({ error: 'Failed to read tasks data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tasks = getTasks();
    
    // Create new task object with a generated ID
    const newTask = {
      id: body.id || Date.now(),
      title: body.title || 'Untitled Task',
      dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      completed: body.completed ?? false,
      subject: body.subject || undefined,
      priority: body.priority || undefined,
    };

    tasks.push(newTask);
    
    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Failed to add task:", error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, completed } = await request.json();
    if (id === undefined || completed === undefined) {
      return NextResponse.json({ error: 'Missing id or completed status' }, { status: 400 });
    }

    const tasks = getTasks();
    const taskIndex = tasks.findIndex((t: any) => String(t.id) === String(id));
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasks[taskIndex].completed = completed;
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));

    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {
        // Body might be empty
      }
    }

    if (id === undefined || id === null) {
      return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
    }

    const tasks = getTasks();
    const taskIndex = tasks.findIndex((t: any) => String(t.id) === String(id));
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));

    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
