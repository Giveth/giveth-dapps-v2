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
	max-width: 750px;
	a {
		color: #007bff !important;
		&:hover {
			text-decoration: underline !important;
		}
	}
`;

export default RichTextViewer;
