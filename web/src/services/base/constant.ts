import type { ColorType, Login } from './typing';

export enum EModuleKey {
	BASE = 'ai-mo-phong',
}

export const AppModules: Record<EModuleKey, Login.TModule> = {
	[EModuleKey.BASE]: {
		title: `AI Study Simulator`,
		clientId: '',
		url: '/',
		icon: EModuleKey.BASE + '.svg',
	},
};

export const landingUrl = '/';

/** Official Colors */
export const officialColors = {
	official100: '#C72127', // đỏ
	official200: '#35426E', // xanh dương đậm
	official300: '#134D8B', // xanh dương
	official500: '#F4F9FF', // xanh dương nhạt
} as const;

/** Accent Colors */
export const accentColors = {
	accent100: '#0087C3', // xanh dương
	accent200: '#4890BD', // xanh dương nhạt
	accent300: '#A7C4D2', // xanh xám nhạt
	accent400: '#5CC6D0', // xanh ngọc
	accent500: '#D2AE6D', // vàng nâu
	accent600: '#D2D3D5', // xám nhạt
	accent700: '#F4F4F4', // xám rất nhạt
	accent800: '#F8F8F8', // trắng xám
} as const;

/** Text Colors */
export const textColors = {
	text100: '#2E2E2E', // đen xám
	text200: '#818181', // xám
	text300: '#CFCFCF', // xám nhạt
	text400: '#FFFFFF', // trắng
} as const;

/** Status Colors */
export const statusColors = {
	status100: '#329323', // xanh lá
	status200: '#0E50CF', // xanh dương
	status300: '#CE7C1E', // cam/nâu
	status400: '#C80F1F', // đỏ
	status500: '#491F9D', // tím
	status600: '#0F8D91', // xanh ngọc
} as const;

/** Status Background Colors */
export const statusBgColors = {
	statusBg100: '#F5FFEB', // xanh lá nhạt
	statusBg200: '#E2F2FE', // xanh dương nhạt
	statusBg300: '#FFFAE4', // cam nhạt
	statusBg400: '#FFEFEE', // đỏ nhạt
	statusBg500: '#F8EEFE', // tím nhạt
	statusBg600: '#E2FFFB', // xanh ngọc nhạt
} as const;

/** Màu sắc nổi bật */
export const highlightColor = officialColors.official100;

/** Màu sắc chủ đạo */
export const primaryColor = officialColors.official300;

/** Tên trường Học viện */
export const unitName = 'config.ten-truong';

/** Cơ quan chủ quản của trường */
export const coQuanChuQuan = 'config.co-quan-chu-quan';

/** Trường / Học viện */
export const unitPrefix = 'config.tien-to-truong';

/** Tên tiếng anh của trường */
export const tenTruongVietTatTiengAnh = APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH;

/** Cài đặt hệ thống */
export enum ESettingKey {
	KEY = 'KEY',
}

/** Định dạng file */
export enum EDinhDangFile {
	WORD = 'word',
	EXCEL = 'excel',
	POWERPOINT = 'powerpoint',
	PDF = 'pdf',
	IMAGE = 'image',
	VIDEO = 'video',
	AUDIO = 'audio',
	TEXT = 'text',
	UNKNOWN = 'unknown',
}

export enum EScopeFile {
	PUBLIC = 'Public',
	INTERNAL = 'Internal',
	PRIVATE = 'Private',
}

export enum EStorageFile {
	DATABASE = 'Database',
	S3 = 'S3',
}

/** Tên các màu mặc định của Tag's antd */
export enum ETagColor {
	MAGENTA = 'magenta',
	RED = 'red',
	VOLCANO = 'volcano',
	ORANGE = 'orange',
	GOLD = 'gold',
	YELLOW = 'yellow',
	LIME = 'lime',
	GREEN = 'green',
	CYAN = 'cyan',
	BLUE = 'blue',
	GEEKBLUE = 'geekblue',
	PURPLE = 'purple',
	DEFAULT = 'default',
}

/** Mapping từ màu tag antd sang color code */
export const colorList: { [key in keyof typeof ETagColor]: ColorType } = {
	MAGENTA: { name: 'magenta', hexColor: '#eb2f96' },
	RED: { name: 'red', hexColor: statusColors.status400 },
	VOLCANO: { name: 'volcano', hexColor: '#fa541c' },
	ORANGE: { name: 'orange', hexColor: statusColors.status300 },
	GOLD: { name: 'gold', hexColor: '#faad14' },
	YELLOW: { name: 'yellow', hexColor: '#fadb14' },
	LIME: { name: 'lime', hexColor: '#a0d911' },
	GREEN: { name: 'green', hexColor: statusColors.status100 },
	CYAN: { name: 'cyan', hexColor: '#13c2c2' },
	BLUE: { name: 'blue', hexColor: statusColors.status200 },
	GEEKBLUE: { name: 'geekblue', hexColor: '#2f54eb' },
	PURPLE: { name: 'purple', hexColor: statusColors.status500 },
	DEFAULT: { name: 'default', hexColor: statusColors.status600 },
};
