import styled from 'styled-components';
import { semanticColors, SublineBold } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';

const AutoSave: FC = () => {
	const { formatMessage } = useIntl();
	return (
		<SaveSection>
			{formatMessage({ id: 'label.auto_save' })}
			<SaveCircle />
		</SaveSection>
	);
};

const SaveCircle = styled.div`
	width: 10px;
	height: 10px;
	margin-top: 5px;
	border-radius: 50%;
	border: 2px solid ${semanticColors.jade[100]};
	background: ${semanticColors.jade[500]};
`;

const SaveSection = styled(SublineBold)`
	display: flex;
	gap: 3px;
`;

export default AutoSave;
