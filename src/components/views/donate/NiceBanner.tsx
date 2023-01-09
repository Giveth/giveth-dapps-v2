import React, { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	GLink,
	IconExternalLink,
	H4,
	Lead,
	IconSpark,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import links from '@/lib/constants/links';
import config from '@/configuration';
import { useDonateData } from '@/context/donate.context';

const NiceBanner: FC = () => {
	const { project } = useDonateData();

	const { formatMessage } = useIntl();
	// Only show this on the Giveth project
	if (+project.id! !== config.GIVETH_PROJECT_ID) return null;
	return (
		<Container>
			<Content>
				<Title>
					Get $nice{' '}
					<IconSpark size={32} color={brandColors.giv[500]} />
				</Title>
				<Lead>
					Donate DAI, xDAI, wxDAI or USDC to this project and receive
					$nice tokens in addition to GIVbacks.
					<InfoReadMore
						as='a'
						rel='noopener noreferrer'
						target='_blank'
						href={links.NICE_DOC}
					>
						<span>
							{formatMessage({ id: 'label.learn_more' })}{' '}
						</span>
						<IconExternalLink
							size={16}
							color={brandColors.pinky[500]}
						/>
					</InfoReadMore>
				</Lead>
			</Content>
			<BgImage />
		</Container>
	);
};

const Title = styled(H4)`
	color: ${brandColors.giv[500]};
	font-weight: 700;
`;

const Container = styled.div`
	display: flex;
	height: 200px;
	align-items: center;
	background: white;
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 16px;
	margin: 0 40px 16px 40px;
	${mediaQueries.tablet} {
		height: 127px;
	}
`;

const Content = styled.div`
	position: absolute;
	text-align: left;
	z-index: 2;
	padding: 24px 64px 24px 32px;
	word-wrap: break-word;
`;

const BgImage = styled.div`
	width: 100%;
	height: 100%;
	background-image: url('/images/backgrounds/GIVGIVGIV.png');
	opacity: 0.1;
`;

const InfoReadMore = styled(GLink)`
	padding-left: 10px;
	color: ${brandColors.pinky[500]};
`;

export default NiceBanner;
