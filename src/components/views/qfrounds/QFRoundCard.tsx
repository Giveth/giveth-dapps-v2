// src/components/views/qfrounds/QFRoundCard.tsx

'use client';

import Image from 'next/image';
import styled, { css } from 'styled-components';
import {
	P,
	SublineBold,
	neutralColors,
	brandColors,
	deviceSize,
	ButtonLink,
	IconChevronRight24,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Link from 'next/link';

type Layout = 'horizontal' | 'grid';

export interface QFRoundCardProps {
	layout?: Layout;
	title: string;
	description: string;
	imageUrl: string;
	matchingPoolUsd?: number;
	startDate?: string; // ISO or display-ready
	endDate?: string;
	linkUrl?: string;
}

export default function QFRoundCard({
	layout = 'grid',
	title,
	description,
	imageUrl,
	matchingPoolUsd,
	startDate,
	endDate,
	linkUrl,
}: QFRoundCardProps) {
	const { formatMessage } = useIntl();

	return (
		<Card $layout={layout}>
			{layout === 'horizontal' ? (
				<>
					{imageUrl && (
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
					)}

					<Content>
						<Title $layout={layout}>{title}</Title>

						<Desc>{description}</Desc>

						{matchingPoolUsd && (
							<MetaGrid $layout={layout}>
								{typeof matchingPoolUsd === 'number' && (
									<Chip $layout={layout}>
										<span>
											${matchingPoolUsd.toLocaleString()}
										</span>
										<ChipNote>
											{formatMessage({
												id: 'label.matching_pool',
											})}
										</ChipNote>
									</Chip>
								)}
							</MetaGrid>
						)}

						<FooterWrapper>
							{startDate && endDate && (
								<Dates $layout={layout}>
									{startDate} – {endDate}
								</Dates>
							)}
							<Actions $layout={layout}>
								<Link href={linkUrl || ''}>
									<ButtonLinkWrapper
										label={formatMessage({
											id: 'label.qf.explore_projects',
										})}
										icon={<IconChevronRight24 />}
									/>
								</Link>
							</Actions>
						</FooterWrapper>
					</Content>
				</>
			) : (
				// grid (stacked) layout
				<>
					<Title $layout={layout}>{title}</Title>

					<Media $layout={layout}>
						{imageUrl && (
							<MediaInner>
								<Image
									src={imageUrl}
									alt={title}
									fill
									style={{ objectFit: 'cover' }}
									unoptimized
								/>
							</MediaInner>
						)}
					</Media>

					<Content>
						<Desc>{description}</Desc>
						{startDate && endDate && (
							<Dates $layout={layout}>
								{startDate} – {endDate}
							</Dates>
						)}
						{matchingPoolUsd && (
							<MetaGrid $layout={layout}>
								{typeof matchingPoolUsd === 'number' && (
									<Chip $layout={layout}>
										<span>
											${matchingPoolUsd.toLocaleString()}
										</span>
										<ChipNote>
											{formatMessage({
												id: 'label.matching_pool',
											})}
										</ChipNote>
									</Chip>
								)}
							</MetaGrid>
						)}

						{linkUrl && (
							<Actions $layout={layout}>
								<Link href={linkUrl || ''}>
									<ButtonLinkWrapper
										label={formatMessage({
											id: 'label.qf.explore_projects',
										})}
										icon={<IconChevronRight24 />}
									/>
								</Link>
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
	gap: ${({ $layout }) => ($layout === 'horizontal' ? '42px' : '24px')};
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

const MetaGrid = styled.div<{ $layout: Layout }>`
	justify-self: start;
	display: inline-flex;
	width: ${({ $layout }) => ($layout === 'horizontal' ? '100%' : 'auto')};
	margin-top: 24px;
	margin-bottom: ${({ $layout }) =>
		$layout === 'horizontal' ? '0' : '10px'};
	flex-direction: row;
	padding: ${({ $layout }) =>
		$layout === 'horizontal' ? '0 10px' : '10px 16px'};
	gap: 12px;
	align-items: center;
	justify-content: ${({ $layout }) =>
		$layout === 'horizontal' ? 'center' : 'flex-start'};
	border: 1.85px solid ${neutralColors.gray[300]};
	border-radius: 16px;
`;

const Chip = styled.div<{ $layout: Layout }>`
	display: ${({ $layout }) =>
		$layout === 'horizontal' ? 'flex' : 'inline-flex'};
	align-items: center;
	justify-content: ${({ $layout }) =>
		$layout === 'horizontal' ? 'center' : 'flex-start'};
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

const Dates = styled.div<{ $layout: Layout }>`
	margin-top: ${({ $layout }) => ($layout === 'horizontal' ? '0' : '16px')};
	padding-left: ${({ $layout }) => ($layout === 'horizontal' ? '0' : '16px')};
	font-size: 20px;
	font-weight: 700;
	color: ${brandColors.deep[900]};
`;

const FooterWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Actions = styled.div<{ $layout: Layout }>`
	margin-top: 4px;
	display: flex;
	justify-content: ${({ $layout }) =>
		$layout === 'horizontal' ? 'flex-end' : 'flex-start'};

	@media (max-width: ${deviceSize.mobileS}px) {
		justify-content: stretch;
		button {
			width: 100%;
		}
	}
`;

const ButtonLinkWrapper = styled(ButtonLink)`
	padding: 11px 24px;
	span {
		text-transform: none;
	}
`;
