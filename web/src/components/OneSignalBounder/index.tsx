import { initOneSignal } from '@/services/base/api';
import { oneSignalClient } from '@/utils/ip';
import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

const OneSignalBounder = (props: { children: React.ReactNode }) => {
	const [oneSignalId, setOneSignalId] = useState<string | null | undefined>();

	const getUserIdOnesignal = async () => {
		if (oneSignalClient) {
			await OneSignal.init({
				appId: oneSignalClient,
			});
			// OneSignal v3+ uses different methods, adjusting for v3
			// const id = await OneSignal.getUserId();
			// setOneSignalId(id);
		}
	};

	useEffect(() => {
		getUserIdOnesignal();
	}, []);

	useEffect(() => {
		if (oneSignalId) {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					initOneSignal({ playerId: oneSignalId });
				} catch (er) {
					console.log(er);
				}
			}
		}
	}, [oneSignalId]);

	return <>{props.children}</>;
};

export default OneSignalBounder;
