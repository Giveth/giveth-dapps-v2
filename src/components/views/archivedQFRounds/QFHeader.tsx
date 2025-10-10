import { Flex, H6, neutralColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Routes from '@/lib/constants/Routes';
import { useAppSelector } from '../../../features/hooks';

enum EQFPageStatus {
	ACTIVE = 'label.active_round',
	ARCHIVED = 'label.archived_rounds',
}

export const QFHeader = () => {
	const { formatMessage } = useIntl();
	const { pathname } = useRouter();
	const isArchivedPath = pathname.startsWith(Routes.QFArchived);

	// Get active round
	const { activeQFRound } = useAppSelector((state: any) => state.general);

	return (
		<Flex gap='24px'>
			{activeQFRound && (
				<Link href={Routes.QFProjects}>
					<Item active={!isArchivedPath}>
						{formatMessage({ id: EQFPageStatus.ACTIVE })}
					</Item>
				</Link>
			)}
			<Link href={Routes.QFArchived}>
				<Item active={isArchivedPath}>
					{formatMessage({ id: EQFPageStatus.ARCHIVED })}
				</Item>
			</Link>
		</Flex>
	);
};

const Item = styled(H6)<{ active: boolean }>`
	padding: 12px 16px 8px 16px;
	cursor: pointer;
	border-bottom-color: ${neutralColors.gray[500]};
	border-bottom-style: solid;
	border-bottom-width: ${({ active }) => (active ? '4px' : '0')};
	transition: border-bottom-width 0.1s ease-in-out;
	&:hover {
		border-bottom-width: 4px;
	}
`;
