import { useState, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/features/hooks';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { StreamType } from '@/types/config';
import { defaultTokenDistroHelper } from '@/context/tokenDistro.context';

const useRegenTokenDistroHelper = (streamType: StreamType) => {
	const [regenTokenDistroHelper, setRegenTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const streamInfo = useAppSelector(
		state => state.subgraph.currentValues[streamType],
		shallowEqual,
	);
	useEffect(() => {
		if (!streamInfo) return;
		setRegenTokenDistroHelper(
			new TokenDistroHelper(streamInfo, streamType),
		);
	}, [streamInfo, streamType]);
	return { regenTokenDistroHelper };
};

export default useRegenTokenDistroHelper;
