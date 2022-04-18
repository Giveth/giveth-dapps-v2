import Image from 'next/image';
import { Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface IEmptyBox {
	title: string;
	heartIcon?: boolean;
}

const NothingToSee = ({ title, heartIcon }: IEmptyBox) => {
	return (
		<NothingBox>
			<Image
				width='100%'
				height='100%'
				src={
					heartIcon
						? '/images/heart-white.svg'
						: '/images/empty-box.svg'
				}
				alt='nothing'
			/>
			<Lead>{title}</Lead>
		</NothingBox>
	);
};

const NothingBox = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	align-items: center;
	color: ${neutralColors.gray[800]};
	font-size: 20px;
	img {
		padding-bottom: 21px;
	}
`;

export default NothingToSee;
