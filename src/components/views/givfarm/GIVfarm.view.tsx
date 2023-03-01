import { FarmProvider } from '@/context/farm.context';
import { GIVfarmBottom } from './GIVfarmBottom';
import { GIVfarmTop } from './GIVfarmTop';

function GIVfarmView() {
	return (
		<>
			<FarmProvider>
				<GIVfarmTop />
				<GIVfarmBottom />
			</FarmProvider>
		</>
	);
}

export default GIVfarmView;
