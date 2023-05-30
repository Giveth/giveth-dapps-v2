import { H4, Lead, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';

const ProjectGivSavingsIndex = () => {
	const { formatMessage } = useIntl();

	return (
		<div>
			<H4 weight={700}>{formatMessage({ id: 'label.givsavings' })}</H4>
			<Desc size='large'>
				{formatMessage({ id: 'page.givsavings.desc' })}{' '}
				<ExternalLink
					title={formatMessage({ id: 'label.learn_more' })}
					href='https://giveth.io/givsavings'
					color={brandColors.pinky[500]}
				/>
			</Desc>
		</div>
	);
};

const Desc = styled(Lead)``;

export default ProjectGivSavingsIndex;
