import { UploadFile, EFileUploadingStatus } from '@/components/FileUploader';

export const getFile = async (url: string, index: number) => {
	let blob: BlobPart[] = [];
	let contentType = 'unkonwn';
	const fileName = `Attachment ${index + 1}`;
	try {
		const response = await fetch(url);
		contentType = response.headers.get('content-type') || contentType;
		const _blob = await response.blob();
		blob = [_blob];
		const file: UploadFile = new File(blob, fileName, {
			type: contentType,
		});
		file.url = url;
		file.status = EFileUploadingStatus.UPLOADED;
		file.logo = convertFileTypeToLogo(file.type);
		return file;
	} catch (error) {
		const file: UploadFile = new File(blob, fileName, {
			type: contentType,
		});
		file.url = url;
		file.status = EFileUploadingStatus.UPLOADED;
		file.logo = 'unknown';
		return file;
	}
};

export const convertUrlToUploadFile = async (urls: string[]) => {
	const promises: Promise<UploadFile>[] = [];
	for (let i = 0; i < urls.length; i++) {
		promises.push(getFile(urls[i], i));
	}
	return await Promise.all(promises);
};

export const convertFileTypeToLogo = (type: string) => {
	const [mainType, subType] = type.split('/');
	switch (mainType) {
		case 'image':
			return 'image';
		case 'application':
			switch (subType) {
				case 'pdf':
					return 'pdf';
				case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
					return 'docx';
				case 'msword':
					return 'doc';
				case 'vnd.openxmlformats-officedocument.presentationml.presentation':
					return 'pptx';
				case 'vnd.ms-powerpoint':
					return 'ppt';
			}
			return 'text';
	}
	return 'unknown';
};
