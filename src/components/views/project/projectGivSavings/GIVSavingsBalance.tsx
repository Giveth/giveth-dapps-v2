import React from 'react';
import {
	H5,
	IconHelpFilled16,
	P,
	Subline,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Flex } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

export const GIVSavingsBalance = () => {
	const { formatMessage } = useIntl();

	return (
		<Wrapper>
			<Flex gap='4px'>
				<Title>
					{formatMessage({
						id: 'component.givsavings_balance.title',
					})}
				</Title>
				<IconWithTooltip icon={<IconHelpFilled16 />} direction='bottom'>
					<GIVsavingsTooltip>ToDo</GIVsavingsTooltip>
				</IconWithTooltip>
			</Flex>
			<Balance>3.5 ETH</Balance>
			<USD>~$6,900</USD>
		</Wrapper>
	);
};
const Wrapper = styled.div`
	/* Primary/Giv/000 */

	background: ${neutralColors.gray[100]};
	/* Shadow/Neutral/400 */

	box-shadow: ${Shadow.Neutral[400]};
	border-radius: 8px;
	padding: 24px;
	width: fit-content;
`;

const Title = styled(Subline)``;

const Balance = styled(H5)``;

const USD = styled(P)`
	color: ${neutralColors.gray[700]};
`;

const GIVsavingsTooltip = styled.div``;
