import { MouseEvent, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconOptions16, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import useDelay from '@/hooks/useDelay';
import { Shadow } from '@/components/styled-components/Shadow';
import { Relative } from '@/components/styled-components/Position';
import { FilterMenu } from './FilterMenu';
import { PinkyColoredNumber } from '@/components/styled-components/PinkyColoredNumber';

export const RecurringDonationFiltersButton = () => {
	const { formatMessage } = useIntl();
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const delayedIsFilterOpen = useDelay(isFilterOpen, 280);

	const filterMenuRef = useRef<HTMLDivElement>(null);

	const count = 0;

	useOnClickOutside(
		() => setIsFilterOpen(false),
		isFilterOpen,
		filterMenuRef,
	);

	const handleFilterClose = (e?: MouseEvent<HTMLElement>) => {
		e?.stopPropagation && e?.stopPropagation();
		setIsFilterOpen(false);
	};

	return (
		<Relative>
			<FiltersButton onClick={() => setIsFilterOpen(true)}>
				{formatMessage({ id: 'label.filters' })}
				{count !== 0 && (
					<PinkyColoredNumber>{count}</PinkyColoredNumber>
				)}
				<IconOptions16 />
			</FiltersButton>
			{(delayedIsFilterOpen || isFilterOpen) && (
				<FilterMenu
					isOpen={isFilterOpen}
					handleClose={handleFilterClose}
					ref={filterMenuRef}
				/>
			)}
		</Relative>
	);
};

const FiltersButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	border-radius: 50px;
	padding: 16px;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	border: 1px solid ${neutralColors.gray[400]};
	font-weight: 700;
	text-transform: uppercase;
	cursor: pointer;
	user-select: none;
`;
