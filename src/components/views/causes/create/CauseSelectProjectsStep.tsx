import styled from 'styled-components';
import {
	brandColors,
	Col,
	Container,
	H3,
	P,
	Row,
} from '@giveth/ui-design-system';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { CauseProjectsSearch } from '@/components/views/causes/create/formElements/CauseProjectsSearch';
import { CauseProjectsSearchList } from '@/components/views/causes/create/formElements/CauseProjectsSearchList';

interface ICauseSelectProjectsStepProps {
	onNext: () => void;
	onPrevious: () => void;
}

export const CauseSelectProjectsStep = ({
	onPrevious,
	onNext,
}: ICauseSelectProjectsStepProps) => {
	const { formatMessage } = useIntl();
	const { getValues } = useFormContext();

	// Get value from previous step
	const title = getValues('title');
	const description = getValues('description');
	const categories = getValues('categories');
	const image = getValues('image');

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

	return (
		<StyledContainer>
			<Row>
				<Col lg={8} md={12}>
					<Title>
						{formatMessage({ id: 'label.cause.select_projects' })}
					</Title>
					<Desc>
						{formatMessage({
							id: 'label.cause.select_projects_desc',
						})}
					</Desc>
					<CauseProjectsSearch />
					<CauseProjectsSearchList />
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
