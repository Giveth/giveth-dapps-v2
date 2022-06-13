import styled from 'styled-components';
import { B, neutralColors } from '@giveth/ui-design-system';
import CheckCircle from '@/components/views/verification/CheckCircle';
import { Col } from '@/components/Grid';
import { Shadow } from '@/components/styled-components/Shadow';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';
import { ProgressBar } from '@/components/views/verification/common';

const DesktopMenu = () => {
	const { step, setStep, verificationData } = useVerificationData();
	const { project } = verificationData || {};
	const { title } = project || {};

	return (
		<MenuSection sm={3.75} md={2.75}>
			<MenuTitle>Verified status for</MenuTitle>
			<MenuTitle isActive>{title}</MenuTitle>
			<ProgressBar />
			{menuList.map((item, index) => (
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
