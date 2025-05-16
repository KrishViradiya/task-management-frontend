"use client";

import React, { useState } from "react";
import { useAppDispatch } from "../redux/store";
import { updateTask, deleteTask } from "../redux/slices/taskSlice";
import { Task } from "../redux/slices/taskSlice";
import CollaboratorInvite from "./CollaboratorInvite";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const [showActions, setShowActions] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const handleStatusChange = async (
    newStatus: "todo" | "in-progress" | "completed"
  ) => {
    try {
      await dispatch(
        updateTask({
          id: task._id,
          taskData: { ...task, status: newStatus },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(task._id)).unwrap();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining until due date
  const getDaysRemaining = () => {
    if (!task.dueDate) return null;

    const today = new Date();
    const dueDate = new Date(task.dueDate);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  // Determine priority badge color
  const getPriorityBadgeColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Determine status badge color
  const getStatusBadgeColor = () => {
    switch (task.status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return (
          <svg
            className="h-4 w-4 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "in-progress":
        return (
          <svg
            className="h-4 w-4 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-4 w-4 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z" />
          </svg>
        );
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-5">
        {/* Status indicator at the top */}
        <div className="flex justify-between items-center mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor()}`}
          >
            {getStatusIcon()}
            {task.status === "todo"
              ? "To Do"
              : task.status === "in-progress"
              ? "In Progress"
              : "Completed"}
          </span>

          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(task)}
              className={`p-1 rounded-full text-gray-400 hover:text-blue-500 transition-colors duration-150 ${
                showActions ? "opacity-100" : "opacity-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className={`p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-150 ${
                showActions ? "opacity-100" : "opacity-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Title and description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {task.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>

        {/* Tags and badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadgeColor()}`}
          >
            {task.priority === "high" && (
              <svg
                className="h-3 w-3 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          {task.dueDate && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                daysRemaining !== null && daysRemaining < 0
                  ? "bg-red-100 text-red-800 border-red-200"
                  : daysRemaining !== null && daysRemaining <= 2
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-purple-100 text-purple-800 border-purple-200"
              }`}
            >
              <svg
                className="h-3 w-3 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {daysRemaining !== null && daysRemaining < 0
                ? `Overdue by ${Math.abs(daysRemaining)} day${
                    Math.abs(daysRemaining) !== 1 ? "s" : ""
                  }`
                : daysRemaining !== null && daysRemaining === 0
                ? "Due today"
                : daysRemaining !== null && daysRemaining === 1
                ? "Due tomorrow"
                : daysRemaining !== null
                ? `Due in ${daysRemaining} days`
                : `Due: ${formatDate(task.dueDate)}`}
            </span>
          )}
        </div>

        {/* Collaborators section */}
        {task.collaborators && task.collaborators.length > 0 && (
          <div className="mb-4">
            <div
              className="flex items-center text-xs text-gray-500 mb-2 cursor-pointer hover:text-gray-700"
              onClick={() => setShowCollaborators(!showCollaborators)}
            >
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Collaborators ({task.collaborators.length})
              <svg
                className={`h-4 w-4 ml-1 transform transition-transform ${
                  showCollaborators ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {showCollaborators && (
              <div className="flex flex-wrap gap-1 mb-2">
                {task.collaborators.map((collaborator, index) => (
                  <div
                    key={collaborator._id || index}
                    className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                  >
                    <span className="h-4 w-4 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-medium mr-1 text-[10px]">
                      {collaborator.username?.charAt(0).toUpperCase()}
                    </span>
                    <span>{collaborator.username}</span>
                  </div>
                ))}

                <button
                  onClick={() => setShowInvite(!showInvite)}
                  className="flex items-center bg-gray-50 text-gray-500 hover:text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  <svg
                    className="h-3 w-3 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Invite
                </button>
              </div>
            )}

            {showInvite && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <CollaboratorInvite taskId={task._id} />
              </div>
            )}
          </div>
        )}

        {/* If no collaborators, show invite button */}
        {(!task.collaborators || task.collaborators.length === 0) && (
          <div className="mb-4">
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="flex items-center text-xs text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Add collaborators
            </button>

            {showInvite && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <CollaboratorInvite taskId={task._id} />
              </div>
            )}
          </div>
        )}

        {/* Footer with creation date and status change buttons */}
        <div className="border-t border-gray-100 pt-3 mt-auto">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <svg
                className="h-3 w-3 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Created: {formatDate(task.createdAt)}
            </div>

            <div
              className={`flex space-x-1 transition-opacity duration-200 ${
                showActions ? "opacity-100" : "opacity-0"
              }`}
            >
              {task.status !== "todo" && (
                <button
                  onClick={() => handleStatusChange("todo")}
                  className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150"
                >
                  To Do
                </button>
              )}
              {task.status !== "in-progress" && (
                <button
                  onClick={() => handleStatusChange("in-progress")}
                  className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-150"
                >
                  In Progress
                </button>
              )}
              {task.status !== "completed" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors duration-150"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
