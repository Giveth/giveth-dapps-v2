import styled from 'styled-components';
import {
	brandColors,
	Button,
	Col,
	Container,
	H3,
	H4,
	P,
	Row,
	neutralColors,
} from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { CauseProjectsSearch } from '@/components/views/causes/create/formElements/CauseProjectsSearch';
import { CauseProjectsSearchList } from '@/components/views/causes/create/formElements/CauseProjectsSearchList';
import { EProjectsFilter } from '@/apollo/types/types';
import { CauseSelectedProjects } from '@/components/views/causes/create/CauseSelectedProjects';
import config from '@/configuration';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { Modal } from '@/components/modals/Modal';

interface ICauseSelectProjectsStepProps {
	onNext: () => void;
	onPrevious: () => void;
}

export const CauseSelectProjectsStep = ({
	onPrevious,
	onNext,
}: ICauseSelectProjectsStepProps) => {
	const { formatMessage } = useIntl();
	const {
		getValues,
		formState: { isValid },
	} = useFormContext();

	const [searchFilters, setSearchFilters] = useState({
		searchTerm: '',
		selectedMainCategory: '',
		filters: [],
	});

	// Get value from previous step
	const title = getValues('title');
	const description = getValues('description');
	const categories = getValues('categories');
	const image = getValues('image');
	const selectedProjects = getValues('selectedProjects');

	// If someone skipped first step return to first step
	useEffect(() => {
		if (
			!title ||
			!description ||
			!categories ||
			categories.length === 0 ||
			!image
		) {
			onPrevious();
		}
	}, [title, description, categories, image, onPrevious]);

	// Handle filters change in the search component
	const handleFiltersChange = (filters: {
		searchTerm: string;
		selectedMainCategory: string | null;
		filters: EProjectsFilter[] | never[];
	}) => {
		setSearchFilters({
			searchTerm: filters.searchTerm,
			selectedMainCategory: filters.selectedMainCategory || '',
			filters: filters.filters as never[],
		});
	};

	// SHow toas error if someone try to selcet more than defined projects
	const [showErrorModal, setShowErrorModal] = useState(false);
	useEffect(() => {
		if (
			selectedProjects?.length > config.CAUSES_CONFIG.maxSelectedProjects
		) {
			setShowErrorModal(true);
		}
	}, [selectedProjects]);

	// Handle continue button click
	const handleContinue = () => {
		onNext();
	};

	return (
		<StyledContainer>
			<Row>
				<Col lg={7} md={12}>
					<Title>
						{formatMessage({ id: 'label.cause.select_projects' })}
					</Title>
					<Desc>
						{formatMessage({
							id: 'label.cause.select_projects_dec_intro',
						})}
					</Desc>
					<CauseProjectsSearch
						onFiltersChange={handleFiltersChange}
					/>
					<CauseProjectsSearchList
						searchFilters={searchFilters}
						showErrorModal={setShowErrorModal}
					/>
					<NextDescription>
						<H4>
							{formatMessage({
								id: 'label.cause.select_projects',
							})}
						</H4>
						<P>
							{formatMessage({
								id: 'label.cause.select_projects_desc',
							})}
						</P>
					</NextDescription>
					<ButtonContainer>
						<PreviousButtonContainer>
							<BackButton onClick={onPrevious}>
								{formatMessage({ id: 'label.cause.back' })}
							</BackButton>
						</PreviousButtonContainer>
						<Button
							buttonType='primary'
							size='large'
							onClick={handleContinue}
							disabled={
								!title?.trim() ||
								!isValid ||
								!description?.trim() ||
								!categories ||
								categories.length === 0 ||
								!image ||
								selectedProjects?.length <
									config.CAUSES_CONFIG.minSelectedProjects ||
								selectedProjects?.length >
									config.CAUSES_CONFIG.maxSelectedProjects
							}
							label={formatMessage({ id: 'label.continue' })}
						/>
					</ButtonContainer>
				</Col>
				<Col lg={5} md={12}>
					<CauseSelectedProjects />
				</Col>
			</Row>
			{showErrorModal && (
				<Modal
					hiddenClose={false}
					hiddenHeader={true}
					isAnimating={false}
					closeModal={() => setShowErrorModal(false)}
					headerTitle={formatMessage({
						id: 'label.cause.projects_limit_exceeded',
					})}
				>
					<ModalErrorInner>
						<InlineToast
							type={EToastType.Error}
							title={formatMessage({
								id: 'label.cause.projects_limit_exceeded',
							})}
							message={formatMessage({
								id: 'label.cause.reached_limit_of_projects',
							})}
						/>
					</ModalErrorInner>
				</Modal>
			)}
		</StyledContainer>
	);
};
const StyledContainer = styled(Container)`
	margin-top: 56px;
`;

const Title = styled(H3)`
	margin-bottom: 12px;
	color: ${brandColors.deep[600]};
	font-weight: bold;
`;

const Desc = styled(P)`
	margin-bottom: 48px;
	color: ${brandColors.deep[600]};
`;

const NextDescription = styled.div`
	margin-bottom: 36px;

	h4 {
		font-weight: 700;
		font-size: 32px;
		line-height: 56px;
		color: ${brandColors.deep[900]};
	}

	p {
		font-size: 16px;
		line-height: 24px;
		color: ${brandColors.deep[600]};
	}
`;

const PreviousButtonContainer = styled.div`
	margin-right: 12px;
`;

const ButtonContainer = styled.div`
	margin-top: 32px;
	display: flex;
	justify-content: flex-start;
	padding: 0;

	button {
		padding: 12px 8em;
	}

	span {
		text-transform: uppercase !important;
		font-size: 14px !important;
		line-height: 20px !important;
	}
`;

const BackButton = styled.button`
	background-color: ${neutralColors.gray[200]};
	color: ${neutralColors.gray[600]};
	border: 2px solid ${neutralColors.gray[600]};
	border-radius: 48px;
	padding: 12px 8em;
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background-color: ${neutralColors.gray[300]};
		color: ${neutralColors.gray[800]};
	}

	&:active {
		background-color: ${neutralColors.gray[400]};
	}
`;

const ModalErrorInner = styled.div`
	padding: 28px 24px 0 24px;
`;
