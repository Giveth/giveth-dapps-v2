/* eslint-disable react-hooks/rules-of-hooks */
import { useState, FC, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { ICauseCreation, ICauseEdition } from '@/apollo/types/types';
import { CreateCauseHeader } from '@/components/views/causes/create/CreateCauseHeader';
import { CauseInformationStep } from '@/components/views/causes/create/CauseInformationStep';
import { CauseSelectProjectsStep } from '@/components/views/causes/create/CauseSelectProjectsStep';
import StorageLabel from '@/lib/localStorage';
import { showToastError } from '@/lib/helpers';
import { EInputs, TCauseInputs } from '@/components/views/causes/create/types';
import config from '@/configuration';
import { CREATE_CAUSE } from '@/apollo/gql/gqlCauses';
import { CauseReviewStep } from './CauseReviewStep';
import { slugToSuccessCauseView } from '@/lib/routeCreators';

interface ICreateCauseProps {
	project?: ICauseEdition;
}

const CreateCause: FC<ICreateCauseProps> = () => {
	// Get current account and chain for gas estimation

	const { formatMessage } = useIntl();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [createdSlug, setCreatedSlug] = useState('');
	const [addCauseMutation] = useMutation(CREATE_CAUSE);

	// Load storage data
	let storageCauseData: TCauseInputs | undefined;

	const storedCause = localStorage.getItem(StorageLabel.CREATE_CAUSE_FORM);
	if (storedCause) {
		storageCauseData = JSON.parse(storedCause);
	}

	const formRef = useRef<HTMLFormElement>(null);

	const {
		title: storageTitle,
		description: storageDescription,
		categories: storageCategories,
		image: storageImage,
		selectedProjects: storageSelectedProjects,
		transactionNetworkId: storageTransactionNetworkId,
		transactionHash: storageTransactionHash,
		transactionStatus: storageTransactionStatus,
	} = storageCauseData || {};

	const formMethods = useForm({
		mode: 'onChange',
		defaultValues: {
			[EInputs.title]: storageTitle || '',
			[EInputs.description]: storageDescription || '',
			[EInputs.selectedProjects]: storageSelectedProjects || [],
			[EInputs.categories]: storageCategories || [],
			[EInputs.image]: storageImage || '',
			[EInputs.transactionNetworkId]: storageTransactionNetworkId || 0,
			[EInputs.transactionHash]: storageTransactionHash || '',
			[EInputs.transactionStatus]: storageTransactionStatus || '',
			slug: '',
		},
	});

	const { watch } = formMethods;
	const formDataWatch = watch();

	useEffect(() => {
		localStorage.setItem(
			StorageLabel.CREATE_CAUSE_FORM,
			JSON.stringify(formDataWatch),
		);
	}, [formDataWatch]);

	// Function to clear storage (call this when form is submitted or cancelled)
	// Reset form to prevent useEffect from re-saving
	const clearStorage = () => {
		formMethods.reset({
			[EInputs.title]: '',
			[EInputs.description]: '',
			[EInputs.selectedProjects]: [],
			[EInputs.categories]: [],
			[EInputs.image]: '',
			[EInputs.transactionNetworkId]: 0,
			[EInputs.transactionHash]: '',
			[EInputs.transactionStatus]: '',
		});
	};

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

		// Step 3 validation (Review)
		if (!formDataWatch.transactionStatus) {
			formErrors.transactionStatus = formatMessage({
				id: 'label.cause.transaction_status_required',
			});
		}

		return Object.keys(formErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// If not on the last step, go to next step
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
			return;
		}

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

			const causeData: ICauseCreation = {
				title: formValues.title,
				description: formValues.description,
				chainId: 137,
				bannerImage: formValues.image,
				subCategories:
					formValues.categories?.map(category => category.name) || [],
				projectIds:
					formValues.selectedProjects?.map(project =>
						parseInt(project.id),
					) || [],
				depositTxHash: formValues.transactionHash,
				depositTxChainId: formValues.transactionNetworkId,
			};

			const cause = await addCauseMutation({ variables: causeData });

			clearStorage();

			router.push(slugToSuccessCauseView(cause.data.createCause.slug));
		} catch (error) {
			console.error('Error creating cause:', error);
			showToastError(
				formatMessage({ id: 'label.cause.failed_to_create_cause' }),
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

	// If on step 3, trigger form submission logic directly
	const handleLaunchComplete = () => {
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
		{
			label: formatMessage({ id: 'label.cause.review' }),
			step: 3,
		},
	];
	return (
		<>
			<CreateCauseHeader
				steps={steps}
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
			/>
			<FormProvider {...formMethods}>
				<form ref={formRef} onSubmit={handleSubmit} noValidate>
					{currentStep === 1 && (
						<CauseInformationStep
							onNext={() => setCurrentStep(3)}
						/>
					)}
					{currentStep === 2 && (
						<CauseSelectProjectsStep
							onPrevious={handlePreviousStep}
							onNext={() => setCurrentStep(3)}
						/>
					)}
					{currentStep === 3 && (
						<CauseReviewStep
							onPrevious={handlePreviousStep}
							handleLaunchComplete={handleLaunchComplete}
							isSubmitting={isSubmitting}
						/>
					)}
				</form>
			</FormProvider>
		</>
	);
};

export default CreateCause;
