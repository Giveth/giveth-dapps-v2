import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { client } from '@/apollo/apolloClient';
import { UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';

const useUpload = (
	setUrlCallback?: (url: string) => void,
	setIsUploadingCallback?: (isUploading: boolean) => void,
) => {
	const abort = useRef(() => {});

	const [progress, setProgress] = useState<number>(0);
	const [file, setFile] = useState<File>();
	const [isUploading, setIsUploading] = useState(false);
	const [url, setUrl] = useState<string>('');

	const onDrop = async (acceptedFiles: File[]) => {
		const { data: imageUploaded } = await client.mutate({
			mutation: UPLOAD_PROFILE_PHOTO,
			variables: {
				fileUpload: {
					image: acceptedFiles[0],
				},
			},
			context: {
				fetchOptions: {
					useUpload: true,
					onProgress: (ev: ProgressEvent) => {
						setProgress(Math.round((ev.loaded * 100) / ev.total));
					},
					onAbortPossible: (abortHandler: any) => {
						abort.current = abortHandler;
					},
				},
			},
		});
		setUrl(imageUploaded.upload);
		setUrlCallback && setUrlCallback(imageUploaded.upload);
	};

	const dropzoneProps = useDropzone({
		accept: {
			'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
		},
		multiple: false,
		noClick: true,
		noKeyboard: true,
		useFsAccessApi: false,
		onDrop: async (acceptedFiles: File[]) => {
			setFile(acceptedFiles[0]);
			setIsUploading(true);
			setIsUploadingCallback && setIsUploadingCallback(true);
			await onDrop(acceptedFiles);
			setProgress(0);
			setIsUploading(false);
			setIsUploadingCallback && setIsUploadingCallback(false);
		},
	});

	const onDelete = () => {
		abort.current();
		url && setUrl('');
		setUrlCallback && setUrlCallback('');
		file && setFile(undefined);
		progress !== 0 && setProgress(0);
		isUploading && setIsUploading(false);
		setIsUploadingCallback && setIsUploadingCallback(false);
	};

	return {
		progress,
		isUploading,
		file,
		url,
		dropzoneProps,
		onDelete,
	};
};

export default useUpload;
