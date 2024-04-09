import { Container, Flex, H6, neutralColors } from '@giveth/ui-design-system';
import { type FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

export enum EQFPageStatus {
	ACTIVE = 'label.active_round',
	ARCHIVED = 'label.archived_rounds',
}

interface IQFHeaderProps {
	status: EQFPageStatus;
}

export const QFHeader: FC<IQFHeaderProps> = ({ status }) => {
	const { formatMessage } = useIntl();

	return (
		<Container>
			<Wrapper>
				<Flex gap='24px'>
					<Item active={status === EQFPageStatus.ACTIVE}>
						{formatMessage({ id: EQFPageStatus.ACTIVE })}
					</Item>
					<Item active={status === EQFPageStatus.ARCHIVED}>
						{formatMessage({ id: EQFPageStatus.ARCHIVED })}
					</Item>
				</Flex>
			</Wrapper>
		</Container>
	);
};

const Item = styled(H6)<{ active: boolean }>`
	padding: 12px 16px 8px 16px;
	cursor: pointer;
	border-bottom-color: ${neutralColors.gray[500]};
	border-bottom-style: solid;
	border-bottom-width: ${({ active }) => (active ? '4px' : '0')};
`;

const Wrapper = styled(Flex)`
	margin-bottom: 24px;
`;
