import {
	brandColors,
	Button,
	Container,
	H4,
	IconProfile,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

const AlreadyRegistered = () => {
	const { formatMessage } = useIntl();
	return (
		<ContainerStyled>
			<IconContainer>
				<IconProfile color={brandColors.giv[300]} size={90} />
			</IconContainer>
			<H4Styled>
				{formatMessage({
					id: 'label.you_already_completed_your_profile',
				})}
				<div>
					{formatMessage({
						id: 'label.you_can_use_the_dashboard_to_edit',
					})}
				</div>
			</H4Styled>
			<InternalLink href={Routes.MyAccount}>
				<ButtonStyled
					size='medium'
					label={formatMessage({ id: 'label.go_to_dashboard' })}
					buttonType='primary'
				/>
			</InternalLink>
			<InternalLink href={Routes.Home}>
				<ButtonTexty
					buttonType='texty'
					label={formatMessage({ id: 'label.or_go_back_to_home' })}
				/>
			</InternalLink>
		</ContainerStyled>
	);
};

const ButtonTexty = styled(Button)`
	:hover {
		background: transparent;
		color: ${brandColors.deep[200]};
	}
`;

const ButtonStyled = styled(Button)`
	width: 200px;
	margin-bottom: 24px;
`;

const H4Styled = styled(H4)`
	color: ${brandColors.deep[800]};
	margin: 32px 0;
`;

const IconContainer = styled(FlexCenter)`
	width: 110px;
	height: 110px;
	border-radius: 50%;
	background: white;
	box-shadow: ${Shadow.Giv[400]};
	position: relative;
`;

const ContainerStyled = styled(Container)`
	margin-bottom: 230px;
	margin-top: 250px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

export default AlreadyRegistered;
