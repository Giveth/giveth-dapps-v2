/**
 * Type declaration for Web Speech API
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
 */

interface SpeechRecognitionEvent extends Event {
	resultIndex: number;
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	isFinal: boolean;
	length: number;
	item(index: number): SpeechRecognitionAlternative;
	[index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
}

interface SpeechRecognition extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	maxAlternatives: number;
	start(): void;
	stop(): void;
	abort(): void;
	addEventListener(
		type: 'result',
		listener: (event: SpeechRecognitionEvent) => void,
	): void;
	addEventListener(
		type: 'end' | 'error' | 'start',
		listener: (event: Event) => void,
	): void;
	removeEventListener(type: string, listener: (event: Event) => void): void;
}

interface SpeechRecognitionConstructor {
	new (): SpeechRecognition;
	prototype: SpeechRecognition;
}

interface Window {
	SpeechRecognition?: SpeechRecognitionConstructor;
	webkitSpeechRecognition?: SpeechRecognitionConstructor;
}
