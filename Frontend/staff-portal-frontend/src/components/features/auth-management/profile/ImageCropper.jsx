import { X } from "lucide-react";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

const image64ToImage = (base64) => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = base64;
		image.onload = () => {
			resolve(image);
		};
		image.onerror = () => {
			reject(image);
		};
	});
};

const cropImage = (image, x, y, newWidth, newHeight) => {
	const canvas = document.createElement("canvas");
	canvas.width = newWidth;
	canvas.height = newHeight;
	const ctx = canvas.getContext("2d");

	// Draw the image onto the canvas, starting at a clipped position and size
	ctx.drawImage(image, x, y, newWidth, newHeight, 0, 0, newWidth, newHeight);
	return canvas.toDataURL("image/png");
};

const cropImage64 = async (base64, x, y, newWidth, newHeight) => {
	const image = await image64ToImage(base64);
	return cropImage(image, x, y, newWidth, newHeight);
};

const ImageCropper = ({ image, setCroppedImage, onClose }) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [coordinate, setCoordinate] = useState(null);

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCoordinate(croppedAreaPixels);
	}, []);

	const handleCrop = async () => {
		if (!coordinate) return;
		const { x, y, width, height } = coordinate;
		const croppedDataUrl = await cropImage64(image, x, y, width, height);
		setCroppedImage(croppedDataUrl);
	};
	return (
		<>
			<div className='fixed inset-0 bg-black/80 z-[70] flex flex-col items-center justify-center p-4'>
				<div className='w-full max-w-xl h-2/3 bg-gray-900 rounded-xl p-4 shadow-2xl relative flex flex-col'>
					<button>
						<X className='w-6 h-6' />
					</button>

					{/* Cropper Area */}
					<div className='flex-grow relative mb-4'>
						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							cropShape='round'
							showGrid={false}
							aspect={1}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
						/>
					</div>
					<div className='flex space-x-4'>
						<button
							className='bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md'
							onClick={handleCrop}
							disabled={!coordinate}>
							Done
						</button>
						<button
							className='bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md'
							onClick={onClose}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ImageCropper;
