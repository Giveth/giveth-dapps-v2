import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { QuillWrapper } from '@/components/styled-components/Quill';

const RichTextViewer = (props: { content?: string }) => {
	return (
		<Wrapper>
			<ReactQuill value={props.content} readOnly theme='bubble' />
		</Wrapper>
	);
};

const Wrapper = styled(QuillWrapper)`
	.ql-container > .ql-editor {
		padding: 0;
	}
`;

export default RichTextViewer;
