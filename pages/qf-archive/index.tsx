import { ArchivedQFRoundsView } from '@/components/views/archivedQFRounds/ArchivedQFRounds.view';
import { ArchivedQFRoundsProvider } from '@/components/views/archivedQFRounds/archivedQfRounds.context';

const ArchivedQFPageRoute = () => {
	return (
		<ArchivedQFRoundsProvider>
			<ArchivedQFRoundsView />
		</ArchivedQFRoundsProvider>
	);
};
export default ArchivedQFPageRoute;
