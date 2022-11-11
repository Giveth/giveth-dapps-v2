import React from 'react';
import {
	brandColors,
	Caption,
	IconGIVBack,
	IconHelpFilled16,
	Subline,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import useDetectDevice from '@/hooks/useDetectDevice';

const GIVbackToast = () => {
	const { isTablet } = useDetectDevice();
	const { formatMessage } = useIntl();

	return (
		<Wrapper>
			<div>
				<IconGIVBack color={brandColors.giv[300]} size={24} />
			</div>
			<div>
				<Title>
					<Caption medium>
						{formatMessage({ id: 'label.givback_eligible' })}
					</Caption>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction={isTablet ? 'left' : 'top'}
					>
						<Popup>
							{formatMessage({
								id: 'component.givback_elibible.desc',
							})}
						</Popup>
					</IconWithTooltip>
				</Title>
				<Caption>
					{formatMessage({ id: 'component.givback_toast.desc' })}
				</Caption>
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
