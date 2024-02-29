import { Flex } from '@giveth/ui-design-system';
import { ActiveProjectsSection } from './ActiveProjectsSection';
import { ActiveStreamsSection } from './ActiveStreamsSection';

export const RecurringTab = () => {
	return (
		<Flex $flexDirection='column' gap='24px'>
			<ActiveStreamsSection />
			<ActiveProjectsSection />
		</Flex>
	);
};
