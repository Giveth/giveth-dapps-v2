import {
	H5,
	IconArrowLeft,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';
import AutoSave from '@/components/AutoSave';

const HeaderSection = () => {
	return (
		<Header>
			<HeaderTop>
				<InternalLink href={Routes.Notification}>
					<BackButton>
						<IconArrowLeft size={20} />
					</BackButton>
				</InternalLink>
				<H5 weight={700}>Notification Settings</H5>
			</HeaderTop>
			<AutoSaveContainer>
				<AutoSave />
			</AutoSaveContainer>
			<Lead>
				Important notifications outside you notification settings may
				still be sent to you
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
