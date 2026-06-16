import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

// Ip Chính => Mặc định dùng trong các useInitModel
const ip3 = ipRoot; // ip dev

// Ip khác (Giữ lại nếu sau này backend mở rộng, hiện tại trỏ chung về ipRoot)
const ipNotif = ipRoot; // ip dev
const ipSlink = ipRoot; // ip dev
const ipCore = ipRoot; // ip dev

const currentRole = EModuleKey.BASE;

const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;

export {
	currentRole,
	ip3,
	ipCore,
	ipNotif,
	ipSlink,
	oneSignalClient,
	sentryDSN,
};
