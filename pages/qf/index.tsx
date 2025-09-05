// pages/qf/index.tsx
import React from 'react';
import { QFRoundsProvider } from '@/context/qfrounds.context';
import QFRoundsIndex from '@/components/views/qfrounds/QFRoundsIndex';

export default function QfLanding() {
	// TODO: get here qf rounds list is there only one round redirect to it
	return (
		<QFRoundsProvider>
			{/* <GeneralMetatags info={projectsMetatags} /> */}
			<QFRoundsIndex />
		</QFRoundsProvider>
	);
}
