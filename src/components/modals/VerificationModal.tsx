import styled from 'styled-components';
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
						<Title>Verify your project</Title>
					</div>
				</Header>

				<Description>
					Verified is a top tier status for projects wishing to join
					the GIVbacks program. The GIVbacks program is a
					revolutionary concept that rewards donors to verified
					projects with GIV tokens. By applying for a
					&apos;Verified&apos; project status, you will be able to
					make your project stand out and encourage more donations.
					Getting your project verified also builds a relationship of
					trust with your donors by demonstrating your project&apos;s
					legitimacy and showing that the funds are being used to
					create positive change.
					<br />
					<br />
					This simple verification process requires some additional
					information about your project and the intended impact of
					your organization. If you would like to apply to receive the
					&apos;Verified&apos; badge, encourage more giving and give
					back to those who have helped you reach your goals, please
					fill out this form.
				</Description>

				<OkButton
					label='PROCEED TO VERIFICATION  '
					onClick={handleClick}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
					icon={<IconExternalLink />}
				/>
				<SkipButton
					label='CANCEL'
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

const Description = styled(Lead)`
	margin-top: 24px;
	color: ${neutralColors.gray[900]};
`;
