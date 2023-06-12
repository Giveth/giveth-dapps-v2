import { MouseEvent, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconOptions16 } from '@giveth/ui-design-system';
import { FilterMenu, PinkyColoredNumber } from '@/components/menu/FilterMenu';
import { useProjectsContext } from '@/context/projects.context';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { FiltersButton } from '@/components/views/projects/common.styled';
import useDelay from '@/hooks/useDelay';

const ProjectsFiltersButton = () => {
	const { formatMessage } = useIntl();
	const { variables, isQF } = useProjectsContext();
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filtersCount = variables?.filters?.length ?? 0;
	const campaignCount = variables?.campaignSlug ? 1 : 0;
	const count = filtersCount + campaignCount - (isQF ? 1 : 0);

	const delayedIsFilterOpen = useDelay(isFilterOpen, 280);

	const filterMenuRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(filterMenuRef, () => setIsFilterOpen(false));

	const handleFilterClose = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsFilterOpen(false);
	};

	return (
		<>
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
		</>
	);
};

export default ProjectsFiltersButton;
