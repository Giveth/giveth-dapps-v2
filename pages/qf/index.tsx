// pages/qf/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	QFRoundsProvider,
	useQFRoundsContext,
} from '@/context/qfrounds.context';
import QFRoundsIndex from '@/components/views/qfrounds/QFRoundsIndex';
import { projectsQFRoundMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

export default function QfLanding() {
	const router = useRouter();
	const { qfRounds } = useQFRoundsContext();

	// Redirect to the first QF round if there is only one
	useEffect(() => {
		if (qfRounds.length === 1) {
			router.push(`/qf/${qfRounds[0].slug}`);
		}
	}, [qfRounds, router]);

	return (
		<QFRoundsProvider>
			<GeneralMetatags info={projectsQFRoundMetatags} />
			<QFRoundsIndex />
		</QFRoundsProvider>
	);
}
