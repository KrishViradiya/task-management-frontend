"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../redux/store";
import UserManagement from "../../components/UserManagement";
import Navbar from "../../components/Navbar";
import { Suspense } from "react";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <Suspense fallback={<div>Loading user management...</div>}>
              <UserManagement />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}