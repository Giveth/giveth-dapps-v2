import { GeneralMetatags } from '@/components/Metatag';
import { ArchivedQFRoundsView } from '@/components/views/archivedQFRounds/ArchivedQFRounds.view';
import { ArchivedQFRoundsProvider } from '@/components/views/archivedQFRounds/archivedQfRounds.context';
import { archivedQFRoundsMetaTags } from '@/content/metatags';

const ArchivedQFPageRoute = () => {
	return (
		<>
			<GeneralMetatags info={archivedQFRoundsMetaTags} />
			<ArchivedQFRoundsProvider>
				<ArchivedQFRoundsView />
			</ArchivedQFRoundsProvider>
		</>
	);
};
export default ArchivedQFPageRoute;
