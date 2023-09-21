import styled from 'styled-components';

export const QuillWrapper = styled.div`
	.ql-container > .ql-editor {
		word-break: break-word;
		font-family: 'Red Hat Text', sans-serif;
		font-size: 16px;
		p,
		li,
		blockquote {
			line-height: 24px;
		}
		h1 {
			font-family: 'TeX Gyre Adventor', serif;
			line-height: 45px;
			margin-bottom: 10px;
		}
		h2 {
			font-family: 'TeX Gyre Adventor', serif;
			line-height: 35px;
			margin-bottom: 10px;
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
		img {
			max-width: 100%;
		}
		a {
			color: #007bff !important;
			&:hover {
				text-decoration: underline !important;
			}
		}
	}
`;
