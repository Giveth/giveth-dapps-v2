import styled from 'styled-components';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	H5,
	IconExternalLink,
	IconVerifiedBadge32,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';

import { useRouter } from 'next/router';
import { Modal } from '@/components/modals/Modal';
import { useAppSelector } from '@/features/hooks';
import Routes from '@/lib/constants/Routes';
import { ETheme } from '@/features/general/general.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const VerificationModal = (props: { onClose: () => void }) => {
	const router = useRouter();
	const slug = router.query.projectIdSlug as string;
	const { onClose } = props;
	const theme = useAppSelector(state => state.general.theme);
	const { isAnimating, closeModal } = useModalAnimation(onClose);
	const { formatMessage } = useIntl();

	const handleClick = () => {
		router.push(`${Routes.Verification}/${slug}`);
		closeModal();
	};

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating} hiddenClose>
			<Container>
				<Header>
					<IconVerifiedBadge32
						size={54}
						color={brandColors.cyan[500]}
					/>
					<div>
						<Title>
							{formatMessage({ id: 'label.verify_your_project' })}
						</Title>
					</div>
				</Header>

				<Description>
					{formatMessage({
						id: 'label.verify_your_project.modal.one',
					})}
					<br />
					<br />
					{formatMessage({
						id: 'label.verify_your_project.modal.two',
					})}
					<TextLink
						href='https://docs.giveth.io/dapps/projectVerification/'
						target='_blank'
						rel='noreferrer'
					>
						{formatMessage({
							id: 'label.verify_your_project.modal.three',
						})}
					</TextLink>
					{formatMessage({
						id: 'label.verify_your_project.modal.four',
					})}
				</Description>

				<OkButton
					label={formatMessage({
						id: 'label.proceed_to_verification',
					})}
					onClick={handleClick}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
					icon={<IconExternalLink />}
				/>
				<SkipButton
					label={formatMessage({
						id: 'label.cancel',
					})}
					onClick={closeModal}
					buttonType='texty'
				/>
			</Container>
		</Modal>
	);
};

const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`;

const Container = styled.div`
	max-width: 640px;
	padding: 0 27px 24px 27px;
	text-align: left;
`;

const OkButton = styled(Button)`
	width: 100%;
	margin: 48px auto 0;
	font-size: 12px !important;
`;

const SkipButton = styled(Button)`
	margin: 10px auto 0;
	:hover {
		background: transparent;
		color: ${brandColors.deep[200]};
	}
`;

const Title = styled(H5)`
	font-weight: 700;
`;

const TextLink = styled.a`
	color: ${brandColors.pinky[500]};
`;

const Description = styled(Lead)`
	margin-top: 24px;
	color: ${neutralColors.gray[900]};
`;
