import {
	H5,
	IconArrowLeft,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';
import AutoSave from '@/components/AutoSave';

const HeaderSection = () => {
	const { formatMessage } = useIntl();

	return (
		<Header>
			<HeaderTop>
				<InternalLink href={Routes.Notifications}>
					<BackButton>
						<IconArrowLeft size={20} />
					</BackButton>
				</InternalLink>
				<H5 weight={700}>
					{formatMessage({ id: 'label.notifications_settings' })}
				</H5>
			</HeaderTop>
			<AutoSaveContainer>
				<AutoSave />
			</AutoSaveContainer>
			<Lead>
				{formatMessage({
					id: 'label.change_your_settings_at_any_time_to_adjust',
				})}
			</Lead>
		</Header>
	);
};

const AutoSaveContainer = styled.div`
	margin-bottom: 10px;

	${mediaQueries.mobileL} {
		position: absolute;
		top: 36px;
		right: 40px;
	}
`;

const HeaderTop = styled.div`
	display: flex;
	gap: 16px;
	margin-bottom: 18px;
`;

const Header = styled.div`
	padding: 24px 40px;
	position: relative;
`;

const BackButton = styled(FlexCenter)`
	background: ${neutralColors.gray[200]};
	border-radius: 8px;
	width: 42px;
	height: 42px;
`;

export default HeaderSection;
