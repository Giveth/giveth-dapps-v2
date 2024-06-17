import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { B, neutralColors, Col } from '@giveth/ui-design-system';
import CheckCircle from '@/components/views/verification/CheckCircle';
import WarningCircle from '@/components/views/verification/WarningCircle';
import { Shadow } from '@/components/styled-components/Shadow';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';
import { StepsProgressBar } from '@/components/views/verification/Common';
import { findStepByName } from '@/lib/verification';
import { checkVerificationStep } from '@/helpers/projects';

const DesktopMenu = () => {
	const { step, setStep, verificationData } = useVerificationData();
	console.log({ step });
	console.log({ verificationData });
	const { project, lastStep } = verificationData || {};
	const { title } = project || {};
	const lastStepIndex = findStepByName(lastStep);
	const { formatMessage } = useIntl();

	return (
		<MenuSection sm={3.75} md={2.75}>
			<MenuTitle>
				{formatMessage({ id: 'label.verified_status_for' })}
			</MenuTitle>
			<MenuTitle $isActive>{title}</MenuTitle>
			<StepsProgressBar />
			{menuList.map((item, index) => {
				const isClickable = index != 8; // Do not enable click on last step "Done"
				const IconCheck = checkVerificationStep(
					item.slug,
					verificationData,
				) ? (
					<CheckCircle />
				) : (
					<WarningCircle />
				);
				return (
					<MenuTitle
						$hover={isClickable}
						$isActive={index == step}
						key={item.slug}
						onClick={() => isClickable && setStep(index)}
					>
						{formatMessage({ id: item.label })}
						{IconCheck}
					</MenuTitle>
				);
			})}
		</MenuSection>
	);
};

const MenuTitle = styled(B)<{ $isActive?: boolean; $hover?: boolean }>`
	display: flex;
	gap: 10px;
	margin-bottom: 24px;
	cursor: ${props => (props.$hover ? 'pointer' : 'default')};
	color: ${props =>
		props.$isActive ? neutralColors.gray[900] : neutralColors.gray[700]};
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
