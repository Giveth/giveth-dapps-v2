import styled from 'styled-components';
import {
	brandColors,
	Button,
	H3,
	H4,
	IconArrowRight32,
	IconChevronRight32,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import DiscordIcon from '/public/images/ETHDenver-discord.svg';
import MapImage from '/public/images/ETHDenver-map.png';
import Image from 'next/image';

const EventDetails = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<H4>
					We have many fun ways for you to connect with the{' '}
					<b>Giveth</b> team at <b>ETHDenver</b> and make an impact!
				</H4>
				<FindUs>
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
						<H4 weight={700}>
							We’d love to hear from you on Discord!
						</H4>
						<H4>
							Swing by our 👋 say-hi channel, and we’ll let you
							know who’s around to meet up.
						</H4>
						<GhostButton
							label='Join us on Discord'
							size='large'
							icon={<IconChevronRight32 />}
						/>
					</DiscordText>
				</Discord>
			</InnerWrapper>
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

const GhostButton = styled(Button)`
	color: ${brandColors.pinky[500]};
	background: transparent;
	border-color: transparent;
	:hover {
		color: ${brandColors.pinky[500]};
		background: transparent;
	}
`;

const FindUsText = styled.div`
	max-width: 504px;
`;

const Map = styled.div``;

const FindUs = styled.div`
	margin: 203px 0 150px;
	display: flex;
	gap: 22px;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const InnerWrapper = styled.div`
	max-width: 1120px;
	margin: 0 auto;
`;

const Wrapper = styled.div`
	background: white;
	color: ${neutralColors.gray[900]};
	margin-top: 40px;
	padding: 120px 160px 40px;
`;

export default EventDetails;
