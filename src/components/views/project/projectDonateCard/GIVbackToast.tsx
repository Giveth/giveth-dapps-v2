import React from 'react';
import {
	brandColors,
	Caption,
	IconGIVBack,
	IconHelp,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import useDetectDevice from '@/hooks/useDetectDevice';

const GIVbackToast = () => {
	const { isTablet } = useDetectDevice();
	return (
		<Wrapper>
			<div>
				<IconGIVBack color={brandColors.giv[300]} size={24} />
			</div>
			<div>
				<Title>
					<Caption medium>GIVbacks</Caption>
					<IconWithTooltip
						icon={<IconHelp size={16} />}
						direction={isTablet ? 'left' : 'top'}
					>
						<Popup>
							When you donate to verified projects you qualify to
							receive GIV tokens. Through GIVbacks, GIV empowers
							donors with governance rights via the GIVgarden.
						</Popup>
					</IconWithTooltip>
				</Title>
				<Caption>You get GIVbacks by donating to this project.</Caption>
			</div>
		</Wrapper>
	);
};

const Popup = styled(Subline)`
	width: 246px;
`;

const Title = styled(Flex)`
	gap: 4px;
	align-items: center;
	margin-bottom: 4px;
`;

const Wrapper = styled.div`
	padding: 16px;
	background: white;
	border-radius: 8px;
	border: 1px solid ${brandColors.giv[300]};
	margin-top: 24px;
	color: ${brandColors.giv[300]};
	display: flex;
	gap: 16px;
	max-width: 420px;
`;

export default GIVbackToast;
