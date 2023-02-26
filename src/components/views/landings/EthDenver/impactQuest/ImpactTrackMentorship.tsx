import styled from 'styled-components';
import {
	H3,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
import ImpactTrackImg from '/public/images/ETHDenver-Impact-mentorship.png';
import Image from 'next/image';
import { GhostButton } from '@/components/styled-components/Button';
import { Col, Row, Container } from '@/components/Grid';

const ImpactTrackMentorship = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<Col xs={12} md={6}>
					<Img>
						<Image
							src={ImpactTrackImg}
							alt='Impact Track Mentorship'
						/>
					</Img>
				</Col>
				<Col xs={12} md={6}>
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
				</Col>
			</InnerWrapper>
		</Wrapper>
	);
};

const Desc = styled.div`
	margin: 24px 0;
`;

const Img = styled.div`
	display: flex;
	justify-content: center;
`;

const InnerWrapper = styled(Row)`
	padding: 40px;
	background: ${neutralColors.gray[200]};
	border-radius: 16px;
	gap: 24px;
	align-items: center;
`;

const Wrapper = styled(Container)`
	padding: 0 40px;
`;

export default ImpactTrackMentorship;
