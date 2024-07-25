import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { B, neutralColors, Col } from '@giveth/ui-design-system';
import CheckCircle from '@/components/views/verification/CheckCircle';
import WarningCircle from '@/components/views/verification/WarningCircle';
import { Shadow } from '@/components/styled-components/Shadow';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';
import { StepsProgressBar } from '@/components/views/verification/Common';
import {
	checkAllVerificationsSteps,
	checkVerificationStep,
} from '@/helpers/projects';

const DesktopMenu = () => {
	const { step, setStep, verificationData, isDraft } = useVerificationData();
	const { project } = verificationData || {};
	const { title } = project || {};
	const { formatMessage } = useIntl();
	const allCheckedSteps = checkAllVerificationsSteps(
		menuList,
		verificationData,
	);

	return (
		<MenuSection sm={3.75} md={2.75}>
			<MenuTitle>
				{formatMessage({ id: 'label.verified_status_for' })}
			</MenuTitle>
			<MenuTitle $isActive>{title}</MenuTitle>
			<StepsProgressBar />
			{menuList.map((item, index) => {
				let isClickable = index !== 8; // Do not enable click on last step "Done"
				isClickable = !isDraft ? false : isClickable; // user first time came to verification steps

				const isFiledDone = checkVerificationStep(
					item.slug,
					verificationData,
				);
				// show icon only if it is not optional or it is optional and user has filled it
				const shouldShowIcon = !item.isOptional || isFiledDone;

				// show check icon on last step if all steps are completed
				const isUserOntheLastStep =
					allCheckedSteps && index === 8 && step === 8;

				const IconCheck =
					isFiledDone || isUserOntheLastStep ? (
						<CheckCircle />
					) : (
						<WarningCircle />
					);

				return (
					<MenuTitle
						$hover={isClickable}
						$isActive={index === step}
						key={item.slug}
						onClick={() => isClickable && setStep(index)}
					>
						{formatMessage({ id: item.label })}
						{!!shouldShowIcon && IconCheck}
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
