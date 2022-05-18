import { useState, useEffect } from 'react';
import { useAppSelector } from '@/features/hooks';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { StreamType } from '@/types/config';
import { ITokenDistroInfo } from '@/types/subgraph';
import { defaultTokenDistroHelper } from '@/context/tokenDistro.context';

const useRegenTokenDistroHelper = (streamType: StreamType) => {
	const [regenTokenDistroHelper, setRegenTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const currentValues = useAppSelector(state => state.subgraph.currentValues);
	useEffect(() => {
		const streamInfo: ITokenDistroInfo | undefined =
			currentValues[streamType];
		if (!streamInfo) return;
		setRegenTokenDistroHelper(
			new TokenDistroHelper(streamInfo, streamType),
		);
	}, [currentValues, streamType]);
	return { regenTokenDistroHelper };
};

export default useRegenTokenDistroHelper;
