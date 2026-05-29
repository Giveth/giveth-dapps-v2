import { GeneralMetatags } from '@/components/Metatag';
import QFRoundsIndex from '@/components/views/QFRounds/QFRoundsIndex';
import { projectsQFRoundMetatags } from '@/content/metatags';
import { QFRoundsProvider } from '@/context/qfrounds.context';

export default function QfLanding() {
	return (
		<QFRoundsProvider>
			<GeneralMetatags info={projectsQFRoundMetatags} />
			<QFRoundsIndex />
		</QFRoundsProvider>
	);
}
