import styled from 'styled-components';
import { Row } from './styled-components/Grid';
import { Button as CButton } from './styled-components/Button';
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
	box-shadow: 0px 4.125px 27.5px rgba(33, 32, 60, 0.24);
	border-radius: 99px;
	padding: 8px;
	width: 64px;
	height: 64px;
`;

export const HeaderButton = styled(CButton)`
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
	border: 1px solid #3811bf;
	background-color: ${brandColors.giv[900]};
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

export const WBNetwork = styled.span`
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

export const HBContent = styled.span`
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
}

export const HeaderLinks = styled(Row)`
	background-color: ${brandColors.giv[900]};
	border: 1px solid ${brandColors.giv[600]};
	border-radius: 48px;
	padding: 6px;
	gap: 8px;
	display: none;
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
	background-color: ${props => (props.active ? brandColors.giv[600] : '')};
	border-radius: 72px;
`;

export const ConnectButton = styled(Button)``;

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
	@media ${device.laptop} {
		display: block;
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
	@media ${device.laptop} {
		display: none;
	}
`;

export const BalanceTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	text-align: center;
	width: 120px;
`;

export const RewardMenuAndButtonContainer = styled.div`
	position: relative;
	z-index: 2;
`;

export const CoverLine = styled.div`
	background-color: ${brandColors.giv[900]};
	position: absolute;
	z-index: 1;
	height: 6px;
	// width: 100%;
	left: 0;
	right: 0;
	top: 40%;
`;
