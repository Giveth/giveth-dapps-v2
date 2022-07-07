import Image from 'next/image';
import styled from 'styled-components';
import { brandColors, H4 } from '@giveth/ui-design-system';
import { useRouter } from 'next/router';

import { FlexCenter } from '@/components/styled-components/Flex';
import SimilarProjects from '@/components/views/project/SimilarProjects';

const NotAvailableProject = () => {
	const router = useRouter();
	const slug = router.query.projectIdSlug as string;

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
			<SimilarProjects slug={slug} />
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
