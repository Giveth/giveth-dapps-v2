import { D3, H4, brandColors, deviceSize } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

import { mediaQueries } from '@/lib/constants/constants';
import { Arc } from '@/components/styled-components/Arc';

const JoinIndex = () => {
	const { formatMessage } = useIntl();
	return (
		<UpperSection>
			<ArcBig />
			<ArcCyan />
			<ArcMustard />
			<TextContainer>
				<D3Styled>
					{formatMessage({
						id: 'component.title.join_our_community',
					})}
				</D3Styled>
				<H4>
					{formatMessage({
						id: 'label.building_the_future_of_giving',
					})}
				</H4>
			</TextContainer>
		</UpperSection>
	);
};

const D3Styled = styled(D3)`
	@media only screen and (max-width: ${deviceSize.tablet}px) {
		font-size: 3.5rem;
	}
`;

const ArcBig = styled(Arc)`
	border-width: 150px;
	border-color: ${brandColors.deep[200]};
	top: -1000px;
	right: -900px;
	width: 1740px;
	height: 1740px;
	opacity: 20%;
	z-index: 1;
`;

const ArcCyan = styled(Arc)`
	border-width: 50px;
	border-color: transparent ${brandColors.cyan[500]} ${brandColors.cyan[500]}
		transparent;
	transform: rotate(45deg);
	top: 300px;
	left: -80px;
	width: 420px;
	height: 420px;
	z-index: 0;
`;

const ArcMustard = styled(Arc)`
	border-width: 50px;
	border-color: transparent ${brandColors.mustard[500]}
		${brandColors.mustard[500]} transparent;
	transform: rotate(225deg);
	top: 120px;
	right: -100px;
	width: 420px;
	height: 420px;
	z-index: 0;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	justify-content: center;
	height: 100%;
	padding: 0;
	margin-top: 16px;
	* {
		z-index: 2;
	}

	${mediaQueries.tablet} {
		margin-top: 0;
	}
`;

const UpperSection = styled.div`
	background: ${brandColors.giv[500]};
	background-image: url('/images/GIV_homepage.svg');
	height: 794px;
	color: white;
	overflow: hidden;
	position: relative;
	padding: 18px;

	${mediaQueries.tablet} {
		padding: 150px 130px;
	}
`;

export default JoinIndex;
