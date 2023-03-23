import { IconSearch, neutralColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Input from '@/components/Input';
import IconEnter from '../../../../public/images/icons/enter.svg';
import { FlexCenter } from '@/components/styled-components/Flex';
import { useProjectsContext } from '@/context/projects.context';
import { removeQueryParamAndRedirect } from '@/helpers/url';

const ProjectsSearchDesktop = () => {
	const { variables, setVariables } = useProjectsContext();
	const [searchValue, setSearchValue] = useState(variables.searchTerm);
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const { formatMessage } = useIntl();

	const handleSearch = (searchTerm?: string) =>
		setVariables(prevVariables => ({ ...prevVariables, searchTerm }));
	const removeSearch = () => {
		setSearchValue('');
		handleSearch();
		removeQueryParamAndRedirect(router, ['term']);
	};

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
		setSearchValue(variables.searchTerm);
	}, [variables.searchTerm, inputRef.current]);

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
						id: 'label.search_for_a_project_or_a_cause',
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
