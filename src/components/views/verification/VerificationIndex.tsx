import styled from 'styled-components';
import Image from 'next/image';
import {
	B,
	brandColors,
	Button,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import BulbIcon from '/public/images/icons/lightbulb.svg';
import ContentSelector from '@/components/views/verification/ContentSelector';
import HintModal from '@/components/views/verification/HintModal';
import CheckCircle from '@/components/views/verification/CheckCircle';

const MenuList = [
	'Before you start',
	'Personal info',
	'Social profiles',
	'Project registry',
	'Project contact',
	'Milestones',
	'Managing funds',
	'Terms & Conditions',
	'Done',
];

const stepsCount = MenuList.length;

const VerificationIndex = () => {
	const title = 'The Giveth Community of Makers';

	const [step, setStep] = useState(0);
	const [showModal, setShowModal] = useState(false);

	return (
		<Container>
			<InnerContainer>
				<MenuSection>
					<MenuTitle>Verified status for</MenuTitle>
					<MenuTitle isActive>{title}</MenuTitle>
					<MenuSeparator>
						<ProgressBar step={step} />
					</MenuSeparator>
					{MenuList.map((item, index) => (
						<MenuTitle
							hover={index < step}
							isActive={index <= step}
							key={item}
							onClick={() => index < step && setStep(index)}
						>
							{item}
							{index < step && <CheckCircle />}
						</MenuTitle>
					))}
				</MenuSection>
				<ContentSection>
					<AbsoluteSection>
						<SaveSection>
							Auto save
							<SaveCircle />
						</SaveSection>
						<GuideSection onClick={() => setShowModal(true)}>
							<Image src={BulbIcon} alt='light bulb' />
						</GuideSection>
					</AbsoluteSection>
					<div>
						<ContentSelector step={step} />
					</div>
					<div>
						<ContentSeparator />
						<BtnContainer>
							<Button
								disabled={step === 0}
								onClick={() => setStep(step - 1)}
								label='<     PREVIOUS'
							/>
							<Button
								disabled={step === stepsCount - 1}
								onClick={() => setStep(step + 1)}
								label='NEXT     >'
							/>
						</BtnContainer>
					</div>
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

const BtnContainer = styled(Flex)`
	justify-content: space-between;
`;

const ContentSeparator = styled.hr`
	border: 0.5px solid ${neutralColors.gray[300]};
	margin: 10px 0;
`;

const ProgressBar = styled.div<{ step: number }>`
	background: ${brandColors.giv[500]};
	border-radius: 5px;
	width: ${props => (props.step / stepsCount) * 100}%;
	height: 100%;
`;

const MenuSeparator = styled.div`
	margin: 25px 0;
	background: ${neutralColors.gray[300]};
	height: 3px;
	border-radius: 5px;
`;

const MenuTitle = styled(B)<{ isActive?: boolean; hover?: boolean }>`
	display: flex;
	gap: 10px;
	margin-bottom: 16px;
	cursor: ${props => (props.hover ? 'pointer' : 'default')};
	color: ${props =>
		props.isActive ? neutralColors.gray[900] : neutralColors.gray[700]};
`;

const SectionStyle = styled.div`
	border-radius: 16px;
	box-shadow: ${Shadow.Neutral[400]};
	background: white;
`;

const MenuSection = styled(SectionStyle)`
	padding: 24px;
	width: 250px;
	max-height: 765px;
`;

const ContentSection = styled(SectionStyle)`
	width: 800px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
`;

const InnerContainer = styled(Flex)`
	gap: 28px;
`;

const Container = styled(Flex)`
	min-height: 100vh;
	justify-content: center;
	background-image: url('/images/backgrounds/Verification_GIV.svg');
	padding: 165px 0 50px;
`;

export default VerificationIndex;
