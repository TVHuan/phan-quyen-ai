import Footer from '@/components/Footer';
import { default as GlobalHeaderRight, default as RightContent } from '@/components/RightContent';
import { PageContainer } from '@ant-design/pro-components';
import '@ant-design/v5-patch-for-react-19';
import { App } from 'antd';
import 'dayjs/locale/vi';
import React from 'react'; // Bổ sung import React
import type { RunTimeLayoutConfig } from 'umi';
import { getIntl, history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import ErrorBoundary from './components/ErrorBoundary';
import AuthBounder, { unCheckPermissionPaths } from './components/AuthBounder';

import OneSignalBounder from './components/OneSignalBounder';
import HeaderContentPage from './components/RightContent/Header';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import ConfigBounder from './components/TechnicalSupportBounder/ConfigBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { AppModules } from './services/base/constant';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';
import { getUserInfo } from '@/services/base/api';



export function rootContainer(container: React.ReactNode) {
	return (
		<ConfigBounder>
			<App>{container}</App>
		</ConfigBounder>
	);
}

export async function getInitialState(): Promise<IInitialState> {
	const initialState: IInitialState = {
		settings: defaultSettings,
		permissionLoading: true,
	};
	try {
		const raw = sessionStorage.getItem('initialState');
		if (raw) {
			const { authorizedPermissions } = JSON.parse(raw) as Partial<IInitialState>;
			Object.assign(initialState, { authorizedPermissions });
		}
	} catch (e) { }

	const token = localStorage.getItem('token');
	if (token && token !== 'undefined') {
		try {
			const info = await getUserInfo();
			initialState.currentUser = info.data?.data || info.data;
		} catch (error) {
			console.error('Failed to get user info in getInitialState', error);
			localStorage.removeItem('token');
			localStorage.removeItem('access_token');
			history.replace('/user/login');
		}
	}

	return initialState;
}

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	const intl = getIntl();
	return {
		unAccessible: (
			<AuthBounder>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</AuthBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		headerContentRender: () => <HeaderContentPage />,
		disableContentMargin: true,

		footerRender: () => <Footer />,

		onPageChange: () => {
			if (initialState?.currentUser) {
				const { location } = history;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

				if (location.pathname === '/') {
					history.replace('/dashboard');
				} else if (
					!isUncheckPath &&
					currentRole &&
					initialState?.authorizedPermissions?.length &&
					!initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
				) {
					history.replace('/403');
				}
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => {
			const content = (
				<AuthBounder>
					<ErrorBoundary>
						<TechnicalSupportBounder>
							<OneSignalBounder>{dom}</OneSignalBounder>
						</TechnicalSupportBounder>
					</ErrorBoundary>
				</AuthBounder>
			);

			if (initialState?.settings?.layout === 'side') {
				return (
					<PageContainer
						ghost
						breadcrumbRender={false}
						title={false}
						extra={<GlobalHeaderRight />}
						header={{}}
					>
						{content}
					</PageContainer>
				);
			}

			return content;
		},

		title: AppModules[currentRole].title,
		...initialState?.settings,
	};
};
