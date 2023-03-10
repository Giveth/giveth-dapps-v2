import styled, { css } from 'styled-components';
import {
	neutralColors,
	brandColors,
	Button,
	GLink,
} from '@giveth/ui-design-system';
import { zIndex } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';
import { Button as CButton } from '@/components/styled-components/Button';
import { IHeader } from './Header';
import { mediaQueries } from '@/lib/constants/constants';
import { Shadow } from '@/components/styled-components/Shadow';
import { ETheme } from '@/features/general/general.slice';

export const StyledHeader = styled(Flex)<IHeader>`
	position: fixed;
	left: 0;
	right: 0;
	top: ${props => (props.show ? 0 : '-100px')};
	z-index: ${zIndex.HEADER};
	transition: top 0.3s ease;
	padding: 16px 24px;
	background: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	box-shadow: ${props =>
		props.theme === ETheme.Dark
			? '0px 3px 20px rgba(33, 32, 60, 0.24)'
			: '0px 3px 20px rgba(212, 218, 238, 0.4)'};
	${mediaQueries.tablet} {
		padding: 16px 32px;
	}
`;

export const Logo = styled.span`
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${neutralColors.gray[100]};
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Neutral[400]};
	border-radius: 99px;
	padding: 8px;
	width: 60px;
	height: 60px;
	cursor: pointer;
`;

interface IHeaderButtonProps {
	isHover: boolean;
}

export const HeaderButton = styled(CButton)<IHeaderButtonProps>`
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
		props.theme === ETheme.Dark ? Shadow.Dark[500] : Shadow.Neutral[500]};
	${props =>
		props.isHover
			? css`
					background-color: ${props =>
						props.theme === ETheme.Dark
							? brandColors.giv[600]
							: 'white'};
					.cover-line {
						background-color: ${props =>
							props.theme === ETheme.Dark
								? brandColors.giv[600]
								: 'white'};
					}
			  `
			: ''}
`;

export const BalanceButton = styled(HeaderButton)`
	position: relative;
`;

export const NotificationsButton = styled(HeaderButton)`
	align-items: center;
	position: relative;
	background-color: ${props =>
		props.theme === ETheme.Dark ? brandColors.giv[900] : 'white'};
`;

export const NotificationsButtonCircle = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: -5%;
	right: 0;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	color: white;
	background-color: ${brandColors.pinky[500]};
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

export const NotificationsIconContainer = styled(HBContainer)`
	padding-right: 5px;
	padding-left: 5px;
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
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const HBPic = styled.img`
	border-radius: 24px;
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

export const HeaderLinks = styled(Flex)`
	margin-left: 48px;
	gap: 8px;
`;

export const HeaderLink = styled(GLink)<IHeaderLinkProps>`
	padding: 10px 16px 10px;
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
				? brandColors.giv[300]
				: brandColors.giv[50]};
	}
`;

export const SearchButton = styled(HeaderLink)`
	cursor: pointer;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[300]
			: neutralColors.gray[200]};
	& > div > span {
		display: none;
	}
	${mediaQueries.desktop} {
		& > div > span {
			display: inline-block;
		}
	}
`;

export const ConnectButton = styled(Button)`
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	text-transform: uppercase;
`;

export const SmallCreateProject = styled(Button)`
	width: 48px;
	height: 48px;
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	> :first-child {
		display: none;
	}
	> span {
		font-weight: 500;
		font-size: 20px;
	}
`;

export const LargeCreateProject = styled.div`
	display: none;
	> button {
		box-shadow: ${props =>
			props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	}

	${mediaQueries.laptopS} {
		display: unset;
	}
`;

export const SmallCreateProjectParent = styled.div`
	display: none;
	${mediaQueries.mobileL} {
		display: unset;
	}
	${mediaQueries.laptopS} {
		display: none;
	}
`;

export const MenuAndButtonContainer = styled.div`
	position: relative;
	z-index: 2;
`;

export const CoverLine = styled.div`
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

export const HomeButton = styled(Flex)`
	padding: 10px 16px;
	cursor: pointer;
`;

export const HeaderSidebarButtonWrapper = styled.div`
	padding: 12px;
`;

export const SidebarInnerContainer = styled(Flex)`
	padding: 4px 16px 16px;
	flex-direction: column;
	gap: 16px;
`;

export const HeaderPlaceHolder = styled.div`
	height: 92px;
`;

export const UserName = styled(GLink)`
	display: block;
	width: 128px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const GLinkNoWrap = styled(GLink)`
	text-overflow: ellipsis;
	white-space: nowrap;
`;
