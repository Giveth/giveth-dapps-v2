import styled from 'styled-components';
import {
	H3,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
import ImpactTrackImg from '/public/images/ETHDenver-Impact-mentorship.png';
import Image from 'next/image';
import { GhostButton } from '@/components/styled-components/Button';
import { Col, Row } from '@/components/Grid';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const ImpactTrackMentorship = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<Col xs={12} md={6}>
					<Img src={ImpactTrackImg} alt='Impact Track Mentorship' />
				</Col>
				<Col xs={12} md={6}>
					<div>
						<H3 weight={700}>Impact Track Mentorship</H3>
						<Desc>
							We love the great things that get built at ETHDenver
							hackathons. This year, we’re working to encourage
							hackathon participants to create real impact with
							their projects.
							<br />
							<br />
							Do you need help with your project for the Impact
							Track? Reach out to us on the ETHDenver Discord
							server under the "Building" section!
						</Desc>
						<ExternalLink href={links.DISCORD}>
							<GhostButton
								label='Join us on Discord'
								size='large'
								icon={<IconChevronRight32 />}
							/>
						</ExternalLink>
					</div>
				</Col>
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

const InnerWrapper = styled(Row)`
	background: ${neutralColors.gray[200]};
	border-radius: 16px;
	padding: 16px;
`;

const Wrapper = styled.div`
	padding: 40px;
`;

export default ImpactTrackMentorship;
