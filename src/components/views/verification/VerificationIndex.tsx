import styled from 'styled-components';
import { useState } from 'react';
import { Col, Row } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import ContentSelector from '@/components/views/verification/ContentSelector';
import HintModal from '@/components/views/verification/HintModal';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
import useDetectDevice from '@/hooks/useDetectDevice';
import DesktopMenu from '@/components/views/verification/menu/DesktopMenu';
import MobileMenu from '@/components/views/verification/menu/MobileMenu';
import { useVerificationData } from '@/context/verification.context';
import { EVerificationStatus } from '@/apollo/types/types';
import { VerificationStatusReport } from './VerificationStatusReport';
import { VerificationContainer } from './Common.sc';
import AutoSave from '@/components/AutoSave';

const VerificationIndex = () => {
	const [showModal, setShowModal] = useState(false);
	const { isMobile } = useDetectDevice();
	const { verificationData } = useVerificationData();
	const status = verificationData?.status || EVerificationStatus.DRAFT;

	return (
		<VerificationContainer>
			{status == EVerificationStatus.DRAFT ? (
				<InnerContainer>
					{isMobile ? <MobileMenu /> : <DesktopMenu />}
					<ContentSection sm={8} md={9}>
						<AbsoluteSection>
							<AutoSave />
						</AbsoluteSection>
						<ContentSelector />
					</ContentSection>
				</InnerContainer>
			) : (
				<VerificationStatusReport />
			)}
			{showModal && <HintModal setShowModal={setShowModal} />}
		</VerificationContainer>
	);
};

const AbsoluteSection = styled(Flex)`
	position: absolute;
	top: 29px;
	right: 16px;
	gap: 23px;
`;

const ContentSection = styled(Col)`
	padding: 24px;
	position: relative;
	border-radius: 16px;
	box-shadow: ${Shadow.Neutral[400]};
	background: white;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	min-height: 765px;
	> form {
		height: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}
	> :not(:first-child) {
		animation: fadeIn 0.3s ease-in-out;
	}
`;

const InnerContainer = styled(Row)`
	max-width: ${deviceSize.laptopL + 'px'};
	margin-right: 16px;
	margin-left: 16px;
	justify-content: space-between;
	width: 100%;

	${mediaQueries.mobileL} {
		margin-right: 34px;
		margin-left: 34px;
	}
`;

export default VerificationIndex;
