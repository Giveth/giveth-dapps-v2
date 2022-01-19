import { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Image from 'next/image';
import { Shadow } from './styled-components/Shadow';
import ArrowDown from '/public/images/arrow_down.svg';
import ArrowUp from '/public/images/arrow_up.svg';
import { P, brandColors, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';

const Accordion = (props: { title: string; description: string }) => {
	const [isOpen, setOpen] = useState(false);

	const handleClick = () => setOpen(!isOpen);
	const { title, description } = props;

	return (
		<Wrapper>
			<HeadSection onClick={handleClick}>
				<Title>{title}</Title>
				<Image src={isOpen ? ArrowDown : ArrowUp} alt='arrow down' />
			</HeadSection>
			{isOpen && (
				<BodySection>{ReactHtmlParser(description)}</BodySection>
			)}
		</Wrapper>
	);
};

const BodySection = styled(P)`
	color: ${brandColors.giv[800]};
	text-align: left;
	margin-top: 16px;

	a {
		color: #007bff !important;
		&:hover {
			text-decoration: underline !important;
		}
	}
`;

const Title = styled(Lead)`
	color: ${brandColors.deep[600]};
`;

const HeadSection = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: space-between;
`;

const Wrapper = styled.div`
	max-width: 1100px;
	margin: 16px auto;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[500]};
	background: white;
	padding: 20px 32px 20px 20px;
`;

export default Accordion;
