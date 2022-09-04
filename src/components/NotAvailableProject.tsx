import Image from 'next/image';
import styled from 'styled-components';
import { brandColors, H4 } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';

const NotAvailableProject = () => {
	return (
		<Wrapper>
			<Image
				src='/images/missing-project.svg'
				width={122.69}
				height={112}
				alt='missing-project-image'
			/>
			<TitleText>
				Oops! This project is no longer available or not found!
			</TitleText>
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	background-image: url('/images/backgrounds/background-2.png');
	padding: 160px 5px;
`;

const TitleText = styled(H4)`
	color: ${brandColors.deep[800]};
	text-align: center;
`;

export default NotAvailableProject;
