import styled from 'styled-components';
import { brandColors, H5, Lead, neutralColors } from '@giveth/ui-design-system';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import useDetectDevice from '@/hooks/useDetectDevice';

interface IVerticalNumberedSteps {
	inputArray: {
		title: string;
		description: string;
		element: JSX.Element;
	}[];
}

const VerticalNumberedSteps = ({ inputArray }: IVerticalNumberedSteps) => {
	const { isTablet, isMobile } = useDetectDevice();
	const isMobileView = isMobile || isTablet;
	return isMobileView ? (
		<MobileVersion inputArray={inputArray} />
	) : (
		<DesktopVersion inputArray={inputArray} />
	);
};

const DesktopVersion = ({ inputArray }: IVerticalNumberedSteps) => {
	const len = inputArray.length;
	return (
		<>
			{inputArray.map((i, index) => (
				<DesktopRow
					isLast={len === index + 1}
					index={index}
					key={i.title}
				>
					<DesktopElement>{i.element}</DesktopElement>
					<Number>{index + 1}</Number>
					<Desc>
						<H5 weight={700}>{i.title}</H5>
						<VerLine />
						<Lead size='medium'>{i.description}</Lead>
					</Desc>
				</DesktopRow>
			))}
		</>
	);
};

const MobileVersion = ({ inputArray }: IVerticalNumberedSteps) => {
	return (
		<>
			{inputArray.map((i, index) => (
				<MobileRow key={i.title}>
					<Flex gap='16px' alignItems='center'>
						<Number>{index + 1}</Number>
						<H5 weight={700}>{i.title}</H5>
					</Flex>
					<VerLine />
					<Lead size='medium'>{i.description}</Lead>
					<br />
					<MobileElement>{i.element}</MobileElement>
				</MobileRow>
			))}
		</>
	);
};

const MobileElement = styled.div`
	min-width: 302px;
	min-height: 164px;
	max-width: 432px;
	max-height: 234px;
	aspect-ratio: 432/234;
	border-radius: 8px;
	overflow: hidden;
`;

const MobileRow = styled.div`
	text-align: left;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 432px;
	margin: 64px auto;
`;

const DesktopElement = styled.div`
	width: 432px;
	height: 234px;
	border-radius: 8px;
	overflow: hidden;
`;

const VerLine = styled.div`
	margin: 16px 0;
	height: 1px;
	background: ${neutralColors.gray[300]};
`;

const Desc = styled.div`
	width: 432px;
`;

const Number = styled(FlexCenter)`
	border-radius: 50%;
	width: 50px;
	flex-shrink: 0;
	font-size: 25px;
	height: 50px;
	background: ${brandColors.giv[500]};
	color: white;
	border: 6.4px solid ${brandColors.giv[100]};
	z-index: 1;
`;

const DesktopRow = styled(Flex)<{ index: number; isLast: boolean }>`
	padding: 32px 0;
	position: relative;
	justify-content: space-between;
	align-items: center;
	text-align: left;
	gap: 16px;
	flex-direction: ${({ index }) => (index % 2 === 0 ? 'row' : 'row-reverse')};
	${({ isLast }) =>
		!isLast &&
		`	::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 1px;
		height: 100%;
		background-color: ${neutralColors.gray[500]};
		transform: translateX(-50%);
	}`}
`;

export default VerticalNumberedSteps;
