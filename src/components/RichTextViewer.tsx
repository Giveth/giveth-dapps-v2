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
	}
`;

export default RichTextViewer;
