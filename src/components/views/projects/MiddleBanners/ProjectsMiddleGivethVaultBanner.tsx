import {
	brandColors,
	Flex,
	OutlineButton,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Image from 'next/image';
import { Box } from './common.sc';

export const ProjectsMiddleGivethVaultBanner = () => {
	const { formatMessage } = useIntl();

	return (
		<BannerContainer>
			<BannerHeader>
				<Title>
					{formatMessage({ id: 'page.projects.middle_vault.header' })}
				</Title>
				<LogosWrapper>
					<Image
						src='/images/middle-banners/giveth-logo.svg'
						alt='Giveth Logo'
						width={180}
						height={60}
					/>
					<Image
						src='/images/middle-banners/icon-cross.svg'
						alt='Cross Icon'
						width={24}
						height={24}
					/>
					<Image
						src='/images/middle-banners/pool-together-logo.svg'
						alt='PoolTogether Logo'
						width={180}
						height={60}
					/>
				</LogosWrapper>
			</BannerHeader>

			<Caption>
				{formatMessage({ id: 'page.projects.middle_vault.text' })}
			</Caption>

			<ButtonHolder>
				<ButtonWrapper
					target='_blank'
					rel='noopener noreferrer'
					href={`https://app.cabana.fi/vault/8453/0x48c773aa0023980c3123acd4ae1d59753f812067`}
				>
					<OutlineButton
						label={formatMessage({
							id: 'page.projects.middle_vault.button_text',
						})}
						leftIcon={
							<Image
								width={16}
								height={16}
								src='/images/middle-banners/icon-arrow-right.svg'
								alt='Arrow Right'
							/>
						}
					/>
				</ButtonWrapper>
			</ButtonHolder>
		</BannerContainer>
	);
};

export default ProjectsMiddleGivethVaultBanner;

/* Styled Components */
const BannerContainer = styled(Box)`
	display: flex;
	position: relative;
	flex-direction: column;
	gap: 15px;
	padding: 70px 40px;
	border-radius: 24px;
	overflow: hidden;
	background-image: url('/images/middle-banners/pool-together-mobile.svg');
	background-size: cover;
	background-position: top left;
	background-repeat: no-repeat;

	${mediaQueries.mobileL} {
		background-image: url('/images/middle-banners/pool-together-pre-tablet.svg');
	}

	${mediaQueries.tablet} {
		background-image: url('/images/middle-banners/pool-together-tablet.svg');
	}

	${mediaQueries.desktop} {
		background-image: url('/images/middle-banners/pool-together-desktop.svg');
		background-position: center;
	}
`;

const BannerHeader = styled(Flex)`
	flex-direction: column-reverse;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	text-align: center;

	${mediaQueries.laptopS} {
		flex-direction: row;
		text-align: left;
	}

	${mediaQueries.laptopS} {
		gap: 0;
	}
`;

const Title = styled.div`
	width: 100%;
	font-family: 'TeX Gyre Adventor', serif;
	padding: 0 1.2em;
	margin-top: 20px;
	font-size: 32px;
	line-height: 50px;
	font-weight: bold;
	color: white;

	${mediaQueries.laptopS} {
		width: 50%;
		margin-top: 0;
		padding: 0;
		text-align: left;
	}

	${mediaQueries.laptopL} {
		width: 30%;
	}
`;

const LogosWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 30px;
	align-items: center;
	justify-content: center;

	${mediaQueries.tablet} {
		flex-direction: row;
	}

	${mediaQueries.laptopS} {
		width: 50%;
	}

	${mediaQueries.laptopL} {
		width: 40%;
	}
`;

const Caption = styled.div`
	margin-top: 20px;
	text-align: center;
	color: white;
	font-size: 24px;
	line-height: 36px;

	${mediaQueries.laptopS} {
		text-align: left;
	}
`;

const ButtonHolder = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 20px;
	width: 100%;
	padding: 0 20px;
`;

const ButtonWrapper = styled.a`
	width: 172px;

	button {
		flex-direction: row-reverse;
		color: ${brandColors.giv[500]} !important;
		gap: 2px;
		width: 100%;
		font-weight: 700;
		padding: 14px 0;
		background-color: white;

		svg {
			margin-left: 8px;
			flex-shrink: 0;
		}

		span {
			text-transform: capitalize;
		}
	}

	${mediaQueries.tablet} {
		width: auto;

		button {
			width: 175px;
		}
	}
`;
