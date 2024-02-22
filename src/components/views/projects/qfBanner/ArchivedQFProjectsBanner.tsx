import { Container, Row } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import {
	BannerContainer,
	ImgTopRight,
	ImgBottomRight,
	ImgTopLeft,
	ImgBottomLeft,
	StyledCol,
	Name,
	Title,
} from './common';
import { useProjectsContext } from '@/context/projects.context';

export const ArchivedQFProjectsBanner = () => {
	const { formatMessage } = useIntl();
	const { query } = useRouter();
	const { qfRounds } = useProjectsContext();
	const round = qfRounds.find(round => round.slug === query.slug);

	return (
		<BannerContainer>
			<Image
				src={'/images/banners/qf-round/bg.svg'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<ImgTopRight
				src={'/images/banners/qf-round/top-right.png'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgBottomRight
				src={'/images/banners/qf-round/bottom-right.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgTopLeft
				src={'/images/banners/qf-round/top-left.svg'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<ImgBottomLeft
				src={'/images/banners/qf-round/bottom-left.png'}
				style={{ objectFit: 'cover' }}
				alt='QF OP'
			/>
			<Container>
				<Row>
					<StyledCol xs={12} md={12}>
						<Title weight={700}>
							{formatMessage({ id: 'label.quadratic_funding' })}
						</Title>
						<Name>{round ? round.name : null}</Name>
					</StyledCol>
				</Row>
			</Container>
		</BannerContainer>
	);
};
