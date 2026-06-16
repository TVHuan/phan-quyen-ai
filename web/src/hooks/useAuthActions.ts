// import { currentRole } from '@/utils/ip';

import OneSignal from 'react-onesignal';
import { useModel } from 'umi';

export const useAuthActions = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const handleLogout = () => {
		try {
			OneSignal.logout();
		} catch (e) {
			console.log('OneSignal logout error', e);
		}

		sessionStorage.clear();
		localStorage.clear();
		setInitialState({ ...initialState, currentUser: undefined });
		window.location.href = '/user/login';
	};

	const handleLogin = () => {
		window.location.href = '/user/login';
	};

	return {
		dangXuat: handleLogout,
		dangNhap: handleLogin,
		isLoading: false,
	};
};
