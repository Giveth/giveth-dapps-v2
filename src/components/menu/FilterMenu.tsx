import {
	B,
	Button,
	ButtonText,
	IconX,
	neutralColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { forwardRef } from 'react';
import { useRouter } from 'next/router';
import { mediaQueries, zIndex } from '@/lib/constants/constants';
import CheckBox from '../Checkbox';
import { useProjectsContext } from '@/context/projects.context';
import { EProjectsFilter } from '@/apollo/types/types';
import { PinkyColoredNumber } from '../styled-components/PinkyColoredNumber';

interface IFilterMenuProps {
	handleClose: (e?: any) => void;
	isOpen?: boolean;
}

const projectsFeatures = [
	{
		label: { id: 'label.givbacks' },
		value: EProjectsFilter.VERIFIED,
	},
];

const fundsFilter = [
	{
		label: 'Mainnet',
		value: EProjectsFilter.ACCEPT_FUND_ON_MAINNET,
	},
	{
		label: 'Gnosis',
		value: EProjectsFilter.ACCEPT_FUND_ON_GNOSIS,
	},
	{
		label: 'Polygon',
		value: EProjectsFilter.ACCEPT_FUND_ON_POLYGON,
	},
	{
		label: 'Celo',
		value: EProjectsFilter.ACCEPT_FUND_ON_CELO,
	},
	{
		label: 'Optimism',
		value: EProjectsFilter.ACCEPT_FUND_ON_OPTIMISM,
	},
	{
		label: 'Ethereum Classic',
		value: EProjectsFilter.ACCEPT_FUND_ON_ETC,
	},
	{
		label: 'Arbitrum',
		value: EProjectsFilter.ACCEPT_FUND_ON_ARBITRUM,
	},
	{
		label: 'Base',
		value: EProjectsFilter.ACCEPT_FUND_ON_BASE,
	},
	{
		label: 'Polygon ZKEVM',
		value: EProjectsFilter.ACCEPT_FUND_ON_ZKEVM,
	},
	{
		label: 'Stellar',
		value: EProjectsFilter.ACCEPT_FUND_ON_STELLAR,
	},
];

fundsFilter.push({
	label: 'Solana',
	value: EProjectsFilter.ACCEPT_FUND_ON_SOLANA,
});

export const FilterMenu = forwardRef<HTMLDivElement, IFilterMenuProps>(
	({ handleClose, isOpen }, ref) => {
		const { formatMessage } = useIntl();
		const { variables, isQF, setIsQF } = useProjectsContext();
		const filtersCount = variables?.filters?.length ?? 0;
		const campaignCount = variables?.campaignSlug ? 1 : 0;
		const count = filtersCount + campaignCount;
		const router = useRouter();

		const handleSelectFilter = (e: boolean, filter: EProjectsFilter) => {
			let updatedQuery;
			if (e) {
				updatedQuery = {
					...router.query,
					filter: router.query.filter
						? Array.isArray(router.query.filter)
							? [...router.query.filter, filter]
							: [router.query.filter, filter]
						: [filter],
				};
			} else {
				updatedQuery = {
					...router.query,
					filter: router.query.filter
						? Array.isArray(router.query.filter)
							? router.query.filter.filter(f => f !== filter)
							: []
						: [],
				};
			}
			router.push({
				pathname: router.pathname,
				query: updatedQuery,
			});
			handleClose();
		};

		const clearFilters = () => {
			const updatedQuery = {
				...router.query,
			};
			delete updatedQuery.filter;
			delete updatedQuery.campaign;
			router.push({
				pathname: router.pathname,
				query: updatedQuery,
			});
		};

		return (
			<MenuContainer className={isOpen ? 'fadeIn' : 'fadeOut'} ref={ref}>
				<Header>
					<CloseContainer onClick={handleClose}>
						<IconX size={24} />
					</CloseContainer>
					<FlexCenter gap='8px'>
						<ButtonText size='medium'>
							{formatMessage({ id: 'label.filters' })}
						</ButtonText>
						{count !== 0 && (
							<PinkyColoredNumber size='medium'>
								{count}
							</PinkyColoredNumber>
						)}
					</FlexCenter>
				</Header>
				<Section>
					<B>
						{formatMessage({
							id: 'label.project_features',
						})}
					</B>
					{projectsFeatures.map((projectFeature, idx) => (
						<FeatureItem key={idx}>
							<CheckBox
								label={formatMessage(
									{ id: projectFeature.label.id },
									projectFeature.label,
								)}
								onChange={e => {
									handleSelectFilter(e, projectFeature.value);
								}}
								checked={
									variables?.filters?.includes(
										projectFeature.value,
									) ?? false
								}
								size={14}
							/>
						</FeatureItem>
					))}
					<FeatureItem>
						<CheckBox
							label={formatMessage({
								id: 'label.eligible_for_matching',
							})}
							onChange={e => {
								handleClose(e);
								setIsQF(isQF => !isQF);
							}}
							disabled={router.pathname === '/qf'}
							checked={isQF}
							size={14}
						/>
					</FeatureItem>

					<B>{formatMessage({ id: 'label.accepts_funds_on' })}</B>
					{fundsFilter.map((projectFeature, idx) => (
						<FeatureItem key={idx}>
							<CheckBox
								label={projectFeature.label}
								onChange={e => {
									handleSelectFilter(e, projectFeature.value);
								}}
								checked={
									variables?.filters?.includes(
										projectFeature.value,
									) ?? false
								}
								size={14}
							/>
						</FeatureItem>
					))}
					{variables?.campaignSlug && (
						<FeatureItem>
							<CheckBox
								label='Campaign'
								onChange={e => {
									const updatedQuery = {
										...router.query,
										campaign: undefined,
									};
									router.push({
										pathname: router.pathname,
										query: updatedQuery,
									});
								}}
								checked={!!variables?.campaignSlug}
								size={14}
							/>
						</FeatureItem>
					)}
				</Section>
				<ButtonStyled
					onClick={clearFilters}
					disabled={count === 0}
					buttonType='texty-secondary'
					label={formatMessage({ id: 'label.clear_all_filters' })}
				/>
			</MenuContainer>
		);
	},
);

FilterMenu.displayName = 'FilterMenu';

const ButtonStyled = styled(Button)`
	margin: 0 auto;
`;

const MenuContainer = styled.div`
	top: 0;
	right: 0;
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.7);
	width: 100%;
	height: 100%;
	z-index: ${zIndex.FIXED};
	overflow-y: scroll;
	position: fixed;
	${mediaQueries.tablet} {
		overflow-y: auto;
		height: auto;
		top: -10px;
		border-radius: 16px;
		position: absolute;
		width: 375px;
		z-index: ${zIndex.FIXED};
	}
`;

const Header = styled.div`
	position: relative;
	height: 24px;
	text-align: center;
`;

const CloseContainer = styled.div`
	width: 24px;
	height: 24px;
	position: absolute;
	left: 0;
	top: 0;
	cursor: pointer;
`;

const Section = styled.section`
	margin: 24px 0;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const FeatureItem = styled.div`
	margin: 16px 0;
	padding: 8px 10px;
	border-radius: 8px;
	transition: background-color 0.3s ease;
	&:hover {
		background-color: ${neutralColors.gray[200]};
	}
`;
