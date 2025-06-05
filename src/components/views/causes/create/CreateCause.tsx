import { useState, FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { ICauseEdition } from '@/apollo/types/types';
import { CreateCauseHeader } from '@/components/views/causes/create/CreateCauseHeader';
import { CauseInformationStep } from '@/components/views/causes/create/CauseInformationStep';
import { CauseSelectProjectsStep } from '@/components/views/causes/create/CauseSelectProjectsStep';
import { CauseReviewStep } from '@/components/views/causes/create/CauseReviewStep';
import StorageLabel from '@/lib/localStorage';
import { showToastError } from '@/lib/helpers';
import { gToast, ToastType } from '@/components/toasts';
import { EInputs, TCauseInputs } from '@/components/views/causes/create/types';

interface ICreateCauseProps {
	project?: ICauseEdition;
}

// Custom success toast function
const showToastSuccess = (message: string) => {
	gToast(message, {
		type: ToastType.SUCCESS,
		position: 'top-center',
	});
};

const CreateCause: FC<ICreateCauseProps> = () => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize react-hook-form
	let storageCauseData: TCauseInputs | undefined;

	const storedCause = localStorage.getItem(StorageLabel.CREATE_CAUSE_FORM);
	if (storedCause) {
		storageCauseData = JSON.parse(storedCause);
	}

	const {
		title: storageTitle,
		description: storageDescription,
		categories: storageCategories,
		image: storageImage,
		selectedProjects: storageSelectedProjects,
	} = storageCauseData || {};

	const formMethods = useForm({
		mode: 'onChange',
		defaultValues: {
			[EInputs.title]: storageTitle || '',
			[EInputs.description]: storageDescription || '',
			[EInputs.selectedProjects]: storageSelectedProjects || '',
			[EInputs.categories]: storageCategories || [],
			[EInputs.image]: storageImage || '',
		},
	});

	const { watch } = formMethods;
	const formDataWatch = watch();

	const {
		title: watchTitle,
		description: watchDescription,
		categories: watchCategories,
		image: watchImage,
	} = formDataWatch;

	useEffect(() => {
		localStorage.setItem(
			StorageLabel.CREATE_CAUSE_FORM,
			JSON.stringify(formDataWatch),
		);
	}, [
		watchTitle,
		watchDescription,
		watchCategories,
		watchImage,
		formDataWatch,
	]);

	// Function to clear storage (call this when form is submitted or cancelled)
	const clearStorage = () => {
		localStorage.removeItem(StorageLabel.CREATE_CAUSE_FORM);
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

		// Step 2 validation (Select Projects)
		if (
			!formDataWatch.selectedProjects ||
			(Array.isArray(formDataWatch.selectedProjects) &&
				formDataWatch.selectedProjects.length === 0)
		) {
			formErrors.selectedProjects = formatMessage({
				id: 'error.projects_required',
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
			showToastError('Please fix the form errors before submitting');
			return;
		}

		setIsSubmitting(true);

		try {
			// TODO: Replace this with actual API call
			await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

			// Example API call structure:
			// const response = await createCause({
			//   name: formData.name,
			//   description: formData.description,
			//   projectIds: formData.selectedProjects.split(','),
			//   ...otherFormData
			// });

			showToastSuccess('Cause created successfully!');
			clearStorage();

			// Redirect to success page or cause detail page
			// router.push(`/causes/${response.id}`);
			router.push('/causes');
		} catch (error) {
			console.error('Error creating cause:', error);
			showToastError('Failed to create cause. Please try again.');
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
				<form onSubmit={handleSubmit} noValidate>
					{currentStep === 1 && (
						<CauseInformationStep
							onNext={() => setCurrentStep(2)}
						/>
					)}
					{currentStep === 2 && (
						<CauseSelectProjectsStep
							onPrevious={handlePreviousStep}
							onNext={() => setCurrentStep(3)}
						/>
					)}
					{currentStep === 3 && <CauseReviewStep />}
				</form>
			</FormProvider>
		</>
	);
};

export default CreateCause;
