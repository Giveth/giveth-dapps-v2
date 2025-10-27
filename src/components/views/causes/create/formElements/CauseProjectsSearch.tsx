import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	neutralColors,
	brandColors,
	IconSearch,
	IconChevronDown24,
	IconX,
	IconOptions16,
	B,
	IconAlertCircle,
	semanticColors,
} from '@giveth/ui-design-system';
import { useAppSelector } from '@/features/hooks';
import CheckBox from '@/components/Checkbox';
import { EProjectsFilter, IMainCategory } from '@/apollo/types/types';

interface ICauseProjectsSearchProps {
	onFiltersChange?: (filters: {
		searchTerm: string;
		selectedMainCategory: string | null;
		filters: EProjectsFilter[];
	}) => void;
}

const projectsFeatures = [
	{
		label: { id: 'label.isGivbackEligible' },
		value: EProjectsFilter.IS_GIVBACK_ELIGIBLE,
	},
];

export const CauseProjectsSearch = ({
	onFiltersChange,
}: ICauseProjectsSearchProps) => {
	const { formatMessage } = useIntl();

	// Local state
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedMainCategory, setSelectedMainCategory] = useState<
		string | null
	>(null);
	const [selectedMainCategoryName, setSelectedMainCategoryName] = useState<
		string | null
	>(
		formatMessage({
			id: 'label.cause.all_categories',
		}),
	);
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [filters, setFilters] = useState<EProjectsFilter[]>([]);

	// Get main categories from Redux store
	const mainCategories = useAppSelector(
		state => state.general.mainCategories,
	);

	//
	const handleFiltersChange = (filters: {
		filters: never[];
		searchTerm: string;
		selectedMainCategory: string | null;
	}) => {
		if (onFiltersChange) {
			onFiltersChange({
				searchTerm: filters.searchTerm,
				selectedMainCategory: filters.selectedMainCategory,
				filters: filters.filters || [],
			});
		}
	};

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		const timer = setTimeout(() => {
			handleFiltersChange({
				searchTerm: e.target.value,
				selectedMainCategory,
				filters: filters as never[],
			});
		}, 1000);
		return () => clearTimeout(timer);
	};

	// Handle main category selection (single selection only)
	const handleMainCategoryChange = (category: IMainCategory | null) => {
		setSelectedMainCategory(category?.slug || null);
		setSelectedMainCategoryName(
			category?.title ||
				formatMessage({
					id: 'label.cause.all_categories',
				}),
		);
		setShowCategoryModal(false);
		handleFiltersChange({
			searchTerm,
			selectedMainCategory: category?.slug || null,
			filters: filters as never[],
		});
	};

	// Handle category modal close
	const handleCategoryModalClose = () => {
		setShowCategoryModal(false);

		handleFiltersChange({
			searchTerm,
			selectedMainCategory,
			filters: filters as never[],
		});
	};

	// Handle filter modal close
	const handleFilterModalClose = () => {
		setShowFilterModal(false);
		handleFiltersChange({
			searchTerm,
			selectedMainCategory,
			filters: filters as never[],
		});
	};

	// Handle filter selection
	const handleSelectFilter = (e: boolean, filter: EProjectsFilter) => {
		let updatedFilters: EProjectsFilter[];

		if (e) {
			updatedFilters = [...filters, filter];
		} else {
			updatedFilters = filters.filter(f => f !== filter);
		}

		setFilters(updatedFilters);
		handleFiltersChange({
			searchTerm,
			selectedMainCategory,
			filters: updatedFilters as never[],
		});
		setShowFilterModal(false);
	};

	return (
		<CauseSearch>
			<SearchSection>
				<SearchInputWrapper>
					<SearchInput
						type='text'
						placeholder={formatMessage({
							id: 'label.search_projects',
						})}
						value={searchTerm}
						onChange={handleSearchChange}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								e.preventDefault(); // Prevent form submit
							}
						}}
					/>
					<IconSearch size={18} color={neutralColors.gray[900]} />
				</SearchInputWrapper>
				<CategorySection>
					<CategoryTitle onClick={() => setShowCategoryModal(true)}>
						{selectedMainCategoryName &&
						selectedMainCategoryName.length > 15
							? `${selectedMainCategoryName.substring(0, 15)}...`
							: selectedMainCategoryName}
						<IconChevronDown24 />
					</CategoryTitle>
					{showCategoryModal && (
						<>
							<ModalOverlay onClick={handleCategoryModalClose} />
							<CategoryModal>
								<ModalHeader>
									<CloseButton
										onClick={handleCategoryModalClose}
									>
										<IconX size={24} />
									</CloseButton>
									<h3>
										{formatMessage({
											id: 'label.cause.filter_by_categories',
										})}
									</h3>
								</ModalHeader>
								<ModalContent>
									<CategoryList>
										<CategoryItem
											onClick={() =>
												handleMainCategoryChange(null)
											}
											$isSelected={
												selectedMainCategory === null
											}
										>
											{formatMessage({
												id: 'label.cause.all_categories',
											})}
										</CategoryItem>
										{mainCategories.map(category => (
											<CategoryItem
												key={category.slug}
												onClick={() =>
													handleMainCategoryChange(
														category,
													)
												}
												$isSelected={
													selectedMainCategory ===
													category.slug
												}
											>
												{category.title}
											</CategoryItem>
										))}
									</CategoryList>
								</ModalContent>
							</CategoryModal>
						</>
					)}
				</CategorySection>
				<FilterSection>
					<FilterTitle onClick={() => setShowFilterModal(true)}>
						{formatMessage({
							id: 'label.filters',
						})}
						<IconOptions16 />
					</FilterTitle>
					{showFilterModal && (
						<>
							<ModalOverlay onClick={handleFilterModalClose} />
							<CategoryModal>
								<ModalHeader>
									<CloseButton
										onClick={handleFilterModalClose}
									>
										<IconX size={24} />
									</CloseButton>
									<h3>Filters</h3>
								</ModalHeader>
								<ModalContent>
									<B>
										{formatMessage({
											id: 'label.project_features',
										})}
									</B>
									<CategoryList>
										{projectsFeatures.map(
											(projectFeature, idx) => (
												<FeatureItem key={idx}>
													<CheckBox
														label={formatMessage(
															{
																id: projectFeature
																	.label.id,
															},
															projectFeature.label,
														)}
														onChange={e => {
															handleSelectFilter(
																e,
																projectFeature.value,
															);
														}}
														checked={filters.includes(
															projectFeature.value,
														)}
														size={14}
													/>
												</FeatureItem>
											),
										)}
									</CategoryList>
								</ModalContent>
							</CategoryModal>
						</>
					)}
				</FilterSection>
				<OnlyPolygon>
					<IconContainer>
						<IconAlertCircle size={16} />
					</IconContainer>
					<OnlyPolygonText>
						{formatMessage({
							id: 'label.cause.only_projects_polygon',
						})}
					</OnlyPolygonText>
				</OnlyPolygon>
			</SearchSection>
		</CauseSearch>
	);
};

const CauseSearch = styled.div`
	display: block;
`;

const SearchSection = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	flex-wrap: wrap;
	align-items: center;
	background-color: #ffffff;
	padding: 24px;
	border-radius: 16px;
`;

const SearchInputWrapper = styled.div`
	display: flex;
	width: 51%;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 16px 24px;
	border-radius: 100px;
	background: ${neutralColors.gray[200]};

	&:focus-within {
		border-color: ${brandColors.giv[500]};
	}

	@media (max-width: 640px) {
		width: 100%;
		margin-bottom: 12px;
	}
`;

const SearchInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	font-size: 16px;
	font-weight: 400;
	color: ${neutralColors.gray[900]};
	background: ${neutralColors.gray[200]};

	&::placeholder {
		font-size: 16px;
		font-weight: 400;
		color: ${neutralColors.gray[700]};
	}
`;

const CategorySection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	@media (max-width: 640px) {
		width: 100%;
		margin-bottom: 12px;
	}
`;

const CategoryTitle = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-weight: 700;
	font-size: 14px;
	line-height: 18px;
	color: ${neutralColors.gray[900]};
	border: 1px solid ${neutralColors.gray[400]};
	padding: 16px 24px;
	border-radius: 100px;
	cursor: pointer;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 200px;

	span {
		text-align: center;
	}

	&:hover {
		border-color: ${brandColors.giv[300]};
	}

	@media (max-width: 640px) {
		width: 100%;
		max-width: none;
	}
`;

const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
`;

const CategoryModal = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: white;
	border-radius: 16px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	z-index: 1001;
	width: 400px;
	max-height: 80vh;
	overflow-y: auto;

	@media (max-width: 390px) {
		width: 100%;
		max-width: none;
	}
`;

const ModalHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24px 24px 16px 24px;

	h3 {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 95%;
		margin: 0;
		font-size: 16px;
		font-weight: 700;
		color: ${neutralColors.gray[900]};
		text-align: center;
	}
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	color: ${neutralColors.gray[900]};

	&:hover {
		color: ${neutralColors.gray[600]};
	}
`;

const ModalContent = styled.div`
	padding: 24px;
`;

const CategoryList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const CategoryItem = styled.div<{ $isSelected: boolean }>`
	padding: 12px 16px;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.2s ease;

	background-color: ${props =>
		props.$isSelected ? brandColors.giv[100] : 'transparent'};
	color: ${props =>
		props.$isSelected ? brandColors.giv[700] : neutralColors.gray[900]};

	&:hover {
		background-color: ${props =>
			props.$isSelected ? brandColors.giv[200] : neutralColors.gray[100]};
	}
`;

const FeatureItem = styled.div`
	margin: 6px 0;
	padding: 8px 10px;
	border-radius: 8px;
	transition: background-color 0.3s ease;
	&:hover {
		background-color: ${neutralColors.gray[200]};
	}
`;

const FilterSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	@media (max-width: 640px) {
		width: 100%;
	}
`;

const FilterTitle = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-weight: 700;
	font-size: 14px;
	line-height: 18px;
	color: ${neutralColors.gray[900]};
	border: 1px solid ${neutralColors.gray[400]};
	padding: 18px 24px;
	border-radius: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	cursor: pointer;

	span {
		text-align: center;
	}

	&:hover {
		border-color: ${brandColors.giv[300]};
	}

	@media (max-width: 640px) {
		width: 100%;
	}
`;

const OnlyPolygon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-top: 16px;
`;

const IconContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: fit-content;
	height: fit-content;
	svg {
		color: ${semanticColors.blueSky[700]};
	}
`;

const OnlyPolygonText = styled.div`
	width: 100%;
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	color: ${semanticColors.blueSky[700]};
`;
