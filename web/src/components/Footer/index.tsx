import { landingUrl, unitName } from '@/services/base/constant';
import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

export default () => {
	const intl = useIntl();

	return (
		<DefaultFooter
			links={[
				{
					key: 'link',
					title: `${intl.formatMessage({ id: unitName }).toUpperCase()} - ${APP_CONFIG_APP_VERSION}`,
					href: landingUrl,
					blankTarget: true,
				},
			]}
			copyright={false}
			style={{ width: '100%' }}
		/>
	);
};
