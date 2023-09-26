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
import links from '@/lib/constants/links';

const HowGIVbacksWork = () => {
	return (
		<Wrapper>
			<H4 weight={700}>How Do GIVbacks Work?</H4>
			<H5>
				Givbacks are built on the principles of transparency, trust, and
				reward:
			</H5>
			<OrderedBullets>
				<li>
					<b>Select a Verified Project:</b> Browse through our list of
					impactful and vetted projects. Project Verification​.
					'Verified' is a seal of approval for legitimate projects on
					Giveth. If you are a project owner, when you get your
					project verified, your donors become eligible to receive
					GIVbacks. On Giveth verified projects receive more
					donations.
				</li>
				<li>
					<b>Donate Directly:</b> Once you've chosen a project that
					resonates with you, make your donation. The beauty of
					GIVbacks is that 100% of your donation directly benefits the
					project, ensuring maximum impact.
				</li>
				<li>
					<b>Earn GIV Tokens:</b> After your donation, Giveth rewards
					you with GIV tokens as a thank you for your generosity.
					These tokens aren't just a reward, they're a representation
					of your contribution to the GIVeconomy. Part will be liquid,
					and part will be added to your{' '}
					<ExternalLink
						href={links.GIVSTREAM_DOCS}
						color={brandColors.pinky[500]}
						title='GIVstream'
					/>{' '}
					(streamed to you over a period of time), which will grow
					until 2026.
				</li>
				<li>
					<b>When Do Your Receive Your GIVbacks?:</b> Every two weeks,
					we run a GIVbacks round where we calculate donations and
					distribute GIV tokens to our generous donors.
				</li>
				<li>
					<b>Where Do You Receive Your GIVbacks?</b> At the moment,
					GIVbacks are rewarded on the Gnosis and Optimism chain. You
					can learn more about GIVbacks{' '}
					<ExternalLink
						href={links.GIVBACK_DOC}
						color={brandColors.pinky[500]}
						title='here'
					/>
					.
				</li>
			</OrderedBullets>
		</Wrapper>
	);
};

const Wrapper = styled(Lead)`
	max-width: 1180px;
	padding: 120px 30px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
	> *:first-child {
		margin-bottom: 16px;
	}
	> h5 {
	  color: ${neutralColors.gray[700]};
	}
`;

export default HowGIVbacksWork;
