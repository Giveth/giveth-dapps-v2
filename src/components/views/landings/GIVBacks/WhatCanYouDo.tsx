import styled from 'styled-components';
import {
	brandColors,
	H4,
	H5,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import { OrderedBullets } from '@/components/styled-components/Bullets';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

const WhatCanYouDo = () => {
	return (
		<Wrapper>
			<H4 weight={700}>What can you do with your GIV tokens?</H4>
			<H5>
				When you earn GIV tokens, you can take take part in the Giveth
				ecoystem known as the GIVeconomy. Here are some of the things
				you can use your GIV token for:
			</H5>
			<OrderedBullets>
				<li>
					<b>Shape the future of GIVeconomy in with Voting Power:</b>{' '}
					The GIV tokens you earn can be used in the{' '}
					<ExternalLink
						href={links.GIVERNANCE_VOTING}
						color={brandColors.pinky[500]}
						title='GIVernance Voting'
					/>
					. Here you can participate in shaping the future of the
					GIVeconomy by voting on various proposals that resonate with
					your vision of philanthropy and take part in the governance
					of Giveth.
				</li>
				<li>
					<b>Stake in the GIVfarm and RegenFarms:</b> Earn rewards by
					staking (locking) your GIV in the GIVfarm. Some reward
					opportunities will be from Giveth, while others will be from
					partner DAOs through the RegenFarm program, where we’ve
					partnered with other DAO’s.
				</li>
				<li>
					<b>Earn GIVpower to boost projects:</b> If you lock your GIV
					tokens with Giveth, you can also get GIVpower, which will
					allow you to boost verified projects to improve their
					project ranking. Donors to higher ranked projects will get
					more GIV from our GIVbacks program.
				</li>
				<li>
					<b>Watch Your Impact Grow:</b> Stay updated with regular
					project reports, refer your friends in our{' '}
					<ExternalLink
						href={Routes.Referral}
						color={brandColors.pinky[500]}
						title='referral program'
					/>{' '}
					to earn even more GIV and see firsthand the change your
					donations are making. Plus, as the GIVeconomy grows, so does
					the value and influence of your GIV tokens.
				</li>
			</OrderedBullets>
		</Wrapper>
	);
};

const Wrapper = styled(Lead)`
	max-width: 1180px;
	padding: 120px 30px;
	margin: 0 auto;
	color: ${neutralColors.gray[900]};
	> *:first-child {
		margin-bottom: 16px;
	}
	> h5 {
		color: ${neutralColors.gray[700]};
	}
`;

export default WhatCanYouDo;
