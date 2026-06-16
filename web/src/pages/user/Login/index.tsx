import Footer from '@/components/Footer';
import { getUserInfo, verifyGoogleLogin } from '@/services/base/api';
import { message } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import styles from './index.less';

declare const APP_CONFIG_GOOGLE_CLIENT_ID: string;

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await verifyGoogleLogin({ token: idToken });
      const accessToken = res.data?.data?.access_token || res.data?.access_token;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('token', accessToken);

      const info = await getUserInfo(); // Lấy thông tin từ backend
      setInitialState({
        ...initialState,
        currentUser: info.data?.data || info.data,
      });

      message.success('Đăng nhập thành công');
      history.push('/dashboard');
    } catch (error) {
      message.error('Đăng nhập thất bại');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.leftPanel}>
          <img alt='logo' className={styles.logo} src='/logo-full.png' />
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.loginCard}>
            <div className={styles.header}>
              <div className={styles.desc}>Đăng nhập bằng tài khoản Google</div>
            </div>

            <div className={styles.main}>
              <GoogleOAuthProvider clientId={APP_CONFIG_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com'}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    message.error('Đăng nhập Google thất bại');
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.loginFooter}>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
