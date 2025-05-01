import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import NavBar from './component/navBar';
import HomePage from './pages/homePage';
import SignupPage from './pages/signupPage';
import LoginPage from './pages/loginPage';
import SettingsPage from './pages/settingsPage';
import ProfilePage from './pages/profilePage';
import ErrorPage from './pages/errorPage';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';
import {Toaster} from 'react-hot-toast';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser })

  // if (!isCheckingAuth && !authUser) return (
  //   <div className='flex items-center justify-center h-screen'>
  //     <Loader className='size-10 animate-spin' />
  //   </div>
  // )
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to = "/login"/>} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to = "/"/>} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to = "/"/>} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to = "/login"/>} />
        <Route path='/*' element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
