import Image from 'next/image';
import styled from 'styled-components';
import { brandColors, D3, Lead, P } from '@giveth/ui-design-system';

import termsArray from '@/content/Terms';
import FlowerIcon from '/public//images/flower_terms.svg';
import { mediaQueries } from '@/lib/constants/constants';

const TermsBlock = ({ block }: { block: string | string[] }) => {
	if (Array.isArray(block)) {
		return (
			<List>
				{block.map(item => (
					<li key={item}>{item}</li>
				))}
			</List>
		);
	}
	return <Paragraph>{block}</Paragraph>;
};

const TermsIndex = () => {
	return (
		<>
			<FlowerContainer>
				<Image src={FlowerIcon} alt='flower' />
			</FlowerContainer>
			<Wrapper>
				<Title>Terms of Use</Title>
				<Lead>Zug, Switzerland — June 2026</Lead>
				<TermsContainer>
					{termsArray.map(section => (
						<Section key={section.title}>
							<SectionTitle>{section.title}</SectionTitle>
							{section.description.map((block, index) => (
								<TermsBlock key={index} block={block} />
							))}
						</Section>
					))}
				</TermsContainer>
			</Wrapper>
		</>
	);
};

const FlowerContainer = styled.div`
	position: absolute;
	right: 0;
	display: none;

	${mediaQueries.tablet} {
		display: unset;
	}
`;

const TermsContainer = styled.div`
	margin-top: 40px;
`;

const Section = styled.div`
	margin-bottom: 32px;
`;

const SectionTitle = styled(Lead)`
	color: ${brandColors.deep[600]};
	margin-bottom: 12px;
`;

const Paragraph = styled(P)`
	color: ${brandColors.giv[800]};
	text-align: left;
	margin-bottom: 12px;
`;

const List = styled.ul`
	color: ${brandColors.giv[800]};
	text-align: left;
	margin: 0 0 12px;
	padding-left: 24px;

	li {
		margin-bottom: 8px;
	}
`;

const Title = styled(D3)`
	color: ${brandColors.giv[700]};
	margin-bottom: 10px;
`;

const Wrapper = styled.div`
	position: relative;
	margin: 150px auto;
	padding: 0 18px;
	max-width: 1000px;
`;

export default TermsIndex;
