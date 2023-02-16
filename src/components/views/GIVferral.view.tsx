import { Col, Container, Row } from '@/components/Grid';
import { H3, neutralColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';

const GIVferralView = () => {
	return (
		<>
			<Hands />

			<Wrapper>
				<Banner>
					<Content>
						<H3>GIVferral Reward Program</H3>
						<Bold>
							Refer a friend, earn $GIV tokens for every donation.
						</Bold>
					</Content>
				</Banner>
				<Flower1 />
				<Flower2 />
			</Wrapper>
		</>
	);
};

const Wrapper = styled(Container)`
	position: relative;
	width: 100%;
	z-index: 0;
	margin: 100px 0 0 0;
	color: ${neutralColors.gray[100]};
`;

const Hands = styled.div`
	position: absolute;
	background-image: url(/images/givferral/hands.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 477px;
	height: 100%;
	z-index: 1;
	margin-top: 0;
	margin-left: 30px;
`;

const Banner = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	position: relative;
	height: 385px;
	border-radius: 20px;
	background: linear-gradient(252.18deg, #211985 21.35%, #5326ec 67.37%);
	z-index: 0;
	padding-right: 25%;
`;

const Content = styled(Col)`
	max-width: 627px;
`;

const Bold = styled(H3)`
	font-weight: 700;
`;

const Flower1 = styled.div`
	position: absolute;
	right: 5%;
	bottom: 0;
	background-image: url(/images/givferral/flowers.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 83px;
	height: 180px;
	z-index: 1;
`;

const Flower2 = styled(Flower1)`
	width: 83px;
	height: 90px;
	right: 10%;
`;

export default GIVferralView;
