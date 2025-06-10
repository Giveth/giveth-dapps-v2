import styled from 'styled-components';
import { Container, H3 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import config from '@/configuration';

export const CauseReviewStep = ({ onPrevious }: { onPrevious: () => void }) => {
	const { formatMessage } = useIntl();
	const {
		getValues,
		formState: { isValid },
	} = useFormContext();

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
			!image ||
			!selectedProjects ||
			selectedProjects.length <
				config.CAUSES_CONFIG.minSelectedProjects ||
			selectedProjects.length > config.CAUSES_CONFIG.maxSelectedProjects
		) {
			onPrevious();
		}
	}, [title, description, categories, image, selectedProjects, onPrevious]);

	return (
		<StyledContainer>
			<H3>{formatMessage({ id: 'label.cause.review' })}</H3>
		</StyledContainer>
	);
};
const StyledContainer = styled(Container)`
	margin-top: 136px;
`;
