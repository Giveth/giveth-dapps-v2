import styled from 'styled-components';
import { brandColors, H3, Lead } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const WhatIsGiv = () => {
	return (
		<Wrapper>
			<H3 weight={700}>What is GIV?</H3>
			<LeadStyled size='large'>
				Giveth is powered by our native cryptocurrency token - GIV. You
				can buy give on the open market, or you can get GIV as a reward
				for donating to{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href={links.VERIFICATION_DOCS}
					title='verified projects'
				/>{' '}
				(through our{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href={links.GIVBACK_DOC}
					title='GIVbacks'
				/>{' '}
				program).
				<br />
				<br />
				GIV holders are stakeholders in the Giveth DAO (decentralized
				autonomous organization). GIV is used by our community of
				donors, projects, and advocates to govern our organization
				through on-chain votes, where we make decisions about which{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href='https://snapshot.org/#/giv.eth'
					title='proposals Giveth should fund'
				/>{' '}
				or which{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href='https://tokenlog.generalmagic.io/Giveth/Roadmap'
					title='roadmap features we should prioritize'
				/>{' '}
				.
				<br />
				<br />
				You can also use your GIV to influence which Giveth projects are
				ranked the highest on the platform. Top-ranked projects benefit
				from visibility, and because their donors get a larger amount of
				GIV rewards, when you participate in this program - called{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href='https://medium.com/giveth/givpower-boosting-public-goods-to-the-next-level-bd335f92ecd3'
					title='GIVpower'
				/>{' '}
				- you also earn additional GIV rewards!
			</LeadStyled>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 80px 0;
`;

const LeadStyled = styled(Lead)`
	margin-top: 20px;
`;

export default WhatIsGiv;
