import { GeneralMetatags } from '@/components/Metatag';
import { ArchivedQFRoundsView } from '@/components/views/archivedQFRounds/ArchivedQFRounds.view';
import { ArchivedQFRoundsProvider } from '@/components/views/archivedQFRounds/archivedQfRounds.context';

const ArchivedQFPageRoute = () => {
	return (
		<>
			<GeneralMetatags
				info={{
					title: 'Giveth | Archived QF Rounds',
					desc: 'Explore past quadratic funding rounds on Giveth! Check out the projects who participated, matching funds, donations and more info on this page.',
					image: 'https://giveth.io/images/banners/qf-banner.svg',
					url: `https://giveth.io/qf-archive`,
				}}
			/>
			<ArchivedQFRoundsProvider>
				<ArchivedQFRoundsView />
			</ArchivedQFRoundsProvider>
		</>
	);
};
export default ArchivedQFPageRoute;
