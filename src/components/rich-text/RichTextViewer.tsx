import RichTextLexicalViewer from '@/components/rich-text-lexical/RichTextLexicalViewer';

const RichTextViewer = (props: { content?: string }) => {
	return <RichTextLexicalViewer content={props.content} />;
};

export default RichTextViewer;
