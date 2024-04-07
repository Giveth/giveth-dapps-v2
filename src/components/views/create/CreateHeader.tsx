import Image from 'next/image';
import { FC } from 'react';
import Link from 'next/link';
import { Flex, FlexSpacer } from '@giveth/ui-design-system';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

import { StyledHeader, Logo } from '@/components/Header/Header.sc';
import { EScrollDir, useScrollDetection } from '@/hooks/useScrollDetection';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
}

export const CreateHeader: FC<IHeader> = () => {
	const theme = useAppSelector(state => state.general.theme);

	const scrollDir = useScrollDetection();

	return (
		<StyledHeader
			$alignItems='center'
			$baseTheme={theme}
			$show={scrollDir !== EScrollDir.Down}
		>
			<Flex $alignItems='center' gap='16px'>
				<Link href={'/'}>
					<Logo>
						<Image
							width='26'
							height='26'
							alt='Giveth logo'
							src={`/images/back-2.svg`}
						/>
					</Logo>
				</Link>
			</Flex>
			<FlexSpacer />
		</StyledHeader>
	);
};
