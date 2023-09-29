import Image from 'next/image';
import styled from 'styled-components';
import { brandColors, H4 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { FC } from 'react';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { compareAddresses } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';

interface IProps {
	isCancelled?: boolean;
	ownerAddress?: string;
}

const NotAvailableProject: FC<IProps> = ({ ownerAddress, isCancelled }) => {
	const { isLoading, userData } = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();

	const isOwner = compareAddresses(userData?.walletAddress, ownerAddress);

	return isLoading ? (
		<Wrapper>Loading</Wrapper>
	) : (
		<Wrapper>
			<Image
				src='/images/missing-project.svg'
				width={122.69}
				height={112}
				alt='missing-project-image'
			/>
			<TitleText>
				{isOwner ? (
					<>
						{formatMessage({ id: 'label.project_not_available' })}{' '}
						{isCancelled &&
							formatMessage({
								id: 'label.if_this_a_mistake',
							})}{' '}
						{isCancelled && (
							<>
								<ExternalLink
									color={brandColors.pinky[500]}
									href={links.DISCORD}
									title='Discord'
								/>
								.
							</>
						)}
					</>
				) : (
					formatMessage({ id: 'label.not_owner' })
				)}
			</TitleText>
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	background-image: url('/images/backgrounds/background-2.png');
	padding: 160px 5px;
`;

const TitleText = styled(H4)`
	color: ${brandColors.deep[800]};
	text-align: center;
	max-width: 1200px;
	margin: 0 40px;
`;

export default NotAvailableProject;
