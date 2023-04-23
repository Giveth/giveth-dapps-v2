import { P, IconRocketInSpace32 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { createApi } from 'unsplash-js';
import Image from 'next/image';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from './Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IHelpItem } from '@/components/RichTextInput';
import { postRequest } from '@/helpers/requests';
import Spinner from '@/components/Spinner';
import { showToastError } from '@/lib/helpers';
import { FlexCenter } from '@/components/styled-components/Flex';
import type { IModal } from '@/types/common';
import type { FC } from 'react';

const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_API!;
const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
const unsplash = createApi({ accessKey });
const perPage = 4;
const orientation = 'landscape';

interface IChatGPTModal extends IModal {
	helpItem: IHelpItem;
	userInput: string;
}

export const ChatGPTModal: FC<IChatGPTModal> = props => {
	const { setShowModal, helpItem, userInput } = props;
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const [response, setResponse] = useState<string | JSX.Element>();
	const [isLoading, setIsLoading] = useState(false);

	const fetchPhotos = async (query: string) => {
		try {
			const res = await unsplash.search.getPhotos({
				query,
				orientation,
				perPage,
				page: 1,
			});
			return res.response?.results;
		} catch (error) {
			showToastError(error);
			captureException(error, {
				tags: {
					section: 'unsplashSearchGPTModal',
				},
			});
		}
	};

	useEffect(() => {
		const reqFunc = async () => {
			setIsLoading(true);
			const content = helpItem.question + '\n\n' + userInput;
			const res = await postRequest(
				'https://api.openai.com/v1/chat/completions',
				false,
				{
					model: 'gpt-3.5-turbo',
					messages: [
						{
							role: 'user',
							content,
						},
					],
					temperature: 0.7,
				},
				{
					Authorization: `Bearer ${openAIKey}`,
				},
			);
			const resContent = res?.choices[0]?.message?.content;
			if (helpItem.type === 'image') {
				const images = await fetchPhotos(resContent);
				const imageWrapper = (
					<ImagesContainer>
						{images?.map(i => (
							<ImageContainer key={i.id}>
								<Image
									src={i.urls.thumb}
									alt={i.alt_description!}
									fill
								/>
							</ImageContainer>
						))}
					</ImagesContainer>
				);
				setResponse(imageWrapper);
			} else setResponse(resContent);
			setIsLoading(false);
		};
		reqFunc();
	}, [helpItem]);

	return (
		<Modal
			headerIcon={<IconRocketInSpace32 />}
			headerTitle='ChatGPT Help'
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<ModalContainer>
				{isLoading ? (
					<Spinner />
				) : (
					<ResponseWrapper>{response}</ResponseWrapper>
				)}
			</ModalContainer>
		</Modal>
	);
};

const ImageContainer = styled.div`
	width: 200px;
	height: 138px;
	border-radius: 5px;
	overflow: hidden;
	position: relative;
	cursor: pointer;
	img {
		object-fit: cover;
	}
`;

const ImagesContainer = styled(FlexCenter)`
	padding: 10px;
	flex-wrap: wrap;
	gap: 10px;
`;

const ResponseWrapper = styled(P)`
	text-align: left;
	padding: 0 20px 20px;
`;

const ModalContainer = styled.div`
	padding: 32px 24px 24px;
	${mediaQueries.tablet} {
		width: 462px;
	}
`;
