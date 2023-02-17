import {
	B,
	brandColors,
	Button,
	ButtonText,
	IconX,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { forwardRef } from 'react';
import { useRouter } from 'next/router';
import { mediaQueries } from '@/lib/constants/constants';
import { FlexCenter } from '../styled-components/Flex';
import CheckBox from '../Checkbox';
import { useProjectsContext } from '@/context/projects.context';
import { zIndex } from '@/lib/constants/constants';
import { EProjectsFilter } from '@/apollo/types/types';

interface IFilterMenuProps {
	handleClose: (e?: any) => void;
	isOpen?: boolean;
}

export const FilterMenu = forwardRef<HTMLDivElement, IFilterMenuProps>(
	({ handleClose, isOpen }, ref) => {
		const { formatMessage } = useIntl();
		const { setVariables, variables } = useProjectsContext();
		const filtersCount = variables?.filters?.length ?? 0;
		const campaignCount = variables?.campaignSlug ? 1 : 0;
		const count = filtersCount + campaignCount;
		const router = useRouter();

		const handleSelectFilter = (e: boolean, filter: EProjectsFilter) => {
			if (e) {
				setVariables({
					...variables,
					filters: !variables.filters?.includes(filter)
						? [...(variables.filters || []), filter]
						: variables.filters,
				});
			} else {
				setVariables({
					...variables,
					filters: variables.filters?.filter(
						(f: string) => f !== filter,
					),
				});
			}
		};

		const clearFilters = () => {
			setVariables({
				...variables,
				filters: [],
				campaignSlug: undefined,
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
					<B>{formatMessage({ id: 'label.project_features' })}</B>
					{projectFeatures.map((projectFeature, idx) => (
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

const projectFeatures = [
	{ label: 'Accepts GIV', value: EProjectsFilter.ACCEPT_GIV },
	{ label: 'Verified', value: EProjectsFilter.VERIFIED },
	{
		label: 'Boosted with GIVpower',
		value: EProjectsFilter.BOOSTED_WITH_GIVPOWER,
	},
	{ label: 'From GivingBlock', value: EProjectsFilter.GIVING_BLOCK },
	{
		label: 'Accepts Funds on Gnosis',
		value: EProjectsFilter.ACCEPT_FUND_ON_GNOSIS,
	},
];

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

export const PinkyColoredNumber = styled(ButtonText)`
	background-color: ${brandColors.pinky[500]};
	width: 18px;
	height: 18px;
	border-radius: 50%;
	color: ${neutralColors.gray[100]};
`;
