/**
 * Type declaration for katex module
 * Resolves TypeScript module resolution issue with katex types
 * The katex package includes types at node_modules/katex/dist/katex.d.ts
 */
declare module 'katex' {
	const katex: {
		render: (
			tex: string,
			element: HTMLElement,
			options?: {
				displayMode?: boolean;
				output?: 'html' | 'mathml' | 'htmlAndMathml';
				leqno?: boolean;
				fleqn?: boolean;
				throwOnError?: boolean;
				errorColor?: string;
				macros?: Record<string, string>;
				minRuleThickness?: number;
				colorIsTextColor?: boolean;
				strict?: boolean | string | Function;
				trust?: boolean | ((context: any) => boolean);
				maxSize?: number;
				maxExpand?: number;
				globalGroup?: boolean;
			},
		) => void;
		renderToString: (
			tex: string,
			options?: {
				displayMode?: boolean;
				output?: 'html' | 'mathml' | 'htmlAndMathml';
				leqno?: boolean;
				fleqn?: boolean;
				throwOnError?: boolean;
				errorColor?: string;
				macros?: Record<string, string>;
				minRuleThickness?: number;
				colorIsTextColor?: boolean;
				strict?: boolean | string | Function;
				trust?: boolean | ((context: any) => boolean);
				maxSize?: number;
				maxExpand?: number;
				globalGroup?: boolean;
			},
		) => string;
		__parse: (tex: string, settings: any) => any;
		__renderToDomTree: (tex: string, settings: any) => any;
		__renderToHTMLTree: (tex: string, settings: any) => any;
		__setFontMetrics: (fontName: string, metrics: any) => void;
		ParseError: any;
	};
	export default katex;
}
