import { TabPowerTop, TabPowerBottom } from '../homeTabs/GIVpower';
import GIVpowerVideo from '@/components/homeTabs/GIVpowerVideo';

export default function GIVpowerView() {
	return (
		<>
			<TabPowerTop />
			<GIVpowerVideo />
			<TabPowerBottom />
		</>
	);
}
