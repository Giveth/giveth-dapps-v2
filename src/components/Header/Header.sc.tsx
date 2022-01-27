import styled from 'styled-components';
import { Row } from '@/components/styled-components/Grid';
import { Button as CButton } from '@/components/styled-components/Button';
import { IHeader } from './Header';
import {
	neutralColors,
	brandColors,
	Button,
	GLink,
	Subline,
	ButtonLink,
} from '@giveth/ui-design-system';
import { device } from '@/utils/constants';
import { ETheme } from '@/context/general.context';
import { Shadow } from '@/components/styled-components/Shadow';

export const HeaderPlaceholder = styled.div`
	height: 100px;
`;

export const StyledHeader = styled(Row)<IHeader>`
	position: fixed;
	left: 0;
	right: 0;
	top: ${props => (props.show ? 0 : '-100px')};
	padding: 16px 32px;
	z-index: 1050;
	transition: top 0.3s ease;
`;

export const Logo = styled.div`
	background: ${neutralColors.gray[100]};
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	border-radius: 99px;
	padding: 8px;
	width: 64px;
	height: 64px;
`;

interface IThemed {
	theme?: ETheme;
}

export const HeaderButton = styled(CButton)<IThemed>`
	display: flex;
	height: 50px;
	color: white;
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 22px;
	padding: 12px;
	border-radius: 48px;
	text-align: left;
	color: ${props =>
		props.theme === ETheme.Dark ? 'white' : brandColors.giv[900]};
	background-color: ${props =>
		props.theme === ETheme.Dark ? brandColors.giv[900] : 'white'};
	border: 1px solid
		${props =>
			props.theme === ETheme.Dark ? brandColors.giv[600] : 'white'};
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
`;

export const BalanceButton = styled(HeaderButton)`
	position: relative;
`;

export const WalletButton = styled(HeaderButton)`
	font-size: 14px;
	width: 176px;
	padding: 6px 16px;
`;

export const HBContainer = styled.div`
	display: flex;
	align-items: center;
	z-index: 2;
`;

export const WBInfo = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 8px;
`;

export const WBNetwork = styled(GLink)`
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: normal;
	font-size: 10px;
	line-height: 13px;
	color: #b9a7ff;
	width: 120px;
`;

export const HBPic = styled.img`
	border-radius: 24px;
`;

export const HBBalanceLogo = styled(HBPic)`
	padding: 4px;
	background: #5326ec;
`;

export const HBContent = styled(GLink)`
	margin-left: 8px;
`;

export const Title = styled.h1`
	font-family: 'Red Hat Text';
	font-size: 16px;
	//font-style: bold;
	line-height: 24px;
	letter-spacing: 0.02em;
	text-align: left;
	color: ${props => props.theme.fg};
`;

interface IHeaderLinkProps {
	active?: boolean;
	theme?: ETheme;
}

export const HeaderLinks = styled(Row)<IThemed>`
	background-color: ${props =>
		props.theme === ETheme.Dark ? brandColors.giv[900] : 'white'};
	border: 1px solid
		${props =>
			props.theme === ETheme.Dark ? brandColors.giv[600] : 'white'};
	border-radius: 48px;
	padding: 6px;
	gap: 8px;
	display: none;
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	@media ${device.laptopL} {
		display: flex;
	}
`;

export const SmallHeaderLinks = styled(Row)`
	align-self: center;
	align-items: center;
	display: flex;
	padding: 0 16px;
	@media ${device.laptopL} {
		display: none;
	}
`;

export const HeaderLink = styled(GLink)<IHeaderLinkProps>`
	padding: 8px 16px 7px;
	border-radius: 72px;
	background-color: ${props => {
		if (props.active) {
			return props.theme === ETheme.Dark
				? brandColors.giv[600]
				: brandColors.giv[100];
		}
		return '';
	}};
	&:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[800]
				: neutralColors.gray[200]};
	}
`;

export const ConnectButton = styled(Button)`
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
`;

export const NotifButton = styled(HeaderButton)`
	padding: 23px;
	background-image: url('/images/notif.svg');
	background-position: center;
	background-repeat: no-repeat;
	max-width: 48px;
`;

export const CreateProject = styled(ButtonLink)`
	white-space: nowrap;
	display: none;
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	@media ${device.laptop} {
		display: flex;
	}
`;

export const SmallCreateProject = styled(ButtonLink)`
	white-space: nowrap;
	padding: 0;
	width: 48px;
	height: 48px;
	gap: 0;
	span {
		font-size: 32px !important;
	}
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	@media ${device.laptop} {
		display: none;
	}
`;

export const BalanceTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	text-align: center;
	width: 120px;
`;

export const MenuAndButtonContainer = styled.div`
	position: relative;
	z-index: 2;
`;

export const CoverLine = styled.div<IThemed>`
	background-color: ${props =>
		props.theme === ETheme.Dark ? brandColors.giv[900] : 'white'};
	position: absolute;
	z-index: 1;
	left: 1px;
	right: 1px;
	top: 1px;
	bottom: 4px;
	border-radius: 48px;
`;
