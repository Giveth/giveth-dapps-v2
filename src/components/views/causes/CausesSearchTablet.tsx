import { useState, useEffect } from 'react';
import { IconSearch, IconX } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Input from '@/components/Input';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { useCausesContext } from '@/context/causes.context';

const CausesSearchTablet = () => {
	const { variables } = useCausesContext();
	const [searchValue, setSearchValue] = useState(variables.searchTerm);
	const router = useRouter();

	const handleSearch = (searchTerm?: string) => {
		const updatedQuery = {
			...router.query,
			searchTerm,
			sort: EProjectsSortBy.BestMatch,
		};
		router.push({
			pathname: router.pathname,
			query: updatedQuery,
		});
	};

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
					placeholder='SEARCH...'
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
				/>
			</form>
			{variables.searchTerm ? (
				<SearchHint onClick={removeSearch}>
					<IconX />
				</SearchHint>
			) : (
				<SearchHint onClick={() => handleSearch(searchValue)}>
					<IconSearch />
				</SearchHint>
			)}
		</SearchContainer>
	);
};

const SearchHint = styled.div`
	position: absolute;
	right: 20px;
	top: 20px;
	cursor: pointer;
`;

const SearchContainer = styled.div`
	margin-bottom: -20px;
	width: 100%;
	position: relative;
	form input {
		border-radius: 50px;
		padding-left: 24px;
		::placeholder {
			font-weight: 700;
			font-size: 14px;
		}
	}
`;

export default CausesSearchTablet;
