"use client";

import React, { useState } from "react";
import { Task } from "../redux/slices/taskSlice";
import TaskCard from "./TaskCard";
import EditTaskModal from "./EditTaskModal";

interface TaskListProps {
  tasks: Task[];
  filter: string;
}

export default function TaskList({ tasks, filter }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter tasks based on the active tab
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      // Handle null due dates
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return sortOrder === "asc" ? 1 : -1;
      if (!b.dueDate) return sortOrder === "asc" ? -1 : 1;

      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortBy === "priority") {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      const priorityA =
        priorityValues[a.priority as keyof typeof priorityValues] || 0;
      const priorityB =
        priorityValues[b.priority as keyof typeof priorityValues] || 0;
      return sortOrder === "asc"
        ? priorityA - priorityB
        : priorityB - priorityA;
    }

    // Default sort by createdAt
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const toggleSort = (field: "dueDate" | "priority" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc"); // Default to descending when changing sort field
    }
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No tasks found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {filter === "all"
            ? "Get started by creating a new task."
            : `You don't have any ${
                filter === "todo"
                  ? "to-do"
                  : filter === "in-progress"
                  ? "in-progress"
                  : "completed"
              } tasks.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort controls */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Sort by:</span>
          <button
            onClick={() => toggleSort("createdAt")}
            className={`px-2 py-1 rounded ${
              sortBy === "createdAt"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            Date Created{" "}
            {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => toggleSort("dueDate")}
            className={`px-2 py-1 rounded ${
              sortBy === "dueDate"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            Due Date {sortBy === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => toggleSort("priority")}
            className={`px-2 py-1 rounded ${
              sortBy === "priority"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            Priority{" "}
            {sortBy === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={handleEditTask} />
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
