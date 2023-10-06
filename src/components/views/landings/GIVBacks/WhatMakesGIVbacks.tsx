import { H4, Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Bullets } from '@/components/styled-components/Bullets';

const WhatMakesGIVbacks = () => {
	return (
		<Wrapper>
			<H4 weight={700}>What makes GIVbacks so special?</H4>
			<Lead size='large'>
				<Bullets>
					<li>
						<b>Empower & reward every act of giving</b>
						<br />
						Our mission at Giveth is to recognize and incentivize
						those who selflessly give. Through GIVbacks, every
						donation made to our verified projects doesn’t just
						create societal value, but also earns you GIV tokens.
						When you donate to verified projects you qualify to
						receive GIV tokens. Through GIVbacks, GIV empowers
						donors with governance rights via the GIVgarden.
					</li>
					<li>
						<b>A groundbreaking approach to donations</b>
						<br />
						GIVbacks isn’t just another initiative. It's a
						groundbreaking shift in the donation space, offering
						donors an economic advantage like never before.
					</li>
					<li>
						<b>Watch your impact grow</b>
						<br />
						Stay updated with regular project reports, and see
						firsthand the change your donations are making. Plus, as
						the GIVeconomy grows, so does the value and influence of
						your GIV tokens.
					</li>
				</Bullets>
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
`;

export default WhatMakesGIVbacks;
