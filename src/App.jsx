import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Notfound from './Components/Notfound/Notfound';
import {HeroUIProvider} from "@heroui/react";
import CounterContextProvider from "./Context/CounterContext";
import Profile from './Components/Profile/Profile';
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import PostDetails from './Components/PostDetails/PostDetails';
import { ToastContainer } from "react-toastify";
import Offline from './Components/Offline/Offline';
import { useNetworkState } from "react-use";
import Setting from "./Components/Setting/Setting";
// import AuthProtectedRoutes from "./Components/AuthProtectedRoutes/AuthProtectedRoutes";
 

const router = createBrowserRouter ([
  {path : "" , element : <Layout /> ,children : [
    {index : true , element : (<ProtectedRoute> <Home /> </ProtectedRoute>)},
    {path : "home" , element : (<ProtectedRoute> <Home />  </ProtectedRoute>) },
    {path : "postdetails/:id" , element : (<ProtectedRoute> <PostDetails />  </ProtectedRoute>) },
    {path : "setting" , element : (<ProtectedRoute> <Setting />  </ProtectedRoute>) },
    {path : "profile" , element : (<ProtectedRoute>   <Profile />   </ProtectedRoute>)},
    {path : "register" , element :    <Register />   },
    {path : "login" , element :    <Login /> },
    // {path : "register" , element :  <AuthProtectedRoutes>  <Register />  </AuthProtectedRoutes>  },
    // {path : "login" , element :  <AuthProtectedRoutes>  <Login />  </AuthProtectedRoutes>},
    {path : "*" , element : <Notfound />},
  ] }
])

const query = new QueryClient();
export default function App() {
  const { online } = useNetworkState();
  
  return (
    <>
    {!online && <Offline />}
    <QueryClientProvider client={query}>
      <AuthContextProvider>
      <HeroUIProvider>
      <CounterContextProvider>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer />
      </CounterContextProvider>
    </HeroUIProvider>
    </AuthContextProvider>
    </QueryClientProvider>
    
    
    </>
  );
}
