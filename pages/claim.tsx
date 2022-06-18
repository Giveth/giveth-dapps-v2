import { useEffect } from 'react';

import ClaimView from '@/components/views/claim/Claim.view';
import { ClaimProvider } from '@/context/claim.context';
import { ETheme, useGeneral } from '@/context/general.context';
import { claimMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

export default function GIVdropRoute() {
	const { setShowHeader, setTheme } = useGeneral();

	useEffect(() => {
		setShowHeader(false);
		setTheme(ETheme.Dark);
		return () => {
			setShowHeader(true);
			setTheme(ETheme.Light);
		};
	}, [setShowHeader, setTheme]);

	return (
		<>
			<GeneralMetatags info={claimMetatags} />
			<ClaimProvider>
				<ClaimView />
			</ClaimProvider>
		</>
	);
}
