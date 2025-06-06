import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { useIsAuthenticated } from '@azure/msal-react';
// Import pages
import LoginPage from '../views/Login';
import DashboardDefault from '../views/Dashboard';
import DigitalRequest from '../views/digitalRequest';
import FileShareRequest from '../views/fileShareRequest';
import FireWallRequestComponent from '../views/fireWallRequest';
import MyList from '../views/MyList';
import SystemLogs from '../views/SystemLogs'
import Permissiondenied from '../component/error/403';
import useAzureData from '../service/getApiData';
import Loader from '../component/Loader/LoaderAndCheck';
import { ADMIN } from '../config.jsx';

const ThemeRoutes = () => {
  useAzureData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAuth = useIsAuthenticated();
  const getPath = localStorage.getItem('lastVisitedRoute');
  const getSend = localStorage.getItem('sendForm');
  const reload = localStorage.getItem('reload');
  const [landing, setLanding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const [isLoadingReload, setIsLoadingReload] = useState(false);
  const getSystemReload = localStorage.getItem('clearfilter');
  const code = localStorage.getItem('userCode');

  useEffect(() => { setIsAuthenticated(!!code || isAuth); }, [code, isAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else if (getPath === '/MyList' && isAuthenticated) {
      navigate('/MyList');
      localStorage.removeItem('lastVisitedRoute');
    } else if (getSend === 'sent' && isAuthenticated) {
      localStorage.setItem('openSnackbar', true);
      navigate('/MyList');
    } else if (reload === 'reload' && isAuthenticated) {
      navigate('/MyList');
      localStorage.removeItem('reload');
    } else if (getSystemReload === 'true') {
      navigate('/SystemLogs');
      localStorage.removeItem('clearfilter');
    }
    //Check reload page to show display loader
    if (window.performance) {
      if (performance.navigation.type === 1) {
        setIsLoadingReload(true);
        setTimeout(() => {
          setIsLoadingReload(false);
        }, 600)
      }
    }
    if (code && code.length > 6) {
      setLanding(true);
    }
    if ((code && code.length <= 6) || ADMIN[0].ADMINSYSTEM.includes(code)) {
      setLanding(false);
    }
    setIsLoading(!code ? true : false);
  }, [isAuthenticated, navigate, getPath, getSend, code, getSystemReload,reload]);

  if (isAuthenticated && isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Permission Denied */}
      {isAuthenticated && landing && (
        <Route path="*" element={<Permissiondenied />} />
      )}

      {/* Not Authenticated → Login */}
      {!isAuthenticated && (
        <Route path="/" element={isLoadingReload ? <Loader /> : <LoginPage />} />
      )}

      {/* Main Application Routes */}
      {isAuthenticated && !landing && (
        <>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard/default" />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard/default" element={<DashboardDefault />} />
            <Route path="/DigitalRequestForm" element={<DigitalRequest />} />
            <Route path="/DigitalRequestForm/:id" element={<DigitalRequest />} />
            <Route path="/FireWallRequestForm" element={<FireWallRequestComponent />} />
            <Route path="/FireWallRequestForm/:id" element={<FireWallRequestComponent />} />
            <Route path="/FileShareRequestForm" element={<FileShareRequest />} />
            <Route path="/Profile" element={<SystemLogs />} />
            <Route path="/MyList" element={<MyList location={location} />} />
          </Route>
        </>
      )}
    </Routes>
  );
};

export default ThemeRoutes;
