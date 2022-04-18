import Image from 'next/image';
import { Shadow } from './styled-components/Shadow';
import { P, Button, H4, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { FlexCenter } from '@/components/styled-components/Flex';

interface IContent {
	icon: string;
	title: string;
	caption: string;
	buttonLabel: string;
	route?: string;
}

const GeneralCard = (props: { content: IContent; isHorizontal?: boolean }) => {
	const { icon, title, caption, buttonLabel, route } = props.content;
	let Wrap = Wrapper;
	let TitleBox = TitleSection;
	if (props.isHorizontal) {
		Wrap = HorizontalWrap;
		TitleBox = HorizontalTitleSection;
	}
	return (
		<Wrap>
			<Image src={icon} alt='title' />
			<TitleBox>
				<Title>{title}</Title>
				<Caption>{caption}</Caption>
			</TitleBox>
			<ButtonStyled
				label={buttonLabel}
				buttonType='primary'
				onClick={() => window?.open(route, '_blank')?.focus()}
			/>
		</Wrap>
	);
};

const ButtonStyled = styled(Button)`
	text-transform: uppercase;
	margin: 24px auto 0 auto;
	width: 265px;
	height: 66px;
	padding: 0;
	min-height: 33px;
`;

const Title = styled(H4)`
	margin-top: 10px;
	max-width: calc(100vw - 72px);
`;

const Caption = styled(P)`
	max-width: calc(100vw - 72px);
`;

const TitleSection = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
`;

const HorizontalTitleSection = styled.div`
	display: flex;
	flex-direction: column;
	text-align: left;
	max-width: calc(100vw - 72px);

	${mediaQueries.mobileS} {
		padding: 0;
	}

	${mediaQueries.tablet} {
		padding: 0 0 0 84px;
		width: 485px;
	}
`;

const Wrapper = styled(FlexCenter)`
	z-index: 2;
	background: white;
	text-align: center;
	color: ${brandColors.giv[800]};
	max-width: 558px;
	width: 100%;
	border-radius: 12px;
	box-shadow: ${Shadow.Dark[500]};
	flex-direction: column;
	padding: 36px 32px;

	${mediaQueries.tablet} {
		padding: 64px 85px;
		height: 500px;
	}
`;

const HorizontalWrap = styled.div`
	z-index: 2;
	display: flex;
	background: white;
	align-items: center;
	color: ${brandColors.giv[800]};

	border-radius: 12px;
	box-shadow: ${Shadow.Dark[500]};
	margin: 26px 0;

	${mediaQueries.mobileS} {
		flex-direction: column;
		padding: 36px 32px;
		max-width: calc(100vw - 36px);
	}

	${mediaQueries.tablet} {
		flex-direction: row;
		padding: 75px 72px;
		max-width: 1141px;
		height: 220px;
	}
`;

export default GeneralCard;
