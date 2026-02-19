
import React, { Suspense, lazy } from "react";
import { UserProvider } from './components/providers/UserProvider';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Project = lazy(() => import("./pages/Project"));
const Signup = lazy(() => import("./pages/Signup"));

import { Toaster } from "sonner";
import { useUser } from "./components/providers/UserProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: (
        <PublicRoute>
          <Suspense fallback={<div />}> <Home /> </Suspense>
        </PublicRoute>
      ) },
      { path: "login", element: (
        <PublicRoute>
          <Suspense fallback={<div />}> <Login /> </Suspense>
        </PublicRoute>
      ) },
      { path: "signup", element: (
        <PublicRoute>
          <Suspense fallback={<div />}> <Signup /> </Suspense>
        </PublicRoute>
      ) },
      { path: "dashboard", element: (
        <ProtectedRoute>
          <Suspense fallback={<div />}> <Dashboard /> </Suspense>
        </ProtectedRoute>
      ) },
      { path: "project/:id", element: (
        <ProtectedRoute>
          <Suspense fallback={<div />}> <Project /> </Suspense>
        </ProtectedRoute>
      ) },
    ]
  }
]);


function App() {
  return (
    <UserProvider>
      <Toaster richColors position="top-center" />
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;