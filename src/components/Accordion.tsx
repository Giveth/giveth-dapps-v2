import { useState } from 'react';
import Image from 'next/image';
import { P, brandColors, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { Shadow } from './styled-components/Shadow';
import ArrowDown from '/public/images/arrow_down.svg';
import ArrowUp from '/public/images/arrow_up.svg';

const Accordion = (props: {
	title: string;
	description?: JSX.Element | string;
	children?: JSX.Element | JSX.Element[];
}) => {
	const [isOpen, setOpen] = useState(false);

	const handleClick = () => setOpen(!isOpen);
	const { title, description, children } = props;

	return (
		<Wrapper>
			<HeadSection onClick={handleClick}>
				<Title>{title}</Title>
				<Image src={isOpen ? ArrowDown : ArrowUp} alt='arrow icon' />
			</HeadSection>
			{isOpen && <BodySection>{description || children}</BodySection>}
		</Wrapper>
	);
};

const BodySection = styled(P)`
	color: ${brandColors.giv[800]};
	text-align: left;
	margin-top: 16px;
	padding: 0 20px 20px 20px;

	a {
		color: #007bff !important;
	}
`;

const Title = styled(Lead)`
	color: ${brandColors.deep[600]};
`;

const HeadSection = styled.div`
	padding: 20px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	gap: 20px;
	user-select: none;

	> :last-child {
		flex-shrink: 0;
	}
`;

const Wrapper = styled.div`
	max-width: 1100px;
	margin: 16px auto;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[500]};
	background: white;
`;

export default Accordion;
