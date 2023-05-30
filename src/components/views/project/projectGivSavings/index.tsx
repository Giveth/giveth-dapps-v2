import { Col, H4, Lead, Row, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';
import { GIVsavingsBalance } from './GIVsavingsBalance';
import { GIVsavingsTabs } from './GIVsavingsTabs';

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
			<Row>
				<Col md={6} lg={4}>
					<GIVsavingsBalance />
				</Col>
			</Row>
			<GIVsavingsTabs />
		</div>
	);
};

const Desc = styled(Lead)``;

export default ProjectGivSavingsIndex;
