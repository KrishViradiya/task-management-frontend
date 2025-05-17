"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "../redux/store";
import { adminAPI } from "../services/api";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  permissions: {
    createTask: boolean;
    updateAnyTask: boolean;
    deleteAnyTask: boolean;
    assignTask: boolean;
    viewAllTasks: boolean;
    manageUsers: boolean;
  };
  createdAt: string;
}

export default function UserManagement() {
  const { user } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await adminAPI.updateUserRole(userId, role);

      // Update the users list with the updated user
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, ...response.data.user } : user
        )
      );

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user role");
      console.error("Error updating user role:", err);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: any) => {
    try {
      const response = await adminAPI.updateUserPermissions(
        userId,
        permissions
      );

      // Update the users list with the updated user
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, ...response.data.user } : user
        )
      );

      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update user permissions"
      );
      console.error("Error updating user permissions:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);

      // Remove the deleted user from the list
      setUsers(users.filter((user) => user._id !== userId));

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleRoleChange = (userId: string, role: string) => {
    updateUserRole(userId, role);
  };

  const handlePermissionChange = (
    userId: string,
    permission: string,
    value: boolean
  ) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const updatedPermissions = {
      ...user.permissions,
      [permission]: value,
    };

    updateUserPermissions(userId, updatedPermissions);
  };

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Username</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Role</th>
                <th className="py-2 px-4 border-b text-left">Permissions</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="space-y-1">
                      {Object.entries(user.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${user._id}-${key}`}
                            checked={value}
                            onChange={(e) =>
                              handlePermissionChange(
                                user._id,
                                key,
                                e.target.checked
                              )
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`${user._id}-${key}`}
                            className="text-sm"
                          >
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
