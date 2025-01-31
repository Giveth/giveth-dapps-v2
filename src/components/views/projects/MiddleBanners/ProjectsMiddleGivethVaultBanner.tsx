import {
	brandColors,
	Flex,
	OutlineButton,
	mediaQueries,
	IconChevronRight24,
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
						width={150}
						height={60}
					/>
					<div>X</div>
					<Image
						src='/images/middle-banners/pool-together-logo.svg'
						alt='PoolTogether Logo'
						width={150}
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
					href={`https://app.giveth.io/projects/giveth-vault`}
				>
					<OutlineButton
						label={formatMessage({
							id: 'page.projects.middle_vault.button_text',
						})}
						leftIcon={
							<IconChevronRight24
								size={20}
								color={brandColors.giv[500]}
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
	position: relative;
	flex-direction: column;
	gap: 15px;
	padding: 60px 30px;
	border-radius: 12px;
	overflow: hidden;
	background-image: url('/images/middle-banners/pool-together-bg.png');
	background-size: cover;
`;

const BannerHeader = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	gap: 10px;
`;

const Title = styled.div`
	width: 24%;
	font-size: 24px;
	color: white;
`;

const LogosWrapper = styled.div`
	display: flex;
	width: 50%;
	gap: 20px;
	align-items: center;
	justify-content: center;
`;

const Caption = styled.div`
	color: white;
	font-size: 16px;
`;

const ButtonHolder = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 20px;
	width: 100%;
`;

const ButtonWrapper = styled.a`
	width: 100%;

	button {
		flex-direction: row-reverse;
		color: ${brandColors.giv[500]} !important;
		gap: 2px;
		width: 100%;
		font-weight: 700;
		padding: 12px 16px;
		background-color: white;

		svg {
			margin-left: 5px;
			flex-shrink: 0;
		}

		span {
			text-transform: capitalize;
		}
	}

	${mediaQueries.tablet} {
		width: auto;

		button {
			width: 213px;
		}
	}
`;
