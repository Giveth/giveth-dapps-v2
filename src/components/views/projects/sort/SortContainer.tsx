import { Title } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import ProjectsSortSelect from './ProjectsSortSelect';
import useDetectDevice from '@/hooks/useDetectDevice';

interface ISortContainerProps {
	totalCount: number;
}

export const SortContainer: FC<ISortContainerProps> = ({ totalCount }) => {
	const { formatMessage } = useIntl();
	const { isTablet, isMobile } = useDetectDevice();

	return (
		<Flex
			justifyContent='space-between'
			flexDirection={isMobile ? 'column' : 'row'}
			gap={isMobile ? '16px' : undefined}
			alignItems={isMobile ? 'stretch' : 'center'}
		>
			<Title>
				{formatMessage({
					id: 'page.projects.title.explore',
				})}
				<span>
					{' '}
					{totalCount}{' '}
					{formatMessage({
						id: 'page.projects.title.projects',
					})}
				</span>
			</Title>
			<ProjectsSortSelect />
		</Flex>
	);
};
