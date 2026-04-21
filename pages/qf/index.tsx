import { GetServerSideProps } from 'next/types';
import Routes from '@/lib/constants/Routes';

// Old local QF landing page implementation kept here for reference.
// import React from 'react';
// import { projectsQFRoundMetatags } from '@/content/metatags';
// import { GeneralMetatags } from '@/components/Metatag';
// import { QFRoundsProvider } from '@/context/qfrounds.context';
// import QFRoundsIndex from '@/components/views/QFRounds/QFRoundsIndex';
//
// export default function QfLanding() {
// 	return (
// 		<QFRoundsProvider>
// 			<GeneralMetatags info={projectsQFRoundMetatags} />
// 			<QFRoundsIndex />
// 		</QFRoundsProvider>
// 	);
// }

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: Routes.QFProjects,
			permanent: false,
		},
	};
};

export default function QfLandingRedirect() {
	return null;
}
