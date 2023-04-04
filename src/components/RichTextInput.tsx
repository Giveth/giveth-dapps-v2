import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
// eslint-disable-next-line import/named
import ReactQuill, { Quill } from 'react-quill';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
// @ts-ignore
import MagicUrl from 'quill-magic-url';
// @ts-ignore
import * as Emoji from 'quill-emoji';
import { neutralColors, SublineBold } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import ImageUploader from './richImageUploader/imageUploader';
import { UPLOAD_IMAGE } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { isSSRMode, showToastError } from '@/lib/helpers';
import { Relative } from '@/components/styled-components/Position';
import { Shadow } from '@/components/styled-components/Shadow';

(window as any).Quill = Quill;

const ImageResize = require('quill-image-resize-module').default;

Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/emoji', Emoji);
Quill.register('modules/ImageResize', ImageResize);
Quill.register('modules/magicUrl', MagicUrl);

const QuillVideo = Quill.import('formats/video');
const BlockEmbed = Quill.import('blots/block/embed');

const VIDEO_ATTRIBUTES = ['height', 'width'];

// provides a custom div wrapper around the default Video blot
class Video extends BlockEmbed {
	static create(value: any) {
		const iframeNode = QuillVideo.create(value);
		const node = super.create();
		node.appendChild(iframeNode);
		return node;
	}

	static formats(domNode: any) {
		if (isSSRMode) {
			return;
		}
		const iframe = domNode?.getElementsByTagName('iframe')[0];
		return VIDEO_ATTRIBUTES.reduce(function (formats: any, attribute: any) {
			if (iframe.hasAttribute(attribute)) {
				formats[attribute] = iframe?.getAttribute(attribute);
			}
			return formats;
		}, {});
	}

	static value(domNode: any) {
		if (typeof window === 'undefined') {
			return;
		}
		return domNode?.getElementsByTagName('iframe')[0]?.getAttribute('src');
	}

	format(name: any, value: any) {
		if (VIDEO_ATTRIBUTES.indexOf(name) > -1) {
			if (value) {
				this.domNode.setAttribute(name, value);
			} else {
				this.domNode.removeAttribute(name);
			}
		} else {
			super.format(name, value);
		}
	}
}

Video.blotName = 'video';
Video.className = 'ql-video-wrapper';
Video.tagName = 'DIV';

Quill.register(Video, true);

const uploadImage = async (file: any, projectId: string) => {
	try {
		console.log('Uploading image, please wait...');
		const { data: imageUploaded } = await client.mutate({
			mutation: UPLOAD_IMAGE,
			variables: {
				imageUpload: {
					image: file,
					projectId: projectId ? parseFloat(projectId) : null,
				},
			},
		});

		return imageUploaded?.uploadImage?.url;
	} catch (error) {
		showToastError(error);
		captureException(error, {
			tags: {
				section: 'QuillRichTextInput',
			},
		});
	}
};

const modules = (projectId?: any) => {
	return {
		toolbar: [
			[{ header: '1' }, { header: '2' }],
			[{ size: [] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['link', 'image', 'video'],
			['emoji'],
			['clean'],
		],
		'emoji-toolbar': true,
		'emoji-textarea': true,
		'emoji-shortname': true,
		magicUrl: true,
		clipboard: {
			// toggle to add extra line breaks when pasting HTML:
			matchVisual: false,
		},
		ImageResize: {},
		imageUploader: {
			upload: async (file: any) => {
				const url = await uploadImage(file, projectId);
				console.log('Image uploaded Url:', url);
				return url;
			},
		},
	};
};

const formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'video',
	'emoji',
	'imageBlot',
];
interface ITextRichWithQuillProps {
	value: string;
	setValue: (value: string) => void;
	setIsLimitExceeded?: Dispatch<SetStateAction<boolean>>;
	placeholder?: string;
	limit?: number;
	style?: any;
	projectId?: string;
	noShadow?: boolean;
}

const TextRichWithQuill: FC<ITextRichWithQuillProps> = ({
	value,
	setValue,
	placeholder,
	limit,
	style,
	projectId,
	setIsLimitExceeded,
	noShadow,
}) => {
	const [mod, setMod] = useState<any>();

	useEffect(() => {
		setMod(modules(projectId));
	}, []);

	if (!mod) return null;

	return (
		<Relative>
			<ReactQuillStyled
				noShadow={noShadow}
				modules={mod}
				formats={formats}
				theme='snow'
				value={value}
				onChange={setValue}
				style={style}
				placeholder={placeholder}
			/>
			{limit && (
				<RichtextCounter
					limit={limit}
					value={value}
					setIsLimitExceeded={setIsLimitExceeded}
				/>
			)}
		</Relative>
	);
};

const calcLengthOfHTML = (html: string) => {
	const plainString = html.replace(/<[^>]+>/g, '');
	return plainString.length;
};
interface IRichtextCounterProps {
	value: string;
	limit: number;
	setIsLimitExceeded?: Dispatch<SetStateAction<boolean>>;
}

const RichtextCounter: FC<IRichtextCounterProps> = ({
	value,
	limit,
	setIsLimitExceeded,
}) => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const temp = setTimeout(() => {
			const _count = calcLengthOfHTML(value);
			setCount(_count);
			setIsLimitExceeded && setIsLimitExceeded(_count > limit);
		}, 1000);

		return () => {
			clearTimeout(temp);
		};
	}, [limit, setIsLimitExceeded, value]);

	return (
		<CounterContainer>
			{count} / {limit}
		</CounterContainer>
	);
};

const ReactQuillStyled = styled(ReactQuill)<{ noShadow?: boolean }>`
	margin-bottom: 0 !important;
	border-radius: 8px;
	box-shadow: ${({ noShadow }) => !noShadow && Shadow.Neutral[400]};
	> .ql-container {
		height: 30rem;
		> .ql-editor {
			word-break: break-word;
			font-family: 'Red Hat Text', sans-serif;
			font-size: 16px;
			p,
			li,
			blockquote {
				line-height: 24px;
			}
			h1,
			h2 {
				font-family: 'TeX Gyre Adventor', serif;
			}
			.ql-size-small {
				line-height: 18px;
			}
			.ql-size-large {
				line-height: 36px;
			}
			.ql-size-huge {
				line-height: 56px;
			}
		}
	}
	> div:first-of-type {
		border-width: 2px;
		border-radius: 8px 8px 0 0;
		border-color: ${neutralColors.gray[300]};
	}
	> div:last-of-type {
		border-radius: 0 0 8px 8px;
		border-color: ${neutralColors.gray[300]};
		border-width: 2px;
		border-top-color: transparent;
	}
`;

const CounterContainer = styled(SublineBold)`
	position: absolute;
	bottom: 10px;
	right: 10px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 64px;
	padding: 6px 10px;
	color: ${neutralColors.gray[700]};
	opacity: 0.8;
`;

export default TextRichWithQuill;
