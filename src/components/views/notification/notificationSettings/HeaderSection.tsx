import {
	H5,
	IconArrowLeft,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';

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
			<Lead>
				Important notifications outside you notification settings may
				still be sent to you
			</Lead>
		</Header>
	);
};

const HeaderTop = styled.div`
	display: flex;
	gap: 16px;
	margin-bottom: 18px;
`;

const Header = styled.div`
	padding: 24px 40px;
`;

const BackButton = styled(FlexCenter)`
	background: ${neutralColors.gray[200]};
	border-radius: 8px;
	width: 42px;
	height: 42px;
`;

export default HeaderSection;
