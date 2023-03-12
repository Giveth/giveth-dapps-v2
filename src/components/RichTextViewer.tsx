import ReactQuill from 'react-quill';
import styled from 'styled-components';

const RichTextViewer = (props: { content?: string }) => {
	return (
		<Wrapper>
			<ReactQuill value={props.content} readOnly theme='bubble' />
		</Wrapper>
	);
};

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
