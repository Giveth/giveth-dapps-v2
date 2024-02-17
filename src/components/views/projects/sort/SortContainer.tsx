import { H5, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import ProjectsSortSelect from './ProjectsSortSelect';

interface ISortContainerProps {
	totalCount: number;
}

export const SortContainer: FC<ISortContainerProps> = ({ totalCount }) => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
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
		</Wrapper>
	);
};

const Title = styled(H5)`
	font-weight: 700;
	position: relative;

	span {
		color: ${neutralColors.gray[700]};
	}
`;

const Wrapper = styled(Flex)`
	justify-content: space-between;
	flex-direction: column;
	gap: 16px;
	align-items: stretch;
	${mediaQueries.tablet} {
		flex-direction: row;
		gap: 8px;
		align-items: center;
	}
`;
