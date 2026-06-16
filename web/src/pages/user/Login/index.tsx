import Footer from '@/components/Footer';
import { getUserInfo, authLogin } from '@/services/base/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authLogin(values);
      const accessToken = res.data?.data?.access_token || res.data?.access_token;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('token', accessToken);

      const info = await getUserInfo();
      setInitialState({
        ...initialState,
        currentUser: info.data?.data || info.data,
      });

      message.success('Đăng nhập thành công');
      history.push('/dashboard');
    } catch {
      message.error('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
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
              <div className={styles.title}>Phân Quyền AI</div>
              <div className={styles.desc}>Đăng nhập vào hệ thống</div>
            </div>

            <div className={styles.main}>
              <Form onFinish={handleLogin} layout='vertical'>
                <Form.Item
                  name='username'
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder='Tên đăng nhập'
                    size='large'
                  />
                </Form.Item>

                <Form.Item
                  name='password'
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='Mật khẩu'
                    size='large'
                  />
                </Form.Item>

                <Form.Item>
                  <Button type='primary' htmlType='submit' loading={loading} block size='large'>
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
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
