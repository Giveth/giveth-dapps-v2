import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { breakPoints } from '@/lib/helpers';

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

	@media (max-width: ${breakPoints['sm']}px) {
		padding: 0px 16px;
	}
`;

export default RichTextViewer;
