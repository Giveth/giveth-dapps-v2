import Image from 'next/image';
import styled from 'styled-components';
import { brandColors, H4 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const NotAvailableProject = () => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<Image
				src='/images/missing-project.svg'
				width={122.69}
				height={112}
				alt='missing-project-image'
			/>
			<TitleText>
				{formatMessage({ id: 'label.project_not_available' })}{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href={links.DISCORD}
					title='Discord'
				/>
				.
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
