import React, { useState } from 'react';
import {
	brandColors,
	Button,
	H3,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Relative } from '@/components/styled-components/Position';
import QuarterCircle from '@/components/particles/QuarterCircle';
import Wave from '@/components/particles/Wave';
import QuarterArc from '@/components/particles/QuarterArc';
import SubscribeNewsletter from '@/components/modals/SubscribeNewsletter';

const GetUpdates = () => {
	const { formatMessage } = useIntl();
	const [showModal, setShowModal] = useState(false);

	return (
		<Wrapper>
			<InnerWrapper>
				<H3 weight={700}>
					{formatMessage({ id: 'section.get_the_latest_updates' })}
				</H3>
				<Lead>
					{formatMessage({
						id: 'section.subscribe_to_our_newsletter',
					})}
				</Lead>
				<LeadStyled>
					{formatMessage({ id: 'section.we_wont_send_it' })}
				</LeadStyled>
				<Button
					label={formatMessage({ id: 'component.button.subscribe' })}
					size='small'
					onClick={() => setShowModal(true)}
				/>
				<QuarterCircleStyle>
					<QuarterCircle color={brandColors.pinky[500]} />
				</QuarterCircleStyle>
				<QuarterArcStyle>
					<QuarterArc color={brandColors.giv[200]} />
				</QuarterArcStyle>
			</InnerWrapper>
			<PinkWaveStyle>
				<Wave color={brandColors.pinky[200]} />
			</PinkWaveStyle>
			<GivWaveStyle>
				<Wave color={brandColors.giv[200]} />
			</GivWaveStyle>
			{showModal && <SubscribeNewsletter setShowModal={setShowModal} />}
		</Wrapper>
	);
};

const QuarterArcStyle = styled.div`
	position: absolute;
	bottom: 40px;
	display: none;
	${mediaQueries.tablet} {
		left: 200px;
		display: block;
	}
`;

const GivWaveStyle = styled.div`
	position: absolute;
	bottom: 90px;
	display: none;
	${mediaQueries.tablet} {
		display: block;
		right: -59px;
	}
	${mediaQueries.laptopL} {
		right: -50px;
	}
`;

const PinkWaveStyle = styled.div`
	position: absolute;
	top: 40px;
	display: none;
	${mediaQueries.tablet} {
		display: block;
		left: 0;
	}
`;

const QuarterCircleStyle = styled.div`
	position: absolute;
	top: 10px;
	display: none;
	${mediaQueries.tablet} {
		right: 60px;
		display: block;
	}
`;

const Wrapper = styled(Relative)`
	background: ${neutralColors.gray[200]};
	overflow: hidden;
`;

const LeadStyled = styled(Lead)`
	color: ${neutralColors.gray[700]};
`;

const InnerWrapper = styled(Relative)`
	padding: 30px 24px 45px;
	text-align: center;
	margin: 0 auto;
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 15px;
	> h3 {
		color: ${brandColors.giv[500]};
	}
	> button {
		padding-left: 58px;
		padding-right: 58px;
	}
`;

export default GetUpdates;
