"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-blue-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-white">TaskFlow</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              
              {user && user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated && (
              <>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center text-white font-medium text-lg shadow-inner">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 text-white text-sm">
                      {user?.username}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 border border-blue-300 text-blue-300 rounded-md text-sm font-medium hover:bg-blue-800"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${showMobileMenu ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${showMobileMenu ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${showMobileMenu ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className="text-white hover:bg-blue-800 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setShowMobileMenu(false)}
          >
            Dashboard
          </Link>
          
          {user && user.role === "admin" && (
            <Link
              href="/admin"
              className="text-white hover:bg-blue-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Admin
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-blue-800">
          <div className="flex items-center px-5">
            <div className="h-8 w-8 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center text-white font-medium text-lg shadow-inner">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">
                {user?.username}
              </div>
              <div className="text-sm font-medium text-blue-200">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}