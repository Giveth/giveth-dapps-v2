import { Flex } from '@giveth/ui-design-system';
import { ActiveProjectsSection } from './ActiveProjectsSection';
import { ActiveStreamsSection } from './ActiveStreamsSection';
import { useUserStreams } from '@/hooks/useUserStreams';

export const RecurringTab = () => {
	const { tokenStreams } = useUserStreams();
	return (
		<Flex $flexDirection='column' gap='24px'>
			<ActiveStreamsSection tokenStreams={tokenStreams} />
			<ActiveProjectsSection />
		</Flex>
	);
};
