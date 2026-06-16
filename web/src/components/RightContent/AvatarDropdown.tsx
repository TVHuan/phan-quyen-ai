import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Spin } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { history, useIntl, useModel } from 'umi';
import styles from './index.less';

const AvatarDropdown = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');

	const loginOut = () => {
		localStorage.clear();
		history.push('/user/login');
		window.location.reload();
	};

	if (!initialState || !initialState.currentUser)
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />
			</span>
		);

	const c = initialState.currentUser;
	const firstLast = `${c?.lastName ?? ''} ${c?.firstName ?? ''}`.trim();
	const familyGiven = `${c?.family_name ?? ''} ${c?.given_name ?? ''}`.trim();
	let fullName = firstLast || familyGiven || c?.name || c?.preferred_username || c?.email || '';
	if (fullName === 'Admin' || fullName === 'Administrator') {
		fullName = '';
	}
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const items: ItemType[] = [
		...(fullName ? [{
			key: 'name',
			icon: <UserOutlined />,
			label: fullName,
		},
		{ type: 'divider', key: 'divider' }] : []) as ItemType[],
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: intl.formatMessage({ id: 'app.header.logout', defaultMessage: 'Đăng xuất' }),
			onClick: loginOut,
			danger: true,
		},
	];

	return (
		<>
			<Dropdown menu={{ items }}>
				<span className={`${styles.action} ${styles.account}`}>
					<div className={styles.avatarWrapper}>
						<Avatar
							className={styles.avatar}
							src={initialState.currentUser?.picture || undefined}
							icon={!initialState.currentUser?.picture ? (lastNameChar ?? <UserOutlined />) : undefined}
							alt='avatar'
						/>
					</div>
					{fullName && <span className={`${styles.name}`}>{fullName}</span>}
				</span>
			</Dropdown>
		</>
	);
};

export default AvatarDropdown;
