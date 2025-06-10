import styled from 'styled-components';
import {
	brandColors,
	Col,
	Container,
	H3,
	P,
	Row,
	Button,
	H4,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { CauseProGuide } from '@/components/views/causes/create/CauseProGuide';
import { ECreateCauseSections } from '@/components/views/causes/create/types';
import CauseDescriptionInput from '@/components/views/causes/create/formElements/CauseDescriptionInput';
import CauseImageInput from '@/components/views/causes/create/formElements/CauseImageInput';
import CauseCategoryInput from '@/components/views/causes/create/formElements/CauseCategoryInput';

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
		register,
		watch,
		formState: { errors: formErrors, isValid },
	} = useFormContext();

	const titleValue = watch('title');
	const descriptionValue = watch('description');

	// Check if description meets minimum length requirement
	const isDescriptionValid =
		descriptionValue &&
		descriptionValue.replace(/<[^>]*>/g, '').trim().length >= 2000;

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
					<InputWrapper>
						<Input
							label={formatMessage({ id: 'label.cause.title' })}
							placeholder={formatMessage({
								id: 'label.cause.title_placeholder',
							})}
							maxLength={100}
							autoFocus
							size={InputSize.LARGE}
							register={register}
							registerName='title'
							registerOptions={requiredOptions.title}
							error={formErrors.title}
						/>
					</InputWrapper>
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

const InputWrapper = styled.div`
	margin-bottom: 24px;
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
