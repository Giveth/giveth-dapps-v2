import styled from 'styled-components';
import {
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
import { GhostButton } from '@/components/styled-components/Button';
import { Container, Row } from '@/components/Grid';

const EventDetails = () => {
	return (
		<Wrapper>
			<H4>
				We have many fun ways for you to connect with the <b>Giveth</b>{' '}
				team at <b>ETHDenver</b> and make an impact!
			</H4>
			<FindUs>
				<FindUsText>
					<H3 weight={700}>Where to find us?</H3>
					<Lead size='large'>
						If you’re attending the conference in person, come visit
						our booth! Find us at:
						<br />
						<br />
						Regenlandia (Impact Zone) At the National Western
						Complex: 4655 Humboldt St, Denver, CO 80216
					</Lead>
					<br />
					<GhostButton
						size='large'
						label='Get Directions'
						icon={<IconArrowRight32 />}
					/>
				</FindUsText>
				<Map>
					<Image src={MapImage} alt='ETHDenver map' />
				</Map>
			</FindUs>
			<Discord>
				<Image src={DiscordIcon} alt='Discord icon' />
				<DiscordText>
					<H4 weight={700}>We’d love to hear from you on Discord!</H4>
					<H4>
						Swing by our 👋 <b>say-hi</b> channel, and we’ll let you
						know who’s around to meet up.
					</H4>
					<GhostButton
						label='Join us on Discord'
						size='large'
						icon={<IconChevronRight32 />}
					/>
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
	gap: 40px;
	padding: 40px;
`;

const FindUsText = styled.div`
	max-width: 504px;
`;

const Map = styled.div``;

const FindUs = styled(Row)`
	padding-top: 203px;
	padding-bottom: 150px;
`;

const Wrapper = styled(Container)`
	background: white;
	color: ${neutralColors.gray[900]};
	padding-top: 120px;
	padding-bottom: 40px;
`;

export default EventDetails;
