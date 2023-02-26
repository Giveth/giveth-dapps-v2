import styled from 'styled-components';
import {
	H3,
	IconChevronRight32,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import ImpactTrackImg from '/public/images/ETHDenver-Impact-mentorship.png';
import Image from 'next/image';
import { GhostButton } from '@/components/styled-components/Button';

const ImpactTrackMentorship = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<Img src={ImpactTrackImg} alt='Impact Track Mentorship' />
				<div>
					<H3 weight={700}>Impact Track Mentorship</H3>
					<Desc>
						We love the great things that get built at ETHDenver
						hackathons. This year, we’re working to encourage
						hackathon participants to create real impact with their
						projects.
						<br />
						<br />
						Do you need help with your project for the Impact Track?
						Reach out to us on the ETHDenver Discord server under
						the "Building" section!
					</Desc>
					<GhostButton
						label='Join us on Discord'
						size='large'
						icon={<IconChevronRight32 />}
					/>
				</div>
			</InnerWrapper>
		</Wrapper>
	);
};

const Desc = styled.div`
	margin: 24px 0;
`;

const Img = styled(Image)`
	max-width: 100%;
`;

const InnerWrapper = styled.div`
	padding: 40px;
	background: ${neutralColors.gray[200]};
	border-radius: 16px;
	display: flex;
	gap: 24px;
	align-items: center;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const Wrapper = styled.div`
	padding: 0 40px;
`;

export default ImpactTrackMentorship;
