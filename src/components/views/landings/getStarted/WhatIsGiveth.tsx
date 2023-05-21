import styled from 'styled-components';
import { brandColors, H3, Lead } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';

const WhatIsGiveth = () => {
	return (
		<Wrapper>
			<H3 weight={700}>What is Giveth?</H3>
			<LeadStyled size='large'>
				Giveth is a crypto donation platform that supports public goods
				projects and also has a greater mission of supporting them to
				build their own microeconomies. We have our own token called the
				GIV token, used to govern our organization and build the
				GIVeconomy. Using web3 technology, our intent is to establish a
				new paradigm of impact investing and eliminate sacrifice from
				value creation and the support for good causes.
				<br />
				<br />
				At Giveth you can invest in projects you believe in, while
				donating to them and actually earning rewards in return. Read
				our article{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href='https://blog.giveth.io/evolving-nonprofits-into-regen-economies-f8282f97f8d3'
					title='Evolving Nonprofits into Regen Economies'
				/>{' '}
				to learn more.
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

export default WhatIsGiveth;
