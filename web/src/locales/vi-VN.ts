import global from './vi-VN/global';
import menu from './vi-VN/menu';
import modules from './vi-VN/modules';
import pages from './vi-VN/pages';

export default {
	'app.locale.image': 'vi-VN.svg',
	'app.locale.title': 'Tiếng Việt',
	...menu,
	...pages,
	...global,
	...modules
};
