import Image from 'next/image';
import SearchBox from '../SearchBox';
import Accordion from '../Accordion';
import FAQArray from '@/content/FAQs.json';
import { Arc } from '@/components/styled-components/Arc';
import FlowerIcon from '/public//images/flower_faq.svg';
import { brandColors, D3, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';

const FAQIndex = () => {
	return (
		<>
			<PurpleArc />
			<Wrapper>
				<MustardArc />
				<FlowerContainer>
					<Image src={FlowerIcon} alt='flower' />
				</FlowerContainer>
				<Title>How can we help you?</Title>
				<Lead>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Lectus urna orci vel commodo.
				</Lead>
				<SearchStyles>
					{/*TODO implement search*/}
					<SearchBox
						onChange={console.log}
						placeholder='What are you looking for?'
					/>
				</SearchStyles>
				<FAQContainer>
					{FAQArray.map(i => (
						<Accordion
							key={i.question}
							title={i.question}
							description={i.answer}
						/>
					))}
				</FAQContainer>
			</Wrapper>
		</>
	);
};

const FlowerContainer = styled.div`
	position: absolute;
	right: 0;
	bottom: 150px;
`;

const PurpleArc = styled(Arc)`
	border-width: 100px;
	border-color: ${brandColors.deep[200]} ${brandColors.deep[200]} transparent
		transparent;
	bottom: 0;
	left: -350px;
	width: 700px;
	height: 700px;
	transform: rotate(45deg);
	z-index: 0;
	opacity: 0.2;
`;

const MustardArc = styled(Arc)`
	border-width: 40px;
	border-color: ${`transparent transparent ${brandColors.mustard[500]} ${brandColors.mustard[500]}`};
	top: 600px;
	right: -140px;
	width: 280px;
	height: 280px;
	transform: rotate(45deg);
	z-index: 0;
	opacity: 0.3;
`;

const FAQContainer = styled.div`
	margin: 0 150px 150px 150px;
	position: relative;
`;

const SearchStyles = styled.div`
	margin-top: 34px;
	margin-bottom: 91px;
`;

const Title = styled(D3)`
	color: ${brandColors.giv[700]};
	margin-top: 195px;
	margin-bottom: 16px;
`;

const Wrapper = styled.div`
	text-align: center;
	position: relative;
	overflow: hidden;
`;

export default FAQIndex;
