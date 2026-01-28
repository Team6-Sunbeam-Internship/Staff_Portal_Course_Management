import { Image } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import ImageCropper from "./ImageCropper";

const ImageLoader = ({ image, callback, size = "128px" }) => {
	const [file, setFile] = useState(null);
	const [result, setResult] = useState(null);
	const [isCropping, toggleCropping] = useReducer((currCrop) => !currCrop, false);
	const [imageState, setImageState] = useState(image);

	// Read the file into a Data URL and open the cropper
	useEffect(() => {
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			setResult(reader.result);
			toggleCropping();
		};
		reader.readAsDataURL(file);
	}, [file]);

	const handleCroppedImage = (newImage) => {
		setImageState(newImage);
		setFile(null);
		setResult(null);
		toggleCropping();
		callback(newImage);
	};

	const handleCloseCropper = () => {
		setFile(null);
		setResult(null);
		toggleCropping();
	};
	return (
		<>
			<label
				className={`relative rounded-full border-0 border-teal-400/50 object-cover shadow-2xl shadow-teal-500/50 group transition-all duration-300 hover:scale-105 cursor-pointer`}
				style={{
					backgroundImage: `url(${imageState})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					width: size,
					height: size,
					display: "inline-block",
				}}>
				{/* Visual overlay for file upload */}
				<div
					className='absolute inset-0 w-full h-full rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300'
					aria-label='Change Avatar'
					title='Change Avatar'>
					<Image className='w-8 h-8 text-teal-400' />
				</div>

				{/* Hidden File Input */}
				<input
					type='file'
					accept='image/*'
					className='hidden'
					onChange={(e) => {
						if (e.target.files && e.target.files.length > 0) {
							setFile(e.target.files[0]);
						}
						e.target.value = null;
					}}
				/>
			</label>

			{/* Render ImageCropper when 'isCropping' is true and 'result' (data URL) is available */}
			{isCropping && result && <ImageCropper image={result} setCroppedImage={handleCroppedImage} onClose={handleCloseCropper} />}
		</>
	);
};

export default ImageLoader;
