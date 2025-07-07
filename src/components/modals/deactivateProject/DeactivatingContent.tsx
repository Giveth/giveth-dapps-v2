import { Lead } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { Bullets } from '@/components/styled-components/Bullets';

const DeactivatingContent = ({ isCause }: { isCause: boolean }) => {
	const { formatMessage } = useIntl();
	const bulletPointsText = [
		formatMessage({
			id: isCause
				? 'label.cause.deactivate_cause_modal.description_3'
				: 'label.project.deactivate_project_modal.description_3',
		}),
		formatMessage({
			id: isCause
				? 'label.cause.deactivate_cause_modal.description_4'
				: 'label.project.deactivate_project_modal.description_4',
		}),
		formatMessage({
			id: isCause
				? 'label.cause.deactivate_cause_modal.description_5'
				: 'label.project.deactivate_project_modal.description_5',
		}),
		formatMessage({
			id: isCause
				? 'label.cause.deactivate_cause_modal.description_6'
				: 'label.project.deactivate_project_modal.description_6',
		}),
	];
	return (
		<Lead>
			{formatMessage({
				id: isCause
					? 'label.cause.deactivate_cause_modal.description'
					: 'label.project.deactivate_project_modal.description',
			})}
			<Bullets $image='/images/bullets/bullet_orange.svg'>
				{bulletPointsText.map((text, index) => (
					<li key={`bullet-point-${index}`}>{text}</li>
				))}
			</Bullets>
		</Lead>
	);
};

export default DeactivatingContent;
