import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { IconPlus } from '@giveth/ui-design-system';
import { zIndex, mediaQueries, device } from '@/lib/constants/constants';
import { useDelayedState } from '@/hooks/useDelayedState';
import { ItemsProvider } from '@/context/Items.context';
import useMediaQuery from '@/hooks/useMediaQuery';
import Routes from '@/lib/constants/Routes';

interface ICreateButtonWithMenu {
	isHeaderShowing: boolean;
	onClick: () => void;
	size?: 'small' | 'medium' | 'large';
	isProjectPage?: boolean;
}

export const CreateButtonWithMenu: FC<ICreateButtonWithMenu> = ({
	isHeaderShowing,
	onClick,
	isProjectPage = false,
}) => {
	const elRef = useRef<HTMLDivElement>(null);
	const [showMenu, menuCondition, openMenu, closeMenu] = useDelayedState();
	const [clickOpen, setClickOpen] = useState(false);
	const isMobile = useMediaQuery(device.mobileL);
	const router = useRouter();
	const { formatMessage } = useIntl();
	useEffect(() => {
		if (!isHeaderShowing) {
			closeMenu();
			setClickOpen(false);
		}
	}, [closeMenu, isHeaderShowing]);

	const handleButtonClick = () => {
		setClickOpen(!clickOpen);
		if (!clickOpen) {
			openMenu();
		} else {
			closeMenu();
		}
	};

	const handleProjectClick = () => {
		router.push(Routes.CreateProject);
		closeMenu();
		setClickOpen(false);
	};

	const handleCauseClick = () => {
		router.push(Routes.CreateCause);
		closeMenu();
		setClickOpen(false);
	};

	return (
		<CreateButtonContainer
			onMouseEnter={!isMobile ? openMenu : undefined}
			onMouseLeave={!isMobile ? closeMenu : undefined}
			ref={elRef}
		>
			<StyledCreateButton
				onClick={handleButtonClick}
				$isOpen={showMenu || clickOpen}
				$isProjectPage={isProjectPage}
			>
				<ButtonContent>
					<IconPlus size={16} />
					{isMobile && (
						<span>
							{formatMessage({ id: 'label.button.create' })}
						</span>
					)}
				</ButtonContent>
			</StyledCreateButton>
			{(menuCondition || clickOpen) && (
				<ItemsProvider
					close={() => {
						closeMenu();
						setClickOpen(false);
					}}
				>
					<CreateMenu
						isAnimating={showMenu || clickOpen}
						parentRef={elRef}
					>
						<MenuContent>
							<MenuSection>
								<MenuTitle>
									{formatMessage({ id: 'label.project' })}
								</MenuTitle>
								<MenuDescription>
									{formatMessage({
										id: 'label.project.description',
									})}
								</MenuDescription>
								<MenuButton onClick={handleProjectClick}>
									<IconPlus size={16} />
									{formatMessage({ id: 'label.project' })}
								</MenuButton>
							</MenuSection>
							<MenuSection>
								<MenuTitle>
									{formatMessage({ id: 'label.cause' })}
								</MenuTitle>
								<MenuDescription>
									{formatMessage({
										id: 'label.cause.description',
									})}
								</MenuDescription>
								<MenuButton onClick={handleCauseClick}>
									<IconPlus size={16} />
									{formatMessage({ id: 'label.cause' })}
								</MenuButton>
							</MenuSection>
						</MenuContent>
					</CreateMenu>
				</ItemsProvider>
			)}
		</CreateButtonContainer>
	);
};

const CreateButtonContainer = styled.div`
	position: relative;
	display: inline-block;
`;

const StyledCreateButton = styled.button<{
	$isOpen?: boolean;
	$isProjectPage?: boolean;
}>`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	${mediaQueries.laptopS} {
		padding: 15px 24px;
	}
	padding: 15px 16px;
	background-color: ${props =>
		props.$isOpen ? 'white' : '#e1458d'} !important;
	border-color: ${props =>
		props.$isOpen ? '#e5e7eb' : '#e1458d'} !important;
	font-weight: bold !important;
	font-family: 'Red Hat Text', sans-serif;
	color: ${props => (props.$isOpen ? '#82899a' : 'white')} !important;
	text-transform: uppercase !important;
	transition: all 0.2s ease !important;
	border: 2px solid;
	border-radius: 48px;
	font-size: 12px;
	cursor: pointer;

	&:hover {
		background-color: white !important;
		border-color: #e5e7eb !important;
		color: #82899a !important;
	}

	span,
	div,
	* {
		text-transform: uppercase !important;
	}
`;

interface ICreateMenuProps {
	parentRef: RefObject<HTMLDivElement>;
	isAnimating: boolean;
	children: React.ReactNode;
}

const CreateMenu: FC<ICreateMenuProps> = ({
	parentRef,
	isAnimating,
	children,
}) => {
	const el = useRef(document.createElement('div'));

	useEffect(() => {
		const current = el.current;
		const body = document.querySelector('body') as HTMLElement;

		if (body) {
			body.appendChild(current);
		}
		return () => {
			if (body && body.contains(current)) {
				body.removeChild(current);
			}
		};
	}, []);

	return createPortal(
		<MenuContainer
			$isAnimating={isAnimating}
			style={{
				top:
					(parentRef?.current?.getBoundingClientRect().bottom || 0) +
					4,
				right:
					(parentRef?.current?.getBoundingClientRect().left || 0) +
					20,
			}}
		>
			{children}
		</MenuContainer>,
		el.current,
	);
};

const MenuContainer = styled.div<{ $isAnimating: boolean }>`
	position: fixed;
	background: white;
	border-radius: 16px;
	padding: 16px;
	z-index: ${zIndex.MODAL};
	box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.15);
	opacity: ${props => (props.$isAnimating ? 1 : 0)};
	transform: ${props =>
		props.$isAnimating ? 'translateY(0)' : 'translateY(-10px)'};
	transition: all 0.3s ease;
	width: 234px;
	top: 0;
	right: 0;
	left: auto;

	${mediaQueries.mobileS} {
		left: 6%;
		right: auto;
		transform: ${props =>
			props.$isAnimating ? 'translateY(0)' : 'translateY(-10px)'};
	}

	${mediaQueries.tablet} {
		min-width: 280px;
		width: 280px;
		right: 12% !important;
		left: auto;
		transform: ${props =>
			props.$isAnimating
				? 'translateX(-50%) translateY(0)'
				: 'translateX(-50%) translateY(-10px)'};
	}
`;

const MenuContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const MenuSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const MenuTitle = styled.h3`
	font-family: 'Red Hat Text', sans-serif;
	font-size: 12px;
	font-weight: 500;
	color: #a5adbf;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin: 0;
`;

const MenuDescription = styled.p`
	font-family: 'Red Hat Text', sans-serif;
	font-size: 14px;
	line-height: 1.5;
	color: #6b7280;
	margin: 0;
`;

const MenuButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	justify-content: center;
	background-color: #e1458d;
	color: white;
	border: none;
	border-radius: 24px;
	padding: 12px 24px;
	font-weight: 700;
	text-transform: uppercase;
	font-family: 'Red Hat Text', sans-serif;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 14px;

	&:hover {
		background-color: #d13a7f;
	}
`;

const ButtonContent = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;
