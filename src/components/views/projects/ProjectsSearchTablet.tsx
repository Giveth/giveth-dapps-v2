import { useState, useEffect } from 'react';
import { IconSearch, IconX } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Input from '@/components/Input';
import { useProjectsContext } from '@/context/projects.context';
import { removeQueryParamAndRedirect } from '@/helpers/url';

const ProjectsSearchTablet = () => {
	const { variables, setVariables } = useProjectsContext();
	const [searchValue, setSearchValue] = useState(variables.searchTerm);
	const router = useRouter();

	const handleSearch = (searchTerm?: string) =>
		setVariables(prevVariables => ({ ...prevVariables, searchTerm }));

	const removeSearch = () => {
		setSearchValue('');
		handleSearch();
		removeQueryParamAndRedirect(router, ['term']);
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

export default ProjectsSearchTablet;
