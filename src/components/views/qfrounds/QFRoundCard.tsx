// src/components/views/qfrounds/QFRoundCard.tsx

'use client';

import Image from 'next/image';
import styled, { css } from 'styled-components';
import {
	B,
	P,
	SublineBold,
	Button,
	neutralColors,
	semanticColors,
	brandColors,
	deviceSize,
} from '@giveth/ui-design-system';

type Layout = 'horizontal' | 'grid';

export interface QFRoundCardProps {
	layout?: Layout;
	title: string;
	description: string;
	imageUrl: string;
	matchingPoolUsd?: number;
	startDate?: string; // ISO or display-ready
	endDate?: string;
	onExplore?: () => void;
	exploreLabel?: string;
}

export default function QFRoundCard({
	layout = 'grid',
	title,
	description,
	imageUrl,
	matchingPoolUsd,
	startDate,
	endDate,
	onExplore,
	exploreLabel = 'Explore Projects',
}: QFRoundCardProps) {
	return (
		<Card $layout={layout}>
			{layout === 'horizontal' ? (
				<>
					<Media $layout={layout}>
						<MediaInner>
							<Image
								src={imageUrl}
								alt={title}
								fill
								style={{ objectFit: 'cover' }}
								unoptimized
							/>
						</MediaInner>
					</Media>

					<Content>
						<Title $layout={layout}>{title}</Title>

						<Desc>{description}</Desc>

						{matchingPoolUsd && (
							<MetaGrid>
								{typeof matchingPoolUsd === 'number' && (
									<Chip>
										<span>
											${matchingPoolUsd.toLocaleString()}
										</span>
										<ChipNote>Matching Pool</ChipNote>
									</Chip>
								)}
							</MetaGrid>
						)}

						<FooterWrapper>
							{startDate && endDate && (
								<Dates>
									<B>
										{startDate} – {endDate}
									</B>
								</Dates>
							)}
							<Actions>
								<Button
									buttonType='primary'
									label={exploreLabel}
								/>
							</Actions>
						</FooterWrapper>
					</Content>
				</>
			) : (
				// grid (stacked) layout
				<>
					<Title $layout={layout}>{title}</Title>

					<Media $layout={layout}>
						<MediaInner>
							<Image
								src={imageUrl}
								alt={title}
								fill
								style={{ objectFit: 'cover' }}
								unoptimized
							/>
						</MediaInner>
					</Media>

					<Content>
						<Desc>{description}</Desc>

						{(matchingPoolUsd || (startDate && endDate)) && (
							<MetaGrid>
								{startDate && endDate && (
									<Dates>
										<B>
											{startDate} – {endDate}
										</B>
									</Dates>
								)}
								{typeof matchingPoolUsd === 'number' && (
									<Chip>
										<B>
											${matchingPoolUsd.toLocaleString()}
										</B>
										<ChipNote>Matching Pool</ChipNote>
									</Chip>
								)}
							</MetaGrid>
						)}

						{onExplore && (
							<Actions>
								<Button
									buttonType='primary'
									label={exploreLabel}
									onClick={onExplore}
								/>
							</Actions>
						)}
					</Content>
				</>
			)}
		</Card>
	);
}

const Card = styled.div<{ $layout: Layout }>`
	display: grid;
	gap: 42px;
	background: ${neutralColors.gray[100]};
	border-radius: 16px;
	box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);

	${({ $layout }) =>
		$layout === 'horizontal'
			? css`
					padding: 24px;
					flex: 1 0 100%;
					grid-template-columns: 1fr 1fr;
					align-items: center;

					@media (max-width: ${deviceSize.laptopS}px) {
						grid-template-columns: 1fr;
					}
				`
			: css`
					padding: 16px;
					/* 3 per row on desktop (gap = 32px -> two gaps per row) */
					flex: 1 1 calc((100% - 2 * 32px) / 3);
					max-width: calc((100% - 2 * 32px) / 3);

					/* 2 per row on tablet */
					@media (max-width: ${deviceSize.laptopS}px) {
						flex-basis: calc((100% - 32px) / 2);
						max-width: calc((100% - 32px) / 2);
					}

					/* 1 per row on mobile */
					@media (max-width: ${deviceSize.tablet}px) {
						flex-basis: 100%;
						max-width: 100%;
					}

					grid-template-columns: 1fr;
				`}
`;

const Media = styled.div<{ $layout: Layout }>`
	position: relative;
	width: 100%;
	overflow: hidden;
	border-radius: 14px;

	${({ $layout }) =>
		$layout === 'horizontal'
			? css`
					/* 16:9-ish for featured */
					aspect-ratio: 16 / 9;

					@media (max-width: ${deviceSize.laptopS}px) {
						aspect-ratio: 16 / 9;
					}
				`
			: css`
					/* banner-ish for grid cards */
					aspect-ratio: 7 / 3;
				`}
`;

const MediaInner = styled.div`
	position: relative;
	inset: 0;
	width: 100%;
	height: 100%;
`;

const Content = styled.div`
	display: grid;
	grid-template-rows: auto;
	gap: 12px;
	height: 100%;
`;

const Title = styled.h3<{ $layout: Layout }>`
	margin: 0;
	font-size: 25px;
	font-weight: 700;
	color: ${neutralColors.gray[900]};

	${({ $layout }) =>
		$layout === 'horizontal' &&
		css`
			font-size: 32px;
		`}
`;

const Desc = styled(P)`
	margin: 0;
	color: ${neutralColors.gray[800]};
`;

const MetaGrid = styled.div`
	display: flex;
	width: 100%;
	margin-top: 24px;
	flex-direction: row;
	padding: 10px;
	gap: 12px;
	align-items: center;
	justify-content: center;
	border: 1.85px solid ${neutralColors.gray[300]};
	border-radius: 16px;
`;

const Chip = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 8px;

	font-size: 20px;
	font-weight: 400;
	color: ${neutralColors.gray[900]};

	span {
		font-size: 25px;
		font-weight: 700;
		color: ${neutralColors.gray[900]};
	}
`;

const ChipNote = styled(SublineBold)`
	font-size: 20px;
  font-weight: 400;
	color: ${neutralColors.gray[900]};
`;

const Dates = styled.div`
	color: ${brandColors.deep[900]};
`;

const FooterWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Actions = styled.div`
	margin-top: 4px;
	display: flex;
	justify-content: flex-end;

	@media (max-width: ${deviceSize.mobileS}px) {
		justify-content: stretch;
		button {
			width: 100%;
		}
	}
`;

const OpenBadge = styled(SublineBold)`
	padding: 4px 10px;
	background: ${semanticColors.jade[500]};
	color: ${neutralColors.gray[100]};
	border-radius: 999px;
`;
