import { neutralColors, brandColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { FC } from 'react';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

const availableLanguages = ['ca', 'en', 'es'];

export const LanguageModal: FC<IModal> = ({ setShowModal }) => {
	const router = useRouter();
	const theme = useAppSelector(state => state.general.theme);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage, locale: currentLocale } = useIntl();
	const isDark = theme === ETheme.Dark;
	const { pathname, asPath, query } = router;

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={
				<Image
					src={`/images/${isDark ? 'globe_white' : 'globe'}.svg`}
					alt='globe'
					width={26}
					height={26}
				/>
			}
			headerTitle={formatMessage({ id: 'label.choose_language' })}
			headerTitlePosition='left'
		>
			<LanguageContainer isDark={isDark}></LanguageContainer>
			<Languages>
				{availableLanguages.map(locale => (
					<Option
						key={locale}
						isCurrentLocale={locale === currentLocale}
						onClick={() => {
							if (locale === currentLocale)
								return setShowModal(false);
							router.push({ pathname, query }, asPath, {
								locale,
							});

							setShowModal(false);
						}}
					>
						<Image
							src={`/images/flags/${locale}.svg`}
							alt='globe'
							width={24}
							height={18}
						/>
						<a>{formatMessage({ id: `lang.${locale}` })}</a>
					</Option>
				))}
			</Languages>
		</Modal>
	);
};

const LanguageContainer = styled.div<{ isDark?: boolean }>`
	width: 362px;

	color: ${props =>
		props.isDark ? neutralColors.gray[100] : brandColors.deep[900]};
`;

const Languages = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	margin: 24px;
`;

const Option = styled.div<{ isCurrentLocale?: boolean; isDark?: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 8px 17px;
	gap: 8px;
	border-radius: 8px;
	cursor: pointer;

	background: ${props =>
		props.isCurrentLocale
			? props.isDark
				? brandColors.giv[500]
				: neutralColors.gray[200]
			: 'transparent'};

	:hover {
		background: ${props =>
			props.isDark ? brandColors.giv[500] : neutralColors.gray[300]};
	}
`;
