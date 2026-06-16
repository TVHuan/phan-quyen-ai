import { AppModules } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import { Link, history } from 'umi';
import './style.less';

const HeaderContentPage = () => {
	return (
		<div className='header-content'>
			<img src='/logo.png' alt='logo' onClick={() => history.push('/')} />
			<div>
				<Link to='/'>{AppModules[currentRole].title.toLocaleUpperCase()}</Link>
			</div>
		</div>
	);
};

export default HeaderContentPage;
