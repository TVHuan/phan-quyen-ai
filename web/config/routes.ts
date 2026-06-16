export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
		],
	},

	// GROUP TITLE
	// {
	// 	name: 'DashboardGroup',
	// 	path: '/__group__/dashboard',
	// 	disabled: true,
	// },

	///////////////////////////////////

	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
		maChucNang: 'dashboard|xem',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	// QUẢN LÝ PHÂN QUYỀN
	{
		name: 'Quản lý phân quyền',
		path: '/quan-ly-phan-quyen',
		icon: 'SafetyCertificateOutlined',
		maChucNang: 'phanquyen|xem',
		listChucNang: ['phanquyen|quanly', 'phanquyen|xem'],
		routes: [
			{
				name: 'Hệ thống',
				path: '/quan-ly-phan-quyen/he-thong',
				component: './QuanLyPhanQuyen/PhanHe',
				maChucNang: 'phanhe|xem',
			},
			{
				name: 'Chức năng',
				path: '/quan-ly-phan-quyen/chuc-nang',
				component: './QuanLyPhanQuyen/ChucNang',
				maChucNang: 'chucnang|xem',
			},
			{
				name: 'Vai trò',
				path: '/quan-ly-phan-quyen/vai-tro',
				component: './QuanLyPhanQuyen/VaiTro',
				maChucNang: 'vaitro|xem',
			},
		],
	},

	// // DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/*',
		component: './exception/404',
		layout: false,
	},
];
