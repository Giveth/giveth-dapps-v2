import styled from 'styled-components';
import {
	Button,
	H3,
	IconExternalLink24,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import PizzaImage from '/public/images/ETHDenver-pizza.png';
import { Col, Row } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';

const ImpactQuests = () => {
	return (
		<Wrapper>
			<Row>
				<Col xs={12} md={6}>
					<H3 weight={700}>Impact Quests</H3>
					<LeadStyled size='large'>
						Want to embark on a special mission to leave Denver
						better than you found it?
						<br />
						<br />
						Take part in our Impact Quests to collect POAPs and
						redeem special prizes at our booth, all while making a
						positive difference on the ground! You can even
						participate virtually if you can't make it to the
						conference.
					</LeadStyled>
					<ExternalLink href='https://giveth.notion.site/Giveth-s-Galactic-Impact-Quests-f8ef267e16d14acfaba41b43183c17de'>
						<Button
							buttonType='texty-primary'
							label='Learn about Impact Quests'
							size='large'
							icon={<IconExternalLink24 />}
						/>
					</ExternalLink>
				</Col>
				<Col xs={12} md={6}>
					<Img src={PizzaImage} alt='EthDenver Pizza Image' />
				</Col>
			</Row>
		</Wrapper>
	);
};

const Img = styled(Image)`
	max-width: 100%;
`;

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
