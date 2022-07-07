import styled from 'styled-components';
import { B, neutralColors } from '@giveth/ui-design-system';
import CheckCircle from '@/components/views/verification/CheckCircle';
import { Col } from '@/components/Grid';
import { Shadow } from '@/components/styled-components/Shadow';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';
import { ProgressBar } from '@/components/views/verification/common';
import { findStepByName } from '@/lib/verification';

const DesktopMenu = () => {
	const { step, setStep, verificationData } = useVerificationData();
	const { project, lastStep } = verificationData || {};
	const { title } = project || {};
	const lastStepIndex = findStepByName(lastStep);

	return (
		<MenuSection sm={3.75} md={2.75}>
			<MenuTitle>Verified status for</MenuTitle>
			<MenuTitle isActive>{title}</MenuTitle>
			<ProgressBar />
			{menuList.map((item, index) => (
				<MenuTitle
					hover={index <= lastStepIndex + 1}
					isActive={index <= step}
					key={item}
					onClick={() => index <= lastStepIndex + 1 && setStep(index)}
				>
					{item}
					{(index <= lastStepIndex || step === 8) && <CheckCircle />}
				</MenuTitle>
			))}
		</MenuSection>
	);
};

const MenuTitle = styled(B)<{ isActive?: boolean; hover?: boolean }>`
	display: flex;
	gap: 10px;
	margin-bottom: 24px;
	cursor: ${props => (props.hover ? 'pointer' : 'default')};
	color: ${props =>
		props.isActive ? neutralColors.gray[900] : neutralColors.gray[700]};
`;

const MenuSection = styled(Col)`
	padding: 24px;
	max-height: 765px;
	border-radius: 16px;
	box-shadow: ${Shadow.Neutral[400]};
	background: white;

	> :first-child {
		margin-bottom: 16px;
	}
	> :nth-child(3) {
		margin-bottom: 24px;
	}
`;

export default DesktopMenu;
