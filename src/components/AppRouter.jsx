import React, {  useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { privateRoutes, publickRoutes } from '../routes'
import Loader from './loader/Loader'
import { Context } from '../main'
import { useAuthState } from 'react-firebase-hooks/auth';


const AppRouter = () => {
  const {auth} = useContext(Context)
  const [user, loading, error] = useAuthState(auth)


  
  
  
  if (loading) {
    return <Loader />; // Показать лоадер во время проверки состояния
  }
  return (
      <Routes>
        {
          user  ?
            privateRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))

            :
            publickRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))
        }
        <Route path='*' element={<Navigate to={user ? '/chat' : '/login'} />} />

      </Routes>


  )
}

export default AppRouter