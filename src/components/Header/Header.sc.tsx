import styled from 'styled-components';
import { zIndex } from '@/lib/constants/constants';
import {
	neutralColors,
	brandColors,
	Button,
	GLink,
	ButtonLink,
} from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { Button as CButton } from '@/components/styled-components/Button';
import { IHeader } from './Header';
import { mediaQueries } from '@/lib/constants/constants';
import { ETheme } from '@/context/general.context';
import { Shadow } from '@/components/styled-components/Shadow';

export const StyledHeader = styled(Flex)<IHeader>`
	position: fixed;
	left: 0;
	right: 0;
	top: ${props => (props.show ? 0 : '-100px')};
	padding: 16px 32px;
	z-index: ${zIndex.HEADER};
	transition: top 0.3s ease;
`;

export const Logo = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${neutralColors.gray[100]};
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	border-radius: 99px;
	padding: 8px;
	width: 64px;
	height: 64px;
`;

export const BackBtn = styled.a`
	cursor: pointer;
`;

interface IThemed {
	theme?: ETheme;
}

export const HeaderButton = styled(CButton)<IThemed>`
	display: flex;
	height: 50px;
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
	div:nth-child(2) {
		display: none;
	}
	div:nth-child(1) {
		width: 100%;
	}
	${mediaQueries.tablet} {
		font-size: 14px;
		width: 200px;
		padding: 6px 16px;
		div:nth-child(1) {
			width: 100%;
		}
		div:nth-child(2) {
			display: flex;
		}
	}
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
	font-family: 'Red Hat Text', sans-serif;
	font-style: normal;
	font-weight: normal;
	font-size: 10px;
	line-height: 13px;
	color: #b9a7ff;
	width: 123px;
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
	display: none;
	${mediaQueries.tablet} {
		display: flex;
	}
`;

export const Title = styled.h1`
	font-family: 'Red Hat Text', sans-serif;
	font-size: 16px;
	line-height: 24px;
	letter-spacing: 0.02em;
	text-align: left;
	color: ${props => props.theme.fg};
`;

interface IHeaderLinkProps {
	active?: boolean;
	theme?: ETheme;
}

export const HeaderLinks = styled(Flex)<IThemed>`
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
	${mediaQueries.laptopL} {
		display: flex;
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
`;

export const LargeCreateProject = styled.div`
	display: none;
	${mediaQueries.laptop} {
		display: unset;
	}
`;

export const SmallCreateProjectParent = styled.div`
	display: none;
	${mediaQueries.mobileL} {
		display: unset;
	}
	${mediaQueries.laptop} {
		display: none;
	}
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

export const MainLogoBtn = styled.div`
	display: none;
	${mediaQueries.laptopL} {
		display: flex;
	}
`;
