import { Flex } from '@giveth/ui-design-system';
import { ActiveProjectsSection } from './ActiveProjectsSection';
import { ActiveStreamsSection } from './ActiveStreamsSection';
import { useProfileContext } from '@/context/profile.context';

export const RecurringTab = () => {
	const { myAccount } = useProfileContext();
	return (
		<Flex $flexDirection='column' gap='24px'>
			{myAccount && <ActiveStreamsSection />}
			<ActiveProjectsSection />
		</Flex>
	);
};
