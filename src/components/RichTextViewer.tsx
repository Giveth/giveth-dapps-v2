import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Shadow } from '@/components/styled-components/Shadow';
import { getRequest } from '@/helpers/requests';

const RichTextViewer = (props: { content?: string }) => {
	const [translated, setTranslated] = useState(props.content);
	const router = useRouter();
	const locale = router ? router.locale : 'en';

	const translate = async () => {
		const res = await getRequest(
			'https://translate.googleapis.com/translate_a/t',
			false,
			{
				client: 'dict-chrome-ex',
				sl: 'auto',
				tl: locale,
				q: props.content,
			},
		);
		setTranslated(res[0][0]);
	};

	return (
		<Wrapper>
			<TranslateBox onClick={translate}>Translate this</TranslateBox>
			<ReactQuill value={translated} readOnly theme='bubble' />
		</Wrapper>
	);
};

const TranslateBox = styled.div`
	margin: 0 auto;
	width: fit-content;
	background-color: white;
	border-radius: 20px;
	border: 2px solid ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	cursor: pointer;
	padding: 8px 16px;
	box-shadow: ${Shadow.Giv[400]};
`;

const Wrapper = styled.div`
	img {
		max-width: 100%;
	}

	a {
		color: #007bff !important;
		&:hover {
			text-decoration: underline !important;
		}
	}

	.ql-container > .ql-editor {
		word-break: break-word;
		padding: 0;
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
		blockquote {
			border-left: 4px solid #ccc;
			margin-bottom: 5px;
			margin-top: 5px;
			padding-left: 16px;
		}
	}
`;

export default RichTextViewer;
