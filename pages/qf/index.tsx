// pages/qf/index.tsx

import React from 'react';
import { GeneralMetatags } from '@/components/Metatag';
import { QFRoundsProvider } from '@/context/qfrounds.context';
import QFRoundsIndex from '@/components/views/QFRounds/QFRoundsIndex';
import { projectsQFRoundMetatags } from '@/content/metatags';

export default function QfLanding() {
	return (
		<QFRoundsProvider>
			<GeneralMetatags info={projectsQFRoundMetatags} />
			<QFRoundsIndex />
		</QFRoundsProvider>
	);
}
