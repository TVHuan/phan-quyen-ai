import {
	oneSignalClient,
	sentryDSN,
} from './ip';

export const excludedPaths = [
	sentryDSN,
	oneSignalClient,
].filter(Boolean);
