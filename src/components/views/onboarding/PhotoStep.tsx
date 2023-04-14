import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { Lead } from '@giveth/ui-design-system';
import Image from 'next/image';
import { IStep } from './common';
import { OnboardSteps } from './Onboarding.view';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { SetProfilePic } from '@/components/setProfilePic/SetProfilePic';
import { FlexCenter } from '@/components/styled-components/Flex';

const PhotoStep: FC<IStep> = ({ setStep }) => {
	const dispatch = useAppDispatch();
	const isSignedIn = useAppSelector(state => state.user.isSignedIn);

	useEffect(() => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [isSignedIn]);

	return (
		<ProfilePicWrapper direction='column' gap='24px'>
			<ProfilePicture
				src='/images/avatar.svg'
				alt='Profile Picture'
				height={128}
				width={128}
			/>
			<Desc>
				This is what your profile looks like right now. A little boring,
				right? <br /> Upload something better to personalize your
				profile.
			</Desc>
			<SetProfilePic
				isOnboarding={true}
				callback={() => setStep(OnboardSteps.DONE)}
			/>
		</ProfilePicWrapper>
	);
};

const ProfilePicWrapper = styled(FlexCenter)`
	padding-bottom: 24px;
`;

const ProfilePicture = styled(Image)`
	border-radius: 8px;
`;

const Desc = styled(Lead)`
	text-align: center;
	padding-bottom: 24px;
`;

export default PhotoStep;
