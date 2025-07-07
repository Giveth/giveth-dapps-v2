import {
	Caption,
	IconEye16,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useProjectContext } from '@/context/project.context';

const ProjectOwnerBanner = () => {
	const { formatMessage } = useIntl();
	const { isCause } = useProjectContext();

	return (
		<Wrapper gap='16px' $alignItems='center'>
			<IconEye16 />
			<Caption>
				{isCause
					? formatMessage({ id: 'label.cause.owner_banner' })
					: formatMessage({ id: 'label.project.owner_banner' })}
			</Caption>
		</Wrapper>
	);
};

export default ProjectOwnerBanner;

const Wrapper = styled(Flex)`
	padding: 16px;
	background-color: ${semanticColors.blueSky[100]};
	margin-bottom: 16px;
	color: ${semanticColors.blueSky[600]};
	border: 1px solid ${semanticColors.blueSky[600]};
	border-radius: 8px;
`;
