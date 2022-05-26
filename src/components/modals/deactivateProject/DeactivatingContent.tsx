import { Lead } from '@giveth/ui-design-system';
import React from 'react';
import { Bullets } from '@/components/styled-components/Bullets';

const DeactivatingContent = () => (
	<Lead>
		Before deactivating your project, be aware that:
		<Bullets image='/images/bullets/bullet_orange.svg'>
			{bulletPointsText.map((text, index) => (
				<li key={`bullet-point-${index}`}>{text}</li>
			))}
		</Bullets>
	</Lead>
);

const bulletPointsText = [
	'Your project will be unlisted from Giveth',
	'All donors will be notified about this action',
	'Your project will be accessible only via direct link and donations will be disabled',
	'If you decide to activate it later, your project will have to be reviewed again',
];

export default DeactivatingContent;
