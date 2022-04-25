import Image from 'next/image';
import {
	Wrapper,
	ButtonStyled,
	Caption,
	Title,
	HorizontalTitleSection,
	HorizontalWrap,
	TitleSection,
} from './GeneralCard.sc';
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

export default GeneralCard;
