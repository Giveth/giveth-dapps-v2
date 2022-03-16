import Image from 'next/image';
import { Shadow } from './styled-components/Shadow';
import { P, Button, H4, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

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
				<P>{caption}</P>
			</TitleBox>
			<ButtonStyled
				label={buttonLabel}
				buttonType='primary'
				onClick={() => window?.open(route, '_blank')?.focus()}
			></ButtonStyled>
		</Wrap>
	);
};

const ButtonStyled = styled(Button)`
	text-transform: uppercase;
	margin: 24px auto 0 auto;
	width: 265px;
	height: 66px;
	padding: 0;
`;

const Title = styled(H4)`
	margin-top: 10px;
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
	width: 485px;
	padding: 0 0 0 84px;
`;

const Wrapper = styled.div`
	z-index: 2;
	background: white;
	text-align: center;
	color: ${brandColors.giv[800]};
	width: 558px;
	height: 500px;
	border-radius: 12px;
	box-shadow: ${Shadow.Dark[500]};
	padding: 64px 85px;
`;

const HorizontalWrap = styled.div`
	z-index: 2;
	display: flex;
	flex-direction: row;
	background: white;
	align-items: center;
	color: ${brandColors.giv[800]};
	width: 1141px;
	height: 220px;
	border-radius: 12px;
	box-shadow: ${Shadow.Dark[500]};
	padding: 75px 72px;
	margin: 26px 0;
`;

export default GeneralCard;
