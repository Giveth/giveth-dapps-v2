import styled from 'styled-components';
import { H1, Lead } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import Input from '@/components/styled-components/Input';
import { Bullets } from '@/components/styled-components/Bullets';

const Header = () => {
	return (
		<>
			<HeadWrapper>
				<H1 weight={700}>Get started with Giveth</H1>
				<Lead>
					A step-by-step beginner’s guide to the Future of Giving
				</Lead>
			</HeadWrapper>
			<Body>
				<LeadStyled size='large'>
					Enter your email to get our free guide
				</LeadStyled>
				<br />
				<Input placeholder='Your email address' />
				<LeadStyled size='large'>
					Giveth is a crypto donation platform & vibrant community
					centered around Building the Future of Giving and completely
					transforming how we fund nonprofits and social causes.
					<br />
					<br />
					Our easy-to-use crypto donation platform allows users around
					the world to instantly send cryptocurrency to impactful
					projects on the ground.
					<br />
					<br />
					So what makes Giveth so special?
					<BulletsStyled>
						<li>
							<span>We take zero fees.</span> 100% of your
							donation goes directly to the project you’re
							donating to.
						</li>
						<li>
							<span>
								Everything is transparent and public for anyone
								to see (on the blockchain).
							</span>{' '}
							That means you can be sure your money is going where
							it’s supposed to.
						</li>
						<li>
							<span>You get rewarded for donating.</span> Every
							donation to verified projects makes you eligible to
							receive GIV tokens, which give you voting power in
							our community and provide additional opportunities
							to earn rewards.
						</li>
					</BulletsStyled>
				</LeadStyled>
			</Body>
		</>
	);
};

const BulletsStyled = styled(Bullets)`
	margin-left: 20px;
	span {
		font-weight: 500;
	}
`;

const LeadStyled = styled(Lead)`
	margin-top: 40px;
`;

const Body = styled.div`
	margin-top: 80px;
`;

const HeadWrapper = styled(FlexCenter)`
	border-radius: 16px;
	flex-direction: column;
	gap: 20px;
	background-image: url('/images/banners/categories/all.png');
	background-size: cover;
	height: 530px;
	width: 100%;
	color: white;
	> * {
		margin: 0 50px;
	}
`;

export default Header;
