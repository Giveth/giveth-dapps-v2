import styled from 'styled-components';
import { brandColors, H5, neutralColors } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const GiveAndGetGIVback = () => {
	return (
		<Wrapper>
			<H5>Give and get GIV back!</H5>
			<ExternalLink
				color={brandColors.pinky[500]}
				href={links.GIVBACK_DOC}
				title='Discover More about GIVbacks'
			/>
			<br />
			<ExternalLink
				color={brandColors.pinky[500]}
				href='https://blog.giveth.io/what-if-giving-gave-back-using-web3-to-evolve-philanthropy-a8500b7636ce'
				title='Learn How GIVbacks Is Evolving Philanthropy'
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	max-width: 1180px;
	padding: 120px 30px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
	> *:first-child {
		margin-bottom: 16px;
	    color: ${neutralColors.gray[700]};
	}
`;

export default GiveAndGetGIVback;
