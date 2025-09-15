'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import {
	ButtonText,
	neutralColors,
	brandColors,
	IconOptions16,
} from '@giveth/ui-design-system';
import CheckBox from '@/components/Checkbox';
import { useProjectsContext } from '@/context/projects.context';
import { EProjectsFilter } from '@/apollo/types/types';

const projectsFeatures = [
	{
		label: { id: 'label.isGivbackEligible' },
		value: EProjectsFilter.IS_GIVBACK_ELIGIBLE,
	},
];

const fundsFilterProjects = [
	{ label: 'Mainnet', value: EProjectsFilter.ACCEPT_FUND_ON_MAINNET },
	{ label: 'Gnosis', value: EProjectsFilter.ACCEPT_FUND_ON_GNOSIS },
	{ label: 'Polygon', value: EProjectsFilter.ACCEPT_FUND_ON_POLYGON },
	{ label: 'Celo', value: EProjectsFilter.ACCEPT_FUND_ON_CELO },
	{ label: 'Optimism', value: EProjectsFilter.ACCEPT_FUND_ON_OPTIMISM },
	{ label: 'Ethereum Classic', value: EProjectsFilter.ACCEPT_FUND_ON_ETC },
	{ label: 'Arbitrum', value: EProjectsFilter.ACCEPT_FUND_ON_ARBITRUM },
	{ label: 'Base', value: EProjectsFilter.ACCEPT_FUND_ON_BASE },
	{ label: 'Polygon ZKEVM', value: EProjectsFilter.ACCEPT_FUND_ON_ZKEVM },
	{ label: 'Stellar', value: EProjectsFilter.ACCEPT_FUND_ON_STELLAR },
	{ label: 'Solana', value: EProjectsFilter.ACCEPT_FUND_ON_SOLANA },
];

const fundsFilterCauses = [
	{ label: 'Polygon', value: EProjectsFilter.ACCEPT_FUND_ON_POLYGON },
];

export function QFRoundFilterSelect() {
	const { formatMessage } = useIntl();
	const { variables, isCauses, isQF } = useProjectsContext();
	const router = useRouter();

	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);

	// Selected from URL
	const selected: string[] = Array.isArray(router.query.filter)
		? (router.query.filter as string[])
		: router.query.filter
			? [router.query.filter as string]
			: [];

	const funds = isCauses ? fundsFilterCauses : fundsFilterProjects;

	// Toggle a filter and update URL
	const toggleFilter = (checked: boolean, value: EProjectsFilter) => {
		const set = new Set(selected);
		checked ? set.add(value) : set.delete(value);
		const next = Array.from(set);
		const query = { ...router.query };
		if (next.length) query.filter = next;
		else delete (query as any).filter;
		router.push({ pathname: router.pathname, query }, undefined, {
			shallow: true,
		});
	};

	// Close on outside click / Escape
	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (
				!menuRef.current?.contains(e.target as Node) &&
				!triggerRef.current?.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		const onKey = (e: KeyboardEvent) =>
			e.key === 'Escape' && setOpen(false);
		document.addEventListener('mousedown', handler);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('mousedown', handler);
			document.removeEventListener('keydown', onKey);
		};
	}, [open]);

	const clearAll = () => {
		const query = { ...router.query };
		delete (query as any).filter;
		delete (query as any).campaign;
		router.push({ pathname: router.pathname, query }, undefined, {
			shallow: true,
		});
	};

	const count =
		(variables?.filters?.length ?? 0) + (variables?.campaignSlug ? 1 : 0);

	return (
		<Wrapper>
			<Trigger
				ref={triggerRef}
				aria-haspopup='menu'
				aria-expanded={open}
				onClick={() => setOpen(o => !o)}
			>
				<ButtonText size='medium'>
					{formatMessage({ id: 'label.filters' })}
				</ButtonText>
				{count > 0 && <Badge>{count}</Badge>}
				<IconOptions16 />
			</Trigger>

			{open && (
				<Menu ref={menuRef} role='menu' aria-label='Filters'>
					<SectionTitle>
						{formatMessage({
							id: isCauses
								? 'label.cause.cause_features'
								: 'label.project_features',
						})}
					</SectionTitle>

					{!isCauses &&
						projectsFeatures.map((pf, i) => (
							<Item key={i}>
								<CheckBox
									label={formatMessage(
										{ id: pf.label.id },
										pf.label as any,
									)}
									size={14}
									checked={selected.includes(pf.value)}
									onChange={(v: boolean) =>
										toggleFilter(v, pf.value)
									}
								/>
							</Item>
						))}

					<Item key='eligible_for_matching'>
						<CheckBox
							label={formatMessage({
								id: 'label.eligible_for_matching',
							})}
							onChange={() => {
								// do nothing
								return;
							}}
							disabled={router.pathname === '/qf'}
							checked={isQF}
							size={14}
						/>
					</Item>

					<Divider />

					<SectionTitle>
						{formatMessage({ id: 'label.accepts_funds_on' })}
					</SectionTitle>
					{funds.map((f, i) => (
						<Item key={i}>
							<CheckBox
								label={f.label}
								size={14}
								checked={selected.includes(f.value)}
								onChange={(v: boolean) =>
									toggleFilter(v, f.value)
								}
							/>
						</Item>
					))}

					{variables?.campaignSlug && (
						<>
							<Divider />
							<Item>
								<CheckBox
									label='Campaign'
									size={14}
									checked={!!variables?.campaignSlug}
									onChange={() => {
										const query = { ...router.query };
										delete (query as any).campaign;
										router.push(
											{
												pathname: router.pathname,
												query,
											},
											undefined,
											{ shallow: true },
										);
									}}
								/>
							</Item>
						</>
					)}

					<Footer>
						<ClearBtn
							disabled={
								selected.length === 0 &&
								!variables?.campaignSlug
							}
							onClick={clearAll}
						>
							{formatMessage({ id: 'label.clear_all_filters' })}
						</ClearBtn>
					</Footer>
				</Menu>
			)}
		</Wrapper>
	);
}

/* ----------------- styles ----------------- */

const Wrapper = styled.div`
	position: relative;
	display: inline-block;
`;

const Trigger = styled.button`
	display: inline-flex;
	min-width: 180px;
	gap: 8px;
	align-items: center;
	padding: 9px 14px;
	border: none;
	border-radius: 4px;
	background: #fff;
	color: ${brandColors.deep[900]};
	cursor: pointer;
	span {
		font-size: 16px;
		font-weight: 500;
	}
`;

const Badge = styled.span`
	margin-left: auto;
	min-width: 20px;
	height: 20px;
	border-radius: 999px;
	background: #f3e8ff;
	color: ${brandColors.deep[900]};
	font-size: 12px;
	line-height: 20px;
	text-align: center;
	padding: 0 6px;
`;

const Menu = styled.div`
	position: absolute;
	top: calc(100% + 8px);
	right: 0;
	width: 320px;
	max-height: 70vh;
	overflow: auto;
	background: ${neutralColors.gray[100]};
	border-radius: 12px;
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
	padding: 16px;
	z-index: 1000;
`;

const SectionTitle = styled.div`
	font-weight: 500;
	color: ${neutralColors.gray[800]};
	margin-bottom: 8px;
`;

const Divider = styled.div`
	height: 1px;
	background: ${neutralColors.gray[300]};
	margin: 12px 0;
`;

const Item = styled.div`
	margin: 10px 0;
	padding: 6px 8px;
	border-radius: 8px;
	transition: background 0.2s ease;
	&:hover {
		background: ${neutralColors.gray[200]};
	}
`;

const Footer = styled.div`
	margin-top: 8px;
	display: flex;
	justify-content: center;
`;

const ClearBtn = styled.button<{ disabled?: boolean }>`
	background: none;
	border: none;
	color: ${p =>
		p.disabled ? neutralColors.gray[400] : brandColors.deep[900]};
	cursor: ${p => (p.disabled ? 'default' : 'pointer')};
	padding: 8px 12px;
`;
