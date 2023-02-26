import styled from 'styled-components';
import {
	H3,
	IconExternalLink24,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import { GhostButton } from '@/components/styled-components/Button';
import PizzaImage from '/public/images/ETHDenver-pizza.png';

const ImpactQuests = () => {
	return (
		<Wrapper>
			<div>
				<H3 weight={700}>Impact Quests</H3>
				<LeadStyled size='large'>
					Want to embark on a special mission to leave Denver better
					than you found it?
					<br />
					<br />
					Take part in our Impact Quests to collect POAPs and redeem
					special prizes at our booth, all while making a positive
					difference on the ground! You can even participate virtually
					if you can't make it to the conference.
				</LeadStyled>
				<GhostButton
					label='Learn more about our Impact Quests'
					size='large'
					icon={<IconExternalLink24 />}
				/>
			</div>
			<Img>
				<Image src={PizzaImage} alt='EthDenver Pizza Image' />
			</Img>
		</Wrapper>
	);
};

const Img = styled.div``;

const LeadStyled = styled(Lead)`
	margin: 47px 0 24px;
`;

const Wrapper = styled.div`
	display: flex;
	padding: 40px;
	align-items: center;
	flex-direction: column;
	gap: 60px;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

export default ImpactQuests;
