import React, { useState } from 'react';
import {
	brandColors,
	Caption,
	IconGIVBack,
	IconHelp,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import useDetectDevice from '@/hooks/useDetectDevice';

const GIVbackToast = () => {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const { isMobile } = useDetectDevice();
	const togglePopup = () => setIsPopupOpen(!isPopupOpen);

	return (
		<Wrapper>
			<div>
				<IconGIVBack color={brandColors.giv[300]} size={24} />
			</div>
			<div>
				<Title>
					<Caption medium>GIVback eligible</Caption>
					<Help onClick={togglePopup}>
						<IconHelp size={16} />
						<Popup isMobile={isMobile} show={isPopupOpen}>
							When you donate to verified projects you qualify to
							receive GIV tokens. Through GIVbacks, GIV empowers
							donors with governance rights via the GIVgarden.
						</Popup>
					</Help>
				</Title>
				<Caption>You get GIVbacks by donating to this project.</Caption>
			</div>
		</Wrapper>
	);
};

const Popup = styled(Subline)<{ show: boolean; isMobile?: boolean }>`
	width: 246px;
	background-color: ${brandColors.giv[900]};
	color: ${brandColors.giv['000']};
	border-radius: 8px;
	padding: 8px 11px;
	visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
	opacity: ${({ show }) => (show ? 1 : 0)};
	position: absolute;
	z-index: 1;
	bottom: ${({ isMobile }) => (isMobile ? '27px' : '-32px')};
	left: ${({ isMobile }) => (isMobile ? '-113px' : '27px')};
	transition: ${({ show }) =>
		show
			? 'opacity 0.3s ease-in-out'
			: 'visibility 0s 0.3s, opacity 0.3s ease-in-out'};
	::after {
		content: '';
		position: absolute;
		top: ${({ isMobile }) => (isMobile ? '86px' : '38px')};
		left: ${({ isMobile }) => (isMobile ? '110px' : '-19px')};
		border-width: 10px;
		border-style: solid;
		border-color: ${({ isMobile }) =>
			isMobile
				? `${brandColors.giv[900]} transparent transparent transparent`
				: `transparent ${brandColors.giv[900]} transparent transparent`};
	}
`;

const Help = styled(FlexCenter)`
	cursor: pointer;
	position: relative;
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
