import {
	IconSearch,
	neutralColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Input from '@/components/Input';
import IconEnter from '../../../../public/images/icons/enter.svg';
import { useProjectsContext } from '@/context/projects.context';
import useFocus from '@/hooks/useFocus';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';

export interface IProjectsSearchDesktopProps {
	isCauses?: boolean;
}

const ProjectsSearchDesktop = (props: IProjectsSearchDesktopProps) => {
	const { isCauses = false } = props;
	const { variables } = useProjectsContext();
	const [searchValue, setSearchValue] = useState(variables.searchTerm);
	const router = useRouter();
	const { formatMessage } = useIntl();

	const handleSearch = (searchTerm?: string) => {
		const updatedQuery = {
			...router.query,
			searchTerm: searchTerm,
			sort: EProjectsSortBy.BestMatch,
		};
		router.push({
			pathname: router.pathname,
			query: updatedQuery,
		});
	};

	const [inputRef, setFocus] = useFocus();

	const removeSearch = () => {
		setSearchValue('');
		const updatedQuery = {
			...router.query,
		};
		delete updatedQuery.searchTerm;
		if (router.query.sort === EProjectsSortBy.BestMatch)
			delete updatedQuery.sort;
		router.push({
			pathname: router.pathname,
			query: updatedQuery,
		});
		setFocus();
	};

	useEffect(() => {
		setSearchValue(variables.searchTerm);
	}, [variables.searchTerm]);

	return (
		<SearchContainer className='fadeIn'>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSearch(searchValue);
				}}
			>
				<Input
					placeholder={formatMessage({
						id: isCauses
							? 'label.cause.search_for_cause'
							: 'label.search_for_project',
					})}
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					LeftIcon={<IconSearch color={neutralColors.gray[600]} />}
					ref={inputRef}
				/>
			</form>
			{variables.searchTerm ? (
				<ClearSearch onClick={removeSearch}>
					{formatMessage({ id: 'label.clear' })}
				</ClearSearch>
			) : (
				<SearchHint onClick={() => handleSearch(searchValue)}>
					<Image src={IconEnter} alt='icon enter' />{' '}
					<div>
						{formatMessage({ id: 'label.press_enter_to_search' })}
					</div>
				</SearchHint>
			)}
		</SearchContainer>
	);
};

const SearchHint = styled(FlexCenter)`
	position: absolute;
	right: 20px;
	top: 14px;
	flex-direction: row;
	color: ${neutralColors.gray[600]};
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
`;

const ClearSearch = styled(SearchHint)`
	color: ${neutralColors.gray[900]};
	margin-top: 4px;
	text-transform: uppercase;
`;

const SearchContainer = styled.div`
	margin-bottom: -20px;
	width: 100%;
	position: relative;
`;

export default ProjectsSearchDesktop;
