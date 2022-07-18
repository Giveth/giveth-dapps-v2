import React from 'react';
import styled from 'styled-components';
import {
	brandColors,
	GLink,
	IconExternalLink,
	H4,
	Lead,
} from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import { IProjectBySlug } from '@/apollo/types/types';
import links from '@/lib/constants/links';

const NiceBanner = (props: IProjectBySlug) => {
	const { project } = props;
	// Only show this on the Giveth project}
	if (project.id !== '1') return null;
	return (
		<Wrapper>
			<Container>
				<Content>
					<Title>Get $nice </Title>
					<Lead>
						Donate DAI or xDAI to this project and receive $nice
						tokens in addition to GIVbacks.{' '}
						<InfoReadMore target='_blank' href={links.NICE_DOC}>
							<span>Learn More </span>
							<IconExternalLink
								size={16}
								color={brandColors.pinky[500]}
							/>
						</InfoReadMore>
					</Lead>
				</Content>
				<BgImage />
			</Container>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	${mediaQueries.tablet} {
		display: grid;
		grid-template-columns: repeat(1, minmax(500px, 1fr));
		grid-auto-rows: minmax(100px, auto);
	}
	${mediaQueries.mobileL} {
		grid-template-columns: repeat(1, minmax(100px, 1fr));
		padding: 0 40px;
	}
`;

const Title = styled(H4)`
	color: ${brandColors.giv[500]};
	font-weight: 700;
`;

const Container = styled.div`
	width: 100%;
	background: white;
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 16px;
	margin: 0 0 16px 0;
	height: 160px;
	${mediaQueries.tablet} {
		height: 127px;
	}
`;

const Content = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	text-align: left;
	z-index: 2;
	padding: 24px 32px;
	height: 160px;
	${mediaQueries.tablet} {
		height: 127px;
	}
`;

const BgImage = styled.div`
	width: 100%;
	height: 100%;
	background-image: url('/images/backgrounds/GIVGIVGIV.png');
	opacity: 0.1;
`;

const InfoReadMore = styled(GLink)`
	padding: 0 0 0 20px;
	color: ${brandColors.pinky[500]};
`;

export default NiceBanner;
