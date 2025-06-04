import { useState, FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { IProjectEdition } from '@/apollo/types/types';
import { CreateCauseHeader } from '@/components/views/causes/create/CreateCauseHeader';
import { CauseInformationStep } from '@/components/views/causes/create/CauseInformationStep';
import { SelectProjectsStep } from '@/components/views/causes/create/SeelctProjectsStep';
import { ReviewStep } from '@/components/views/causes/create/ReviewStep';
import StorageLabel from '@/lib/localStorage';
import { showToastError } from '@/lib/helpers';
import { gToast, ToastType } from '@/components/toasts';

interface ICreateProjectProps {
	project?: IProjectEdition;
}

// Custom success toast function
const showToastSuccess = (message: string) => {
	gToast(message, {
		type: ToastType.SUCCESS,
		position: 'top-center',
	});
};

const CreateCause: FC<ICreateProjectProps> = () => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize react-hook-form
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			selectedProjects: '',
		},
	});

	const { watch, reset } = methods;
	const formData = watch();

	// Load data from localStorage on component mount
	useEffect(() => {
		const storedData = localStorage.getItem(StorageLabel.CREATE_CAUSE_FORM);
		if (storedData) {
			try {
				const parsedData = JSON.parse(storedData);
				if (
					parsedData.formData &&
					Object.values(parsedData.formData).some(value => value)
				) {
					reset(parsedData.formData);
					setCurrentStep(parsedData.currentStep || 1);
				}
			} catch (error) {
				console.error('Error parsing stored cause form data:', error);
				// Clear corrupted data
				localStorage.removeItem(StorageLabel.CREATE_CAUSE_FORM);
			}
		}
	}, [reset]);

	// Save data to localStorage whenever formData or currentStep changes
	useEffect(() => {
		if (Object.values(formData).some(value => value)) {
			const dataToStore = {
				formData,
				currentStep,
				timestamp: new Date().getTime(),
			};
			localStorage.setItem(
				StorageLabel.CREATE_CAUSE_FORM,
				JSON.stringify(dataToStore),
			);
		}
	}, [formData, currentStep]);

	// Function to clear storage (call this when form is submitted or cancelled)
	const clearStorage = () => {
		localStorage.removeItem(StorageLabel.CREATE_CAUSE_FORM);
	};

	// Validate form data
	const validateForm = (): boolean => {
		const formErrors: { [key: string]: string } = {};

		// Step 1 validation (Cause Information)
		if (!formData.name?.trim()) {
			formErrors.name = formatMessage({
				id: 'error.cause_name_required',
			});
		}
		if (!formData.description?.trim()) {
			formErrors.description = formatMessage({
				id: 'error.cause_description_required',
			});
		}

		// Step 2 validation (Select Projects)
		if (
			!formData.selectedProjects ||
			formData.selectedProjects.split(',').length === 0
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

	// Handle form cancellation
	const handleCancel = () => {
		if (
			confirm(
				'Are you sure you want to cancel? All progress will be lost.',
			)
		) {
			clearStorage();
			router.push('/causes');
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
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit} noValidate>
					{currentStep === 1 && (
						<CauseInformationStep
							onNext={() => setCurrentStep(2)}
						/>
					)}
					{currentStep === 2 && <SelectProjectsStep />}
					{currentStep === 3 && <ReviewStep />}
				</form>
			</FormProvider>
		</>
	);
};

export default CreateCause;
