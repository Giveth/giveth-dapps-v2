import { Flex } from '@/components/styled-components/Flex';
import { ActiveProjectsSection } from './ActiveProjectsSection';
import { ActiveStreamsSection } from './ActiveStreamsSection';

export const RecurringTab = () => {
	return (
		<Flex flexDirection='column' gap='24px'>
			<ActiveStreamsSection />
			<ActiveProjectsSection />
		</Flex>
	);
};
