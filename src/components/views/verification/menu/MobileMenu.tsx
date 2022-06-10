import styled from 'styled-components';
import { B, neutralColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useState } from 'react';
import { useVerificationData } from '@/context/verification.context';
import { Shadow } from '@/components/styled-components/Shadow';
import { ProgressBar } from '@/components/views/verification/common';
import menuList from '@/components/views/verification/menu/menuList';
import MenuIcon from '/public/images/menu/drawer_menu_black.svg';
import MenuModal from '@/components/views/verification/menu/MenuModal';

const MobileMenu = () => {
	const [showMenu, setShowMenu] = useState(false);

	const { step, verificationData } = useVerificationData();
	const { project } = verificationData || {};
	const { title } = project || {};

	return (
		<>
			<Wrapper>
				<MenuSection onClick={() => setShowMenu(true)}>
					{menuList[step]}
					<Image src={MenuIcon} alt='Menu icon' />{' '}
				</MenuSection>
				<StatusSection>
					<B>Verified status for</B>
					<B>{title}</B>
					<ProgressBar />
				</StatusSection>
			</Wrapper>
			{showMenu && <MenuModal setShowModal={setShowMenu} />}
		</>
	);
};

const MenuSection = styled(B)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`;

const StatusSection = styled.div`
	> :first-child {
		color: ${neutralColors.gray[700]};
		margin-bottom: 16px;
	}
	> :last-child {
		margin-top: 25px;
	}
`;

const Wrapper = styled.div`
	> * {
		background: white;
		border-radius: 16px;
		box-shadow: ${Shadow.Neutral[400]};
		padding: 24px;
		margin-bottom: 24px;
	}
`;

export default MobileMenu;
