"use client";

import React, { useState } from "react";

interface Collaborator {
  email: string;
  _id?: string;
}

interface CollaboratorInputProps {
  collaborators: Collaborator[];
  setCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
}

export default function CollaboratorInput({
  collaborators,
  setCollaborators,
}: CollaboratorInputProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    addCollaborator();
  };

  const addCollaborator = () => {
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

    // Check if email is already in the list
    if (
      collaborators.some((c) => c.email.toLowerCase() === email.toLowerCase())
    ) {
      setError("This email is already added");
      return;
    }

    // Add to collaborators list
    setCollaborators([...collaborators, { email: email.trim() }]);
    setEmail("");
    setError("");

    // Show success message briefly
    const successElement = document.createElement("div");
    successElement.className = "text-xs text-green-600 mt-1";
    successElement.textContent = `Added ${email.trim()} as collaborator`;

    const container = document.querySelector("[data-collaborator-container]");
    if (container) {
      container.appendChild(successElement);
      setTimeout(() => {
        if (container.contains(successElement)) {
          container.removeChild(successElement);
        }
      }, 2000);
    }
  };

  const removeCollaborator = (emailToRemove: string) => {
    setCollaborators(collaborators.filter((c) => c.email !== emailToRemove));
  };

  return (
    <div className="mb-4" data-collaborator-container>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Collaborators
      </label>

      {error && (
        <div className="mb-2 p-2 bg-red-50 text-red-500 text-xs rounded">
          {error}
        </div>
      )}

      <div className="flex items-start space-x-2 mb-2">
        <div className="flex-grow">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCollaborator();
              }
            }}
            placeholder="Enter email address"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
          />
        </div>
        <button
          type="button"
          onClick={addCollaborator}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>

      {collaborators.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-2">Added collaborators:</p>
          <div className="flex flex-wrap gap-2">
            {collaborators.map((collaborator, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <span className="mr-1">{collaborator.email}</span>
                <button
                  type="button"
                  onClick={() => removeCollaborator(collaborator.email)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                  aria-label="Remove collaborator"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
