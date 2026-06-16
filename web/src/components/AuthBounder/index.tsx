import { history, useModel } from 'umi';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

export const unCheckPermissionPaths = ['/user/login', '/user/register'];

const AuthBounder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialState } = useModel('@@initialState');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));
    
    // Simple check: if not on uncheck path and no token/currentUser, redirect to login
    const token = localStorage.getItem('access_token');
    if (!isUncheckPath && (!token || token === 'undefined')) {
      history.replace('/user/login');
    } else {
      setIsReady(true);
    }
  }, [initialState]);

  if (!isReady) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  return <>{children}</>;
};

export default AuthBounder;
