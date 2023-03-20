import styled from 'styled-components';
import {
	Button,
	H3,
	H4,
	IconArrowRight32,
	IconChevronRight32,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import DiscordIcon from '/public/images/ETHDenver-discord.svg';
import MapImage from '/public/images/ETHDenver-map.png';
import Image from 'next/image';
import { Col, Container, Row } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const EventDetails = () => {
	return (
		<Wrapper>
			<H4>
				We have many fun ways for you to connect with the <b>Giveth</b>{' '}
				team at <b>ETHDenver</b> and make an impact!
			</H4>
			<FindUs>
				<Col xs={12} md={6}>
					<FindUsText>
						<H3 weight={700}>Where to find us?</H3>
						<Lead size='large'>
							If you’re attending the conference in person, come
							visit our booth! Find us at:
							<br />
							<br />
							Regenlandia (Impact Zone) At the National Western
							Complex: 4655 Humboldt St, Denver, CO 80216
						</Lead>
						<br />
						<ExternalLink href='https://maps.app.goo.gl/hg2LicDFbsUBWdCYA?g_st=ic'>
							<Button
								size='large'
								buttonType='texty-primary'
								label='Get Directions'
								icon={<IconArrowRight32 />}
							/>
						</ExternalLink>
					</FindUsText>
				</Col>
				<Col xs={12} md={6}>
					<Map>
						<CustomImage src={MapImage} alt='ETHDenver map' />
					</Map>
				</Col>
			</FindUs>
			<Discord>
				<CustomImage src={DiscordIcon} alt='Discord icon' />
				<DiscordText>
					<H4 weight={700}>We’d love to hear from you on Discord!</H4>
					<H4>
						Swing by our 👋 <b>say-hi</b> channel, and we’ll let you
						know who’s around to meet up.
					</H4>
					<ExternalLink href={links.DISCORD}>
						<Button
							buttonType='texty-primary'
							label='Join us on Discord'
							size='large'
							icon={<IconChevronRight32 />}
						/>
					</ExternalLink>
				</DiscordText>
			</Discord>
		</Wrapper>
	);
};

const DiscordText = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	align-items: flex-start;
`;

const Discord = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 40px;
	padding-bottom: 60px;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const FindUsText = styled.div`
	max-width: 504px;
`;

const Map = styled.div`
	/* max-width: 300px; */
`;

const CustomImage = styled(Image)`
	max-width: 100%;
`;

const FindUs = styled(Row)`
	padding-top: 203px;
	padding-bottom: 150px;
`;

const Wrapper = styled(Container)`
	background: white;
	color: ${neutralColors.gray[900]};
	padding-top: 120px;
`;

export default EventDetails;
