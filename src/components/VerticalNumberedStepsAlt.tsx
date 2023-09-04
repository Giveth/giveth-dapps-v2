import {
	brandColors,
	ButtonText,
	H5,
	IconExternalLink32,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';

interface IVerticalNumberedSteps {
	inputArray: {
		title: string;
		description: string;
		buttonText?: string;
		buttonLink?: string;
		element: JSX.Element;
	}[];
}

const VerticalNumberedStepsAlt = ({ inputArray }: IVerticalNumberedSteps) => {
	return (
		<>
			{inputArray.map((i, index) => (
				<Row index={index} key={i.title}>
					<Desc>
						<Flex gap='16px' alignItems='center'>
							<Number>{index + 1}</Number>
							<H5 weight={700}>{i.title}</H5>
						</Flex>
						<VerLine />
						<Lead size='medium'>{i.description}</Lead>
						{i.buttonText && (
							<ExternalLink href={i.buttonLink!}>
								<ButtonWrapper>
									<ButtonText>{i.buttonText}</ButtonText>
									<IconExternalLink32 />
								</ButtonWrapper>
							</ExternalLink>
						)}
					</Desc>
					<Element>{i.element}</Element>
				</Row>
			))}
		</>
	);
};

const ButtonWrapper = styled(FlexCenter)`
	gap: 10px;
	flex-wrap: wrap;
	margin-top: 16px;
	color: ${brandColors.pinky[500]};
`;

const Number = styled(FlexCenter)`
	border-radius: 50%;
	width: 32px;
	height: 32px;
	flex-shrink: 0;
	font-size: 16px;
	background: ${brandColors.giv[500]};
	color: white;
	border: 4px solid ${brandColors.giv[100]};
`;

const VerLine = styled.div`
	margin: 16px 0;
	height: 1px;
	background: ${neutralColors.gray[300]};
`;

const Desc = styled.div`
	max-width: 432px;
	flex: 1 1 0;
`;

const Element = styled.div`
	width: 100%;
	aspect-ratio: 432/234;
	border-radius: 8px;
	overflow: hidden;
	${mediaQueries.mobileL} {
		max-width: 432px;
		aspect-ratio: 432/234;
	}
	${mediaQueries.laptopS} {
		flex: 1 1 0;
	}
`;

const Row = styled(Flex)<{ index: number }>`
	padding: 32px 0;
	position: relative;
	justify-content: space-between;
	align-items: center;
	text-align: left;
	max-width: 1072px;
	gap: 40px;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: ${({ index }) =>
			index % 2 === 0 ? 'row' : 'row-reverse'};
	}
`;

export default VerticalNumberedStepsAlt;
