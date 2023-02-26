import styled from 'styled-components';
import {
	H3,
	IconExternalLink24,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import SwagImg from '/public/images/swag.png';
import Image from 'next/image';
import { GhostButton } from '@/components/styled-components/Button';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const GivethSwag = () => {
	return (
		<Wrapper>
			<Text>
				<H3 weight={700}>Giveth Swag</H3>
				<Desc size='large'>
					Want to get your hands on the latest Giveth swag? Swing by
					our booth, and we’ll let you know how to take part in our
					Impact Quests to claim cool prizes. Or if you prefer, order
					yours now from our new and improved swag shop.
				</Desc>
				<ExternalLink href={links.SWAG}>
					<GhostButton
						label='Go to Swag shop'
						size='large'
						icon={<IconExternalLink24 />}
					/>
				</ExternalLink>
			</Text>
			<Img>
				<Image src={SwagImg} alt='Swag Image' />
			</Img>
		</Wrapper>
	);
};

const Img = styled.div``;

const Text = styled.div`
	max-width: 557px;
`;

const Desc = styled(Lead)`
	margin: 47px 0 31px;
`;

const Wrapper = styled.div`
	color: ${neutralColors.gray[900]};
	padding: 40px;
	margin: 40px auto;
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	border-radius: 16px;
	background: ${neutralColors.gray[200]};
	align-items: center;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

export default GivethSwag;
