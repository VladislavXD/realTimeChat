import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { privateRoutes, publickRoutes } from '../routes';
import Loader from './loader/Loader';
import { Context } from '../main';
import { useAuthState } from 'react-firebase-hooks/auth';

const AppRouter = () => {
  const { auth } = useContext(Context);
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {user ? (
        privateRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))
      ) : (
        publickRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))
      )}
      <Route path="*" element={<Navigate to={user ? '/chat' : '/login/:chatId'} />} />
    </Routes>
  );
};

export default AppRouter;