import { semanticColors, H1, B, Lead } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Image from 'next/image';
import { useProjectsContext } from '@/context/projects.context';
import { BannerContainer } from './ProjectsBanner';
import { Flex } from '@/components/styled-components/Flex';

export const QFProjectsBanner = () => {
	const { formatMessage } = useIntl();
	const { qfRounds } = useProjectsContext();

	return (
		<BannerContainer direction='column'>
			<Image
				src={'/images/banners/qfBanner.png'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<Title weight={700}>
				{formatMessage({ id: 'label.quadratic_funding_round' })}
			</Title>
			<Desc>
				<Lead>{formatMessage({ id: 'label.round_ends_in' })}</Lead>
				<B>Ye Vaghti</B>
			</Desc>
		</BannerContainer>
	);
};

const Title = styled(H1)`
	z-index: 1;
	color: ${semanticColors.golden[500]};
	margin-bottom: 32px;
`;

const Desc = styled(Flex)`
	z-index: 1;
	color: ${semanticColors.jade[100]};
	align-items: center;
	gap: 8px;
`;
