import styled from 'styled-components';
import {
	brandColors,
	Col,
	Container,
	H3,
	P,
	Row,
	Button,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { CauseProGuide } from '@/components/views/causes/create/CauseProGuide';
import { ECreateCauseSections } from '@/components/views/causes/create/types';
import CauseDescriptionInput from './CauseDescriptionInput';

interface ICauseInformationStepProps {
	onNext: () => void;
}

export const CauseInformationStep = ({
	onNext,
}: ICauseInformationStepProps) => {
	const { formatMessage } = useIntl();
	const [activeCauseSection, setActiveCauseSection] =
		useState<ECreateCauseSections>(ECreateCauseSections.default);

	const {
		register,
		watch,
		formState: { errors: formErrors, isValid },
	} = useFormContext();

	const titleValue = watch('name');

	const handleContinue = () => {
		if (titleValue?.trim() && isValid) {
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
							registerName='name'
							registerOptions={requiredOptions.title}
							error={formErrors.name}
						/>
					</InputWrapper>
					<CauseDescriptionInput
						setActiveCauseSection={setActiveCauseSection}
					/>
					<ButtonContainer>
						<Button
							buttonType='primary'
							size='large'
							onClick={handleContinue}
							disabled={!titleValue?.trim() || !isValid}
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
	margin-bottom: 48px;
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

const ButtonContainer = styled.div`
	margin-top: 32px;
	display: flex;
	justify-content: flex-start;
`;
