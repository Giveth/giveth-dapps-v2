import Quill from 'quill';

const InlineBlot = Quill.import('blots/block');

class LoadingImage extends InlineBlot {
	static create(src: any) {
		const node = super.create(src);
		if (src === true) return node;

		const image = document.createElement('img');
		image.setAttribute('src', src);
		node.appendChild(image);
		return node;
	}
	deleteAt(index: any, length: any) {
		super.deleteAt(index, length);
		this.cache = {};
	}
	static value(domNode: any) {
		const { src, custom } = domNode.dataset;
		return { src, custom };
	}
}

LoadingImage.blotName = 'imageBlot';
LoadingImage.className = 'image-uploading';
LoadingImage.tagName = 'span';
Quill.register({ 'formats/imageBlot': LoadingImage });

export default LoadingImage;
