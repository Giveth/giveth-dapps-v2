import {
	H5,
	mediaQueries,
	neutralColors,
	Flex,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import ProjectsSortSelect from './ProjectsSortSelect';
import { useProjectsContext } from '@/context/projects.context';

interface ISortContainerProps {
	totalCount: number;
}

export const SortContainer: FC<ISortContainerProps> = ({ totalCount }) => {
	const { formatMessage } = useIntl();
	const { isCauses } = useProjectsContext();
	return (
		<Wrapper>
			<Title>
				{formatMessage({
					id: isCauses
						? 'label.causes'
						: 'page.projects.title.explore',
				})}
				<span>
					{' '}
					{totalCount}{' '}
					{formatMessage({
						id: isCauses
							? 'label.causes'
							: 'page.projects.title.projects',
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
	margin-top: 24px;
	${mediaQueries.tablet} {
		flex-direction: row;
		gap: 8px;
		align-items: center;
	}
`;
