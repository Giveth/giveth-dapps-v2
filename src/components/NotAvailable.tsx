import Image from 'next/image';
import { brandColors, H4, FlexCenter } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { Spinner } from '@/components/Spinner';
interface IProps {
	isLoading?: boolean;
	description?: string | JSX.Element;
}

const NotAvailable: FC<IProps> = props => {
	const { isLoading, description } = props;
	return isLoading ? (
		<Wrapper>
			<Spinner />
		</Wrapper>
	) : (
		<Wrapper>
			<Image
				src='/images/missing-project.svg'
				width={122.69}
				height={112}
				alt='missing-project-image'
			/>
			<TitleText>{description}</TitleText>
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	background-image: url('/images/backgrounds/background-2.png');
	padding: 260px 5px;
`;

const TitleText = styled(H4)`
	color: ${brandColors.deep[800]};
	text-align: center;
	max-width: 1200px;
	margin: 0 40px;
`;

export default NotAvailable;
