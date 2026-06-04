import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
	IV6ActiveQfProjectRedirect,
	V6_ACTIVE_QF_PROJECT_REDIRECT_STALE_TIME,
	v6QfRedirectQueryOptions,
} from '@/services/v6QF';

interface IUseProjectEditLockArgs {
	projectId?: number | string;
	enabled?: boolean;
}

export const useProjectEditLock = ({
	projectId,
	enabled = true,
}: IUseProjectEditLockArgs) => {
	const queryClient = useQueryClient();
	const numericProjectId = Number(projectId);
	const hasValidProjectId = !!projectId && !Number.isNaN(numericProjectId);
	const queryProjectId = hasValidProjectId ? numericProjectId : 0;
	const isQueryEnabled = enabled && hasValidProjectId;
	const [isFetchingProjectEditLock, setIsFetchingProjectEditLock] =
		useState(false);

	const { data, isLoading, isFetching } = useQuery({
		...v6QfRedirectQueryOptions(queryProjectId),
		enabled: isQueryEnabled,
		refetchInterval: V6_ACTIVE_QF_PROJECT_REDIRECT_STALE_TIME,
	});

	const checkProjectEditLock = useCallback(async () => {
		if (!hasValidProjectId) return false;

		setIsFetchingProjectEditLock(true);
		try {
			const redirectInfo =
				await queryClient.fetchQuery<IV6ActiveQfProjectRedirect | null>(
					{
						...v6QfRedirectQueryOptions(queryProjectId),
						staleTime: 0,
					},
				);
			return !!redirectInfo;
		} finally {
			setIsFetchingProjectEditLock(false);
		}
	}, [hasValidProjectId, queryClient, queryProjectId]);

	const isInitialProjectEditLockCheck =
		isQueryEnabled && (isLoading || (isFetching && data === undefined));

	return {
		checkProjectEditLock,
		isCheckingProjectEditLock:
			isInitialProjectEditLockCheck || isFetchingProjectEditLock,
		isProjectEditLocked: !!data,
	};
};
