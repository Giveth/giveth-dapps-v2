import Image from 'next/image';
import { Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';

interface IEmptyBox {
	title: string;
	heartIcon?: boolean;
}

const NothingToSee = ({ title, heartIcon }: IEmptyBox) => {
	return (
		<NothingBox>
			<Image
				src={
					heartIcon
						? '/images/heart-white.svg'
						: '/images/empty-box.svg'
				}
				alt='nothing'
				width={100}
				height={100}
			/>
			<Lead>{title}</Lead>
		</NothingBox>
	);
};

const NothingBox = styled(FlexCenter)`
	flex-direction: column;
	color: ${neutralColors.gray[800]};
	font-size: 20px;
	img {
		padding-bottom: 21px;
	}
`;

export default NothingToSee;
