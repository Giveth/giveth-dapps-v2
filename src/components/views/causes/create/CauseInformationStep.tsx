import { Col, P, Row, Button, H4 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { CauseProGuide } from '@/components/views/causes/create/CauseProGuide';
import { ECreateCauseSections } from '@/components/views/causes/create/types';
import CauseTitleInput from '@/components/views/causes/create/formElements/CauseTitleInput';
import CauseDescriptionInput, {
	CAUSE_DESCRIPTION_MIN_LIMIT,
} from '@/components/views/causes/create/formElements/CauseDescriptionInput';
import CauseImageInput from '@/components/views/causes/create/formElements/CauseImageInput';
import CauseCategoryInput from '@/components/views/causes/create/formElements/CauseCategoryInput';
import {
	ButtonContainer,
	NextDescription,
	StyledContainer,
	Title,
	Desc,
} from '@/components/views/causes/create/Create.sc';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

interface ICauseInformationStepProps {
	onNext: () => void;
}

export const CauseInformationStep = ({
	onNext,
}: ICauseInformationStepProps) => {
	const { formatMessage } = useIntl();
	const [activeCauseSection, setActiveCauseSection] =
		useState<ECreateCauseSections>(ECreateCauseSections.default);
	const [isLoading, setIsLoading] = useState(false);

	const {
		watch,
		formState: { isValid },
	} = useFormContext();

	const titleValue = watch('title');
	const descriptionValue = watch('description');
	const imageValue = watch('image');

	// Check if description meets minimum length requirement
	const isDescriptionValid =
		descriptionValue &&
		descriptionValue.replace(/<[^>]*>/g, '').trim().length >=
			CAUSE_DESCRIPTION_MIN_LIMIT;

	const handleContinue = () => {
		if (titleValue?.trim() && isValid && isDescriptionValid) {
			onNext();
		}
	};

	return (
		<StyledContainer>
			<Row>
				<Col lg={8} md={12}>
					<Title
						onMouseEnter={() =>
							setActiveCauseSection(ECreateCauseSections.default)
						}
					>
						{formatMessage({ id: 'label.cause.cause_information' })}
					</Title>
					<Desc>
						{formatMessage({ id: 'label.cause.info_desc' })}
					</Desc>
					<CauseTitleInput />
					<CauseDescriptionInput
						setActiveCauseSection={setActiveCauseSection}
					/>
					<CauseImageInput
						setIsLoading={setIsLoading}
						setActiveCauseSection={setActiveCauseSection}
					/>
					<CauseCategoryInput
						setActiveCauseSection={setActiveCauseSection}
					/>
					{!titleValue?.trim() && (
						<InlineToast
							type={EToastType.Warning}
							message={formatMessage({
								id: 'label.cause.title_required',
							})}
						/>
					)}
					{!isDescriptionValid && descriptionValue && (
						<InlineToast
							type={EToastType.Warning}
							message={formatMessage({
								id: 'label.cause.description_required',
							})}
						/>
					)}
					{!imageValue && (
						<InlineToast
							type={EToastType.Warning}
							message={formatMessage({
								id: 'label.cause.image_required',
							})}
						/>
					)}
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
						<Button
							buttonType='primary'
							size='large'
							onClick={handleContinue}
							disabled={
								!titleValue?.trim() ||
								!isValid ||
								!isDescriptionValid ||
								!imageValue ||
								isLoading
							}
							label={formatMessage({ id: 'label.continue' })}
						/>
					</ButtonContainer>
				</Col>
				<Col lg={4} md={12}>
					<CauseProGuide activeSection={activeCauseSection} />
				</Col>
			</Row>
		</StyledContainer>
	);
};
