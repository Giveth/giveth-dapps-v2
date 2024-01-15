import { H4, Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

const JoinTheRevolution = () => {
	return (
		<Wrapper>
			<H4 weight={700}>Join the Revolution</H4>
			<Lead>
				Step into a world where your good deeds come full circle. With
				GIVbacks, not only do you help bring about positive change in
				the world, but you also get a stake in a brighter, collective
				future. Welcome to the Future of Giving.
				<br />
				<br />
				Let’s redefine philanthropy, one GIVback at a time.
			</Lead>
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
	}
	> *:nth-child(2) {
	  font-style: italic;
	}
`;

export default JoinTheRevolution;
