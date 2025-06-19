import { Lead } from '@giveth/ui-design-system';
import React from 'react';
import { Bullets } from '@/components/styled-components/Bullets';

const DeactivatingContentCause = () => (
	<Lead>
		Before deactivating your cause, be aware that:
		<Bullets $image='/images/bullets/bullet_orange.svg'>
			{bulletPointsText.map((text, index) => (
				<li key={`bullet-point-${index}`}>{text}</li>
			))}
		</Bullets>
	</Lead>
);

const bulletPointsText = [
	'Your cause will be unlisted from Giveth',
	'All donors will be notified about this action',
	'Your cause will be accessible only via direct link and donations will be disabled',
	'If you decide to activate it later, your cause will have to be reviewed again',
];

export default DeactivatingContentCause;
