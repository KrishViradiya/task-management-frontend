"use client";

import React, { useState } from "react";
import { useAppDispatch } from "../redux/store";
import { inviteCollaborator } from "../redux/slices/taskSlice";
import { Collaborator } from "../redux/slices/taskSlice";

interface CollaboratorInviteProps {
  taskId: string;
  collaborators?: Collaborator[];
}

export default function CollaboratorInvite({
  taskId,
  collaborators = [],
}: CollaboratorInviteProps) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if email is already a collaborator
    const isAlreadyCollaborator = collaborators.some(
      (collaborator) => collaborator.email.toLowerCase() === email.toLowerCase()
    );

    if (isAlreadyCollaborator) {
      setError("This user is already a collaborator on this task");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await dispatch(
        inviteCollaborator({ taskId, email: email.trim() })
      ).unwrap();

      setSuccess(`Invitation sent to ${email.trim()}`);
      setEmail("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      // Handle specific error cases
      if (
        error.message &&
        error.message.includes("User with this email not found")
      ) {
        setError(`No registered user found with email: ${email.trim()}`);
      } else {
        setError(error.message || "Failed to invite collaborator");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        Invite Collaborator
      </h3>

      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-500 text-xs rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 p-2 bg-green-50 text-green-500 text-xs rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleInvite} className="flex items-start space-x-2">
        <div className="flex-grow">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Inviting..." : "Invite"}
        </button>
      </form>

      {collaborators.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">
            Current Collaborators
          </h4>
          <div className="flex flex-wrap gap-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator._id}
                className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-2">
                  {collaborator.username.charAt(0).toUpperCase()}
                </span>
                <span>{collaborator.username}</span>
                <span className="text-blue-500 text-xs ml-1">
                  ({collaborator.email})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
