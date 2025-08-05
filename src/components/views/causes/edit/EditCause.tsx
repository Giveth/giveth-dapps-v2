/* eslint-disable react-hooks/rules-of-hooks */
import { useState, FC, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { ICause, ICauseUpdate } from '@/apollo/types/types';
import { showToastError } from '@/lib/helpers';
import { EInputs } from '@/components/views/causes/create/types';
import config from '@/configuration';
import { UPDATE_CAUSE } from '@/apollo/gql/gqlCauses';
import { slugToCauseView } from '@/lib/routeCreators';
import { EditCauseInformationStep } from '@/components/views/causes/edit/EditCauseInformationStep';
import { EditCauseSelectProjectsStep } from '@/components/views/causes/edit/EditCauseSelectProjectsStep';
import { EditCauseHeader } from '@/components/views/causes/edit/EditCauseHeader';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { StyledContainer } from '../create/Create.sc';

interface ICreateCauseProps {
	project?: ICause;
}

const EditCause: FC<ICreateCauseProps> = ({ project }) => {
	const { walletAddress } = useGeneralWallet();
	const isOwner =
		project?.adminUser?.walletAddress?.toLowerCase() ===
		walletAddress?.toLowerCase();
	const router = useRouter();
	const { formatMessage } = useIntl();

	// if user is not owner, redirect to cause view
	if (!isOwner) {
		router.push(slugToCauseView(project?.slug || ''));
	}

	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [updateCauseMutation] = useMutation(UPDATE_CAUSE);

	const formRef = useRef<HTMLFormElement>(null);

	// Check does cause have some projects that has been no active
	// or missing network 137 address
	let projectStatus = '';
	if (project?.causeProjects) {
		projectStatus = project.causeProjects.some(project => {
			const isInactiveOrUnverified =
				(project.project.status.name !== EProjectStatus.ACTIVE ||
					!project.project.verified) &&
				!project.userRemoved;

			const missingNetwork137 = !project.project.addresses?.some(
				address => address.networkId === 137,
			);

			return isInactiveOrUnverified || missingNetwork137;
		})
			? 'label.cause.review_status'
			: '';
	}

	// Prepare previous selected projects, remove user removed projects
	const previousSelectedProjects = project?.causeProjects
		?.filter(project => !project.userRemoved)
		.map(project => project.project);

	const formMethods = useForm({
		mode: 'onChange',
		defaultValues: {
			[EInputs.title]: project?.title || '',
			[EInputs.description]: project?.description || '',
			[EInputs.selectedProjects]: previousSelectedProjects || [],
			[EInputs.categories]: project?.categories || [],
			[EInputs.image]: project?.image || '',
		},
	});

	const { watch } = formMethods;
	const formDataWatch = watch();

	// Validate form data
	const validateForm = (): boolean => {
		const formErrors: { [key: string]: string } = {};
		// Step 1 validation (Cause Information)
		if (!formDataWatch.title?.trim()) {
			formErrors.title = formatMessage({
				id: 'label.cause.title_required',
			});
		}
		if (!formDataWatch.description?.trim()) {
			formErrors.description = formatMessage({
				id: 'error.cause_description_required',
			});
		}
		if (!formDataWatch.image?.trim()) {
			formErrors.image = formatMessage({
				id: 'label.cause.image_required',
			});
		}
		if (!formDataWatch.categories?.length) {
			formErrors.categories = formatMessage({
				id: 'label.cause.categories_required',
			});
		}

		// Step 2 validation (Select Projects)
		if (
			!formDataWatch.selectedProjects ||
			(Array.isArray(formDataWatch.selectedProjects) &&
				formDataWatch.selectedProjects.length === 0) ||
			formDataWatch.selectedProjects.length <
				config.CAUSES_CONFIG.minSelectedProjects ||
			formDataWatch.selectedProjects.length >
				config.CAUSES_CONFIG.maxSelectedProjects
		) {
			formErrors.selectedProjects = formatMessage({
				id: 'label.cause.projects_required',
			});
		}

		return Object.keys(formErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Final submission (step 3)
		if (!validateForm()) {
			showToastError(
				formatMessage({
					id: 'label.cause.form_errors_before_submitting',
				}),
			);
			return;
		}

		try {
			setIsSubmitting(true);

			const formValues = formMethods.getValues();

			const causeData: ICauseUpdate = {
				title: formValues.title,
				description: formValues.description,
				bannerImage: formValues.image,
				categories:
					formValues.categories?.map(category => category.name) || [],
				projectIds:
					formValues.selectedProjects?.map(project =>
						parseInt(project.id),
					) || [],
			};

			await updateCauseMutation({
				variables: {
					projectId: Number(project?.id),
					newProjectData: causeData,
				},
			});

			router.push(slugToCauseView(project?.slug || ''));
		} catch (error) {
			console.error('Error editing cause:', error);
			showToastError(
				formatMessage({ id: 'label.cause.failed_to_edit_cause' }),
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle going to previous step
	const handlePreviousStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	// If on step 2, trigger form submission logic directly
	const handleUpdate = () => {
		if (formRef.current) {
			formRef.current?.requestSubmit();
		}
	};

	const steps = [
		{
			label: formatMessage({ id: 'label.cause.cause_information' }),
			step: 1,
		},
		{
			label: formatMessage({ id: 'label.cause.select_projects' }),
			step: 2,
		},
	];
	return (
		<>
			<EditCauseHeader
				steps={steps}
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
			/>
			{projectStatus && (
				<StyledContainer>
					<InlineToastWrapper
						type={EToastType.Warning}
						message={formatMessage({ id: projectStatus })}
					/>
				</StyledContainer>
			)}

			<FormProvider {...formMethods}>
				<form ref={formRef} onSubmit={handleSubmit} noValidate>
					{currentStep === 1 && (
						<EditCauseInformationStep
							onNext={() => setCurrentStep(2)}
						/>
					)}
					{currentStep === 2 && (
						<EditCauseSelectProjectsStep
							onPrevious={handlePreviousStep}
							handleUpdate={handleUpdate}
							isSubmitting={isSubmitting}
						/>
					)}
				</form>
			</FormProvider>
		</>
	);
};

export default EditCause;

const InlineToastWrapper = styled(InlineToast)`
	width: 100%;
`;
