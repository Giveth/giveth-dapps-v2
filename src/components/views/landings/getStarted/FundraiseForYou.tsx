import styled from 'styled-components';
import { Button, H3, Lead } from '@giveth/ui-design-system';
import { Bullets } from '@/components/styled-components/Bullets';
import ExternalLink from '@/components/ExternalLink';

const Header = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Fundraise for your Project</H3>
			<LeadStyled size='large'>
				If you’re raising money for a good cause, there is no better
				place to do it than on Giveth! Not only will you receive 100% of
				all funds donated with zero fees, but your donors will also get
				rewarded for every donation made.
				<br />
				<br />
				Some of the additional benefits for projects raising funds on
				Giveth are the ability to:
				<BulletsStyled>
					<li>
						Tap into a new donor audience and new funding streams.
					</li>
					<li>
						Accept donations instantly from anywhere in the world,
						gaining access to a global community.
					</li>
					<li>
						Take advantage of yield bearing opportunities in crypto
						on Giveth.
					</li>
				</BulletsStyled>
			</LeadStyled>
			<br />
			<ExternalLink href='https://youtube.com/playlist?list=PL4Artm1rmCWFi-qEkOtjl9nL4tojSIIKm'>
				<Button label='View Our Entire Project Onboarding Series' />
			</ExternalLink>
		</Wrapper>
	);
};

const BulletsStyled = styled(Bullets)`
	margin-left: 20px;
`;

const LeadStyled = styled(Lead)`
	margin-top: 20px;
`;

const Wrapper = styled.div`
	margin: 80px 0;
`;

export default Header;
