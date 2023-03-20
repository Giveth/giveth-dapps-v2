import styled from 'styled-components';
import {
	Button,
	H3,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
import ImpactTrackImg from '/public/images/ETHDenver-Impact-mentorship.png';
import Image from 'next/image';
import { Col, Row } from '@giveth/ui-design-system';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';

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
							server under the &quot;Partners&quot; section!
						</Desc>
						<ExternalLink href={links.DISCORD}>
							<Button
								label='Join us on Discord'
								buttonType='texty-primary'
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
