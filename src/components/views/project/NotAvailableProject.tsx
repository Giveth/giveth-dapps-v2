import Image from 'next/image';
import styled from 'styled-components';
import { brandColors, neutralColors, H4, H6 } from '@giveth/ui-design-system';
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
			<TitleText>Oops! This project is no longer available!</TitleText>
			<SubtitleText>Take a look at similar projects</SubtitleText>
			<SimilarProjects slug={slug} />
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	background-image: url('/images/backgrounds/background-2.png');
	padding: 160px 35px;
`;

const TitleText = styled(H4)`
	color: ${brandColors.deep[800]};
	text-align: center;
`;

const SubtitleText = styled(H6)`
	margin: 54px 0 0 0;
	color: ${neutralColors.gray[900]};
`;

export default NotAvailableProject;
