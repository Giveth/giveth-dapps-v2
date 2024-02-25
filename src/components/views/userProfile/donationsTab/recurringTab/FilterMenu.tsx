import {
	B,
	Button,
	ButtonText,
	IconX,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { forwardRef } from 'react';
import { useRouter } from 'next/router';
import { FlexCenter } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import { zIndex } from '@/lib/constants/constants';
import CheckBox from '@/components/Checkbox';
import config from '@/configuration';
import { ISuperToken } from '@/types/superFluid';
import { PinkyColoredNumber } from '@/components/styled-components/PinkyColoredNumber';

interface IFilterMenuProps {
	handleClose: (e?: any) => void;
	isOpen?: boolean;
}

export const FilterMenu = forwardRef<HTMLDivElement, IFilterMenuProps>(
	({ handleClose, isOpen }, ref) => {
		const { formatMessage } = useIntl();
		const count = 0;
		const router = useRouter();

		const handleSelectFilter = (e: boolean, filter: ISuperToken) => {
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
					<B>{formatMessage({ id: 'label.tokens' })}</B>
					{config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.map(token => (
						<FeatureItem key={token.id}>
							<CheckBox
								label={token.name}
								onChange={e => {
									handleSelectFilter(e, token);
								}}
								checked={
									false
									// variables?.filters?.includes(token.id) ??
									// false
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
