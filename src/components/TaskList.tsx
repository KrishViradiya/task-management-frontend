'use client';

import React, { useState } from 'react';
import { Task } from '../redux/slices/taskSlice';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';

interface TaskListProps {
  tasks: Task[];
  filter: string;
}

export default function TaskList({ tasks, filter }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Filter tasks based on the active tab
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };
  
  if (filteredTasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {filter === 'all' 
            ? 'Get started by creating a new task.' 
            : `You don't have any ${filter === 'todo' ? 'to-do' : filter === 'in-progress' ? 'in-progress' : 'completed'} tasks.`}
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onEdit={handleEditTask} 
          />
        ))}
      </div>
      
      <EditTaskModal 
        isOpen={isEditModalOpen} 
        onClose={closeEditModal} 
        task={editingTask} 
      />
    </div>
  );
}