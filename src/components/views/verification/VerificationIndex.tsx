import styled from 'styled-components';
import {
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import ContentSelector from '@/components/views/verification/ContentSelector';
import HintModal from '@/components/views/verification/HintModal';
import { Col, Row } from '@/components/Grid';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
import useDetectDevice from '@/hooks/useDetectDevice';
import DesktopMenu from '@/components/views/verification/menu/DesktopMenu';
import MobileMenu from '@/components/views/verification/menu/MobileMenu';

const VerificationIndex = () => {
	const [showModal, setShowModal] = useState(false);
	const device = useDetectDevice();
	const isMobile = device.isMobile;

	return (
		<Container>
			<InnerContainer>
				{isMobile ? <MobileMenu /> : <DesktopMenu />}
				<ContentSection sm={8} md={9}>
					<AbsoluteSection>
						<SaveSection>
							Auto save
							<SaveCircle />
						</SaveSection>
						{/* <GuideSection onClick={() => setShowModal(true)}>
							<Image src={BulbIcon} alt='light bulb' />
						</GuideSection> */}
					</AbsoluteSection>
					<ContentSelector />
				</ContentSection>
			</InnerContainer>
			{showModal && <HintModal setShowModal={setShowModal} />}
		</Container>
	);
};

const AbsoluteSection = styled(Flex)`
	position: absolute;
	top: 16px;
	right: 16px;
	gap: 23px;
`;

const SaveCircle = styled.div`
	width: 10px;
	height: 10px;
	margin-top: 5px;
	border-radius: 50%;
	border: 2px solid ${semanticColors.jade[100]};
	background: ${semanticColors.jade[500]};
`;

const SaveSection = styled(SublineBold)`
	display: flex;
	margin-top: 13px;
	gap: 3px;
`;

const GuideSection = styled(FlexCenter)`
	box-shadow: ${Shadow.Giv[400]};
	padding: 10px;
	border-radius: 16px;
	cursor: pointer;
`;

export const BtnContainer = styled(Flex)`
	justify-content: space-between;
`;

export const ContentSeparator = styled.hr`
	border: 0.5px solid ${neutralColors.gray[300]};
	margin: 64px 0 10px;
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

const Container = styled(Flex)`
	min-height: 100vh;
	justify-content: center;
	background-image: url('/images/backgrounds/Verification_GIV.svg');
	padding: 165px 0 50px;
`;

export default VerificationIndex;
