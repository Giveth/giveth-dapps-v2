import { GeneralMetatags } from '@/components/Metatag';
import SupportIndex from '@/components/views/support/SupportIndex';
import { supportMetatags } from '@/content/metatags';

const SupportRoute = () => {
	return (
		<>
			<GeneralMetatags info={supportMetatags} />
			<SupportIndex />
		</>
	);
};

export default SupportRoute;
