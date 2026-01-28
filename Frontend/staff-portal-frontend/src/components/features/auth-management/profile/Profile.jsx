// // import { useEffect, useState } from "react";
// // import {
// // 	AtSign,
// // 	AwardIcon,
// // 	IdCard,
// // 	MapPin,
// // 	Smartphone,
// // 	UserRound,
// // 	Shield,
// // 	Venus,
// // 	Mars,
// // 	Pencil,
// // 	Save,
// // 	X,
// // 	KeyRound,
// // 	CheckCircle,
// // 	AlertTriangle,
// // } from "lucide-react";
// // import ImageLoader from "./ImageLoader";
// // import UserImage from "../../../../assets/user-image.jpg";
// // import ChangePasswordModal from "./ChangePasswordModal";
// // import { useDispatch, useSelector } from "react-redux";
// // import { selectAuthUser } from "../../../../store/selectors/authSelectors";
// // import { useUpdateAuthUserProfileMutation } from "../../../../store/api/authApi/authApi";
// // import { useModal } from "../../../../providers";

// // // Component to display a single field in read-only mode
// // const ProfileField = ({ icon: Icon, label, value }) => (
// // 	<div className='flex items-center p-3 sm:p-4 border-b border-gray-700/50 hover:bg-gray-800 transition duration-300'>
// // 		<div className='flex-shrink-0 w-6 h-6 mr-4 text-teal-400'>
// // 			<Icon className='w-full h-full' />
// // 		</div>
// // 		<div className='flex flex-col flex-grow'>
// // 			<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>{label}</span>
// // 			<span className='text-md text-white font-mono break-all'>{value}</span>
// // 		</div>
// // 	</div>
// // );

// // const Profile = () => {
// // 	const dispatch = useDispatch();
// // 	const authUser = useSelector(selectAuthUser);
// // 	const { name, email, phoneNumber, roles, staffType, staffId, address, specialization, gender } = authUser;
// // 	const { showModal } = useModal();

// // 	// --------------------RTK Query--------------------
// // 	const [updateProfile, { isLoading: isSaving, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError, reset }] =
// // 		useUpdateAuthUserProfileMutation();

// // 	const [editData, setEditData] = useState(authUser);
// // 	const [isEditing, setIsEditing] = useState(false);
// // 	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
// // 	const [statusMessage, setStatusMessage] = useState(null);
// // 	const [isOpen, setIsOpen] = useState(false);

// // 	// Placeholder image URL
// // 	// const userImageUrl = "https://placehold.co/128x128/1e293b/99f6e4?text=AV+";
// // 	// NEW STATE FOR IMAGE HANDLING
// // 	const [croppedImageUrl, setCroppedImageUrl] = useState(UserImage);

// // 	useEffect(() => {
// // 		setEditData(authUser);
// // 	}, [authUser]);

// // 	useEffect(() => {
// // 		if (isUpdateSuccess) {
// // 			setStatusMessage({ type: "success", text: "Profile successfully updated." });
// // 			setIsEditing(false);
// // 			reset();
// // 		} else if (isUpdateError) {
// // 			const errorMessage = updateError?.data?.message || updateError?.error || "Profile update failed. State reverted. Review data and retry.";
// // 			setStatusMessage({ type: "error", text: errorMessage });
// // 			reset();
// // 		}

// // 		const timer = setTimeout(() => setStatusMessage(null), 7000);
// // 		return () => clearTimeout(timer);
// // 	}, [isUpdateSuccess, isUpdateError, updateError, reset]);

// // 	// Icon mapping
// // 	const getGenderIcon = (gender) => (gender === "Male" ? Mars : Venus);

// // 	const fields = [
// // 		{ key: "name", label: "Full Name", icon: UserRound, type: "text" },
// // 		{ key: "email", label: "Email Address", icon: AtSign, type: "email" },
// // 		{ key: "phoneNumber", label: "Phone Number", icon: Smartphone, type: "tel" },
// // 		{ key: "role", label: "Security Clearance", icon: Shield, type: "text" },
// // 		{ key: "gender", label: "Designated Gender", icon: getGenderIcon(gender), type: "select", options: ["Male", "Female", "Non-Binary"] },
// // 		{ key: "staffId", label: "Unit ID", icon: IdCard, type: "text" },
// // 		{ key: "specialization", label: "specialization", icon: AwardIcon, type: "text" },
// // 		{ key: "address", label: "Primary Location", icon: MapPin, type: "text" },
// // 	];

// // 	const handleChange = (e) => {
// // 		const { name, value } = e.target;
// // 		setEditData((prev) => ({ ...prev, [name]: value }));
// // 	};

// // 	const handleSave = () => {
// // 		if (!isSaving) {
// // 			updateProfile(editData);
// // 		}
// // 	};

// // 	const handleCancel = () => {
// // 		setEditData(authUser);
// // 		setIsEditing(false);
// // 	};

// // 	const handlePasswordChangeResult = (success) => {
// // 		if (success) {
// // 			setStatusMessage({ type: "success", text: "Password successfully updated. System access remains secure." });
// // 		} else {
// // 			setStatusMessage({ type: "error", text: "Password change failed. Check your current password." });
// // 		}
// // 		setTimeout(() => setStatusMessage(null), 5000);
// // 	};

// // 	// The main container and layout
// // 	return (
// // 		showModal && (
// // 			<>
// // 				{/* ================= BACKDROP ================= */}
// // 				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40' onClick={() => setIsOpen(false)} />
// // 				<div
// // 					className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] md:w-[520px]
// // 				bg-gray-800/95 backdrop-blur-xl
// // 				z-50 transform transition-transform duration-500 ease-in-out
// // 				${isOpen ? "translate-x-0" : "translate-x-full"}`}>
// // 					{/* Simulated Hamburger/Profile Toggle Button (Always visible - only UserRound icon) */}
// // 					<button
// // 						onClick={() => setIsOpen(!isOpen)}
// // 						className='fixed top-4 right-4 z-50 p-3 rounded-full bg-gray-800 text-teal-400 hover:bg-gray-700 shadow-xl shadow-teal-900/50 transition-all duration-300 cursor-pointer'
// // 						aria-label={isOpen ? "Close Profile Flyout" : "Open Profile Flyout"}>
// // 						<UserRound className='w-6 h-6' /> {/* Only UserRound is displayed */}
// // 					</button>
// // 					{/* Profile Flyout Container - Uses max-h for smooth, controlled expansion below the toggle icon */}
// // 					<div
// // 						className={`fixed right-4 z-999 transition-all duration-500 ease-in-out origin-top-right overflow-y-auto scrollbar-none
// //                 ${
// // 					isOpen
// // 						? "opacity-100 scale-100 max-h-[90vh] top-[4.5rem] w-full max-w-4xl md:max-w-4xl bg-transparent rounded-3xl shadow-[0_0_60px_rgba(40,220,250,0.7)]"
// // 						: "opacity-0 scale-90 max-h-0 top-[4.5rem] w-full max-w-0 pointer-events-none"
// // 				}`}>
// // 						{/* FIX: Added flex flex-col h-full here. This makes the content structure vertical
// //                     and allows the main content area to take up all available height.
// //                 */}
// // 						<div className='w-full h-full flex flex-col bg-gray-800/95 backdrop-blur-sm rounded-3xl border border-teal-700/30'>
// // 							{/* Header - Futuristic Banner (Teal Accent) - Fixed Height */}
// // 							<div className='relative p-6 sm:p-8 bg-gradient-to-r from-gray-900 to-teal-900/40 border-b border-teal-500/30 flex-shrink-0'>
// // 								<div className='flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6'>
// // 									{/* Avatar */}
// // 									<div className='relative w-28 h-28 flex-shrink-0'>
// // 										<ImageLoader image={croppedImageUrl || UserImage} callback={setCroppedImageUrl} size={"112px"} />
// // 										{/* Status Dot */}
// // 										<div className='absolute bottom-1 right-1 w-4 h-4 bg-lime-500 rounded-full border-2 border-gray-800 shadow-lg shadow-lime-500 animate-pulse'></div>
// // 									</div>

// // 									{/* Text Info */}
// // 									<div className='text-center sm:text-left'>
// // 										<h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-wider'>{name}</h1>
// // 										<p className='text-lg font-light text-teal-400 mt-1'>
// // 											{specialization} <span className='text-gray-500'> | </span> {staffId}
// // 										</p>
// // 									</div>
// // 								</div>

// // 								{/* Edit Button (Positioned relative to the card, not the window) */}
// // 								<button
// // 									onClick={() => {
// // 										setEditData(authUser);
// // 										setIsEditing(!isEditing);
// // 									}}
// // 									className={`absolute top-4 right-4 p-3 rounded-full text-white transition-all duration-300 focus:outline-none
// //                                 ${
// // 									isEditing
// // 										? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/50"
// // 										: "bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-500/50"
// // 								}`}
// // 									aria-label={isEditing ? "Close Editor" : "Open Editor"}>
// // 									{isEditing ? <X className='w-5 h-5' /> : <Pencil className='w-5 h-5' />}
// // 								</button>
// // 							</div>

// // 							{/* Status Message Display */}
// // 							{statusMessage && (
// // 								<div
// // 									className={`p-4 text-center text-sm font-semibold flex items-center justify-center space-x-2 transition-opacity duration-500 flex-shrink-0
// //                             ${
// // 								statusMessage.type === "success"
// // 									? "bg-green-700/50 text-green-200 border-b border-green-500"
// // 									: "bg-red-700/50 text-red-200 border-b border-red-500"
// // 							}`}>
// // 									{statusMessage.type === "success" ? <CheckCircle className='w-5 h-5' /> : <AlertTriangle className='w-5 h-5' />}
// // 									<span>{statusMessage.text}</span>
// // 								</div>
// // 							)}

// // 							{/* Main Content Area - Now uses flex-grow and overflow-y-auto to manage scrolling */}
// // 							<div className='p-4 sm:p-6 flex-grow overflow-y-auto'>
// // 								{isEditing ? (
// // 									/* Edit Form */
// // 									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
// // 										<h2 className='text-xl font-bold text-white mb-4 col-span-full border-b border-teal-500/50 pb-2'>
// // 											Data Matrix Configuration
// // 										</h2>
// // 										{fields.map((field) => (
// // 											<div key={field.key} className='relative group'>
// // 												<label
// // 													htmlFor={field.key}
// // 													className='text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1 block'>
// // 													{field.label}
// // 												</label>

// // 												{field.type === "select" ? (
// // 													<select
// // 														id={field.key}
// // 														name={field.key}
// // 														value={editData[field.key]}
// // 														onChange={handleChange}
// // 														className='w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono appearance-none transition duration-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500'>
// // 														{field.options.map((option) => (
// // 															<option key={option} value={option}>
// // 																{option}
// // 															</option>
// // 														))}
// // 													</select>
// // 												) : (
// // 													<input
// // 														type={field.type}
// // 														id={field.key}
// // 														name={field.key}
// // 														value={editData[field.key]}
// // 														onChange={handleChange}
// // 														className='w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono transition duration-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
// // 													/>
// // 												)}
// // 												<div className='absolute top-0 left-0 w-full h-full pointer-events-none border border-transparent rounded-lg group-focus-within:border-teal-500/50 group-focus-within:shadow-[0_0_10px_rgba(40,220,250,0.5)] transition-all duration-300'></div>
// // 											</div>
// // 										))}
// // 										<div className='col-span-full flex justify-end space-x-4 mt-4'>
// // 											<button
// // 												onClick={handleCancel}
// // 												className='flex items-center space-x-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 shadow-md shadow-gray-500/30'
// // 												disabled={isSaving}>
// // 												<X className='w-5 h-5' />
// // 												<span>Cancel</span>
// // 											</button>
// // 											<button
// // 												onClick={handleSave}
// // 												className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition duration-300 shadow-lg shadow-teal-500/50
// //                                             ${isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-500 text-white"}`}
// // 												disabled={isSaving}>
// // 												{isSaving ? (
// // 													<>
// // 														<Loader2 className='w-5 h-5 animate-spin' />
// // 														<span>Transmitting...</span>
// // 													</>
// // 												) : (
// // 													<>
// // 														<Save className='w-5 h-5' />
// // 														<span>Save Changes</span>
// // 													</>
// // 												)}
// // 											</button>
// // 										</div>
// // 									</div>
// // 								) : (
// // 									/* Read-only View */
// // 									<>
// // 										<div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2'>
// // 											{fields.map((field) => (
// // 												<ProfileField
// // 													key={field.key}
// // 													icon={field.key === "gender" ? getGenderIcon(gender) : field.icon}
// // 													label={field.label}
// // 													value={authUser[field.key]}
// // 												/>
// // 											))}
// // 										</div>
// // 										{/* Change Password Button */}
// // 										<div className='mt-6 pt-4 border-t border-gray-700/50 flex justify-center'>
// // 											<button
// // 												onClick={() => setIsPasswordModalOpen(true)}
// // 												className='flex items-center space-x-2 px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition duration-300 shadow-lg shadow-orange-500/50 text-sm font-semibold uppercase tracking-wider cursor-pointer'>
// // 												<KeyRound className='w-5 h-5' />
// // 												<span>Change Access Key</span>
// // 											</button>
// // 										</div>
// // 									</>
// // 								)}
// // 							</div>

// // 							{/* Footer - System Info - Now fixed-height, regular flow */}
// // 							<div className='p-4 sm:p-6 border-t border-teal-500/30 bg-gray-900/50 text-center flex-shrink-0'>
// // 								<p className='text-xs text-gray-500'>
// // 									ACCESS LEVEL: {roles} | STATUS: {staffType}
// // 								</p>
// // 							</div>
// // 						</div>
// // 					</div>
// // 					{/* Password Change Modal */}
// // 					{isPasswordModalOpen && (
// // 						<ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} onPasswordChange={handlePasswordChangeResult} />
// // 					)}
// // 				</div>
// // 			</>
// // 		)
// // 	);
// // };

// // export default Profile;

// import { useEffect, useState } from "react";
// import {
// 	AtSign,
// 	AwardIcon,
// 	IdCard,
// 	MapPin,
// 	Smartphone,
// 	UserRound,
// 	Shield,
// 	Venus,
// 	Mars,
// 	Pencil,
// 	Save,
// 	X,
// 	KeyRound,
// 	CheckCircle,
// 	AlertTriangle,
// } from "lucide-react";
// import ImageLoader from "./ImageLoader";
// import UserImage from "../../../../assets/user-image.jpg";
// import ChangePasswordModal from "./ChangePasswordModal";
// import { useDispatch, useSelector } from "react-redux";
// import { selectAuthUser } from "../../../../store/selectors/authSelectors";
// import { useUpdateAuthUserProfileMutation } from "../../../../store/api/authApi/authApi";
// import { useModal } from "../../../../providers";

// // Component to display a single field in read-only mode
// const ProfileField = ({ icon: Icon, label, value }) => (
// 	<div className='flex items-center p-3 sm:p-4 border-b border-gray-700/50 hover:bg-gray-800 transition duration-300'>
// 		<div className='flex-shrink-0 w-6 h-6 mr-4 text-teal-400'>
// 			<Icon className='w-full h-full' />
// 		</div>
// 		<div className='flex flex-col flex-grow'>
// 			<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>{label}</span>
// 			<span className='text-md text-white font-mono break-all'>{value}</span>
// 		</div>
// 	</div>
// );

// const Profile = () => {
// 	const dispatch = useDispatch();
// 	const authUser = useSelector(selectAuthUser);
// 	const { name, email, phoneNumber, roles, staffType, staffId, address, specialization, gender } = authUser;
// 	const { showModal } = useModal();

// 	// --------------------RTK Query--------------------
// 	const [updateProfile, { isLoading: isSaving, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError, reset }] =
// 		useUpdateAuthUserProfileMutation();

// 	const [editData, setEditData] = useState(authUser);
// 	const [isEditing, setIsEditing] = useState(false);
// 	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
// 	const [statusMessage, setStatusMessage] = useState(null);
// 	const [isOpen, setIsOpen] = useState(false);

// 	// Placeholder image URL
// 	// const userImageUrl = "https://placehold.co/128x128/1e293b/99f6e4?text=AV+";
// 	// NEW STATE FOR IMAGE HANDLING
// 	const [croppedImageUrl, setCroppedImageUrl] = useState(UserImage);

// 	useEffect(() => {
// 		setEditData(authUser);
// 	}, [authUser]);

// 	useEffect(() => {
// 		if (isUpdateSuccess) {
// 			setStatusMessage({ type: "success", text: "Profile successfully updated." });
// 			setIsEditing(false);
// 			reset();
// 		} else if (isUpdateError) {
// 			const errorMessage = updateError?.data?.message || updateError?.error || "Profile update failed. State reverted. Review data and retry.";
// 			setStatusMessage({ type: "error", text: errorMessage });
// 			reset();
// 		}

// 		const timer = setTimeout(() => setStatusMessage(null), 7000);
// 		return () => clearTimeout(timer);
// 	}, [isUpdateSuccess, isUpdateError, updateError, reset]);

// 	// Icon mapping
// 	const getGenderIcon = (gender) => (gender === "Male" ? Mars : Venus);

// 	const fields = [
// 		{ key: "name", label: "Full Name", icon: UserRound, type: "text" },
// 		{ key: "email", label: "Email Address", icon: AtSign, type: "email" },
// 		{ key: "phoneNumber", label: "Phone Number", icon: Smartphone, type: "tel" },
// 		{ key: "role", label: "Security Clearance", icon: Shield, type: "text" },
// 		{ key: "gender", label: "Designated Gender", icon: getGenderIcon(gender), type: "select", options: ["Male", "Female", "Non-Binary"] },
// 		{ key: "staffId", label: "Unit ID", icon: IdCard, type: "text" },
// 		{ key: "specialization", label: "specialization", icon: AwardIcon, type: "text" },
// 		{ key: "address", label: "Primary Location", icon: MapPin, type: "text" },
// 	];

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setEditData((prev) => ({ ...prev, [name]: value }));
// 	};

// 	const handleSave = () => {
// 		if (!isSaving) {
// 			updateProfile(editData);
// 		}
// 	};

// 	const handleCancel = () => {
// 		setEditData(authUser);
// 		setIsEditing(false);
// 	};

// 	const handlePasswordChangeResult = (success) => {
// 		if (success) {
// 			setStatusMessage({ type: "success", text: "Password successfully updated. System access remains secure." });
// 		} else {
// 			setStatusMessage({ type: "error", text: "Password change failed. Check your current password." });
// 		}
// 		setTimeout(() => setStatusMessage(null), 5000);
// 	};

// 	// The main container and layout
// 	return (
// 		showModal && (
// 			<>
// 				{/* ================= BACKDROP ================= */}
// 				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40' onClick={() => setIsOpen(false)} />
// 				<div
// 					className={`fixed top-0 right-300 max-h-screen w-full
// 				bg-gray-800/95 backdrop-blur-xl
// 				z-50 transform transition-transform duration-500 ease-in-out
// 				${isOpen ? "translate-x-0" : "translate-x-full"}`}>
// 					{/* Simulated Hamburger/Profile Toggle Button (Always visible - only UserRound icon) */}
// 					<button
// 						onClick={() => setIsOpen(!isOpen)}
// 						className='fixed top-4 right-4 z-50 p-3 rounded-full bg-gray-800 text-teal-400 hover:bg-gray-700 shadow-xl shadow-teal-900/50 transition-all duration-300 cursor-pointer'
// 						aria-label={isOpen ? "Close Profile Flyout" : "Open Profile Flyout"}>
// 						<UserRound className='w-6 h-6' /> {/* Only UserRound is displayed */}
// 					</button>
// 					{/* Profile Flyout Container - Uses max-h for smooth, controlled expansion below the toggle icon */}

// 					{/* FIX: Added flex flex-col h-full here. This makes the content structure vertical 
//                     and allows the main content area to take up all available height.
//                 */}
// 					<div className=' flex flex-col overflow-hidden border-l border-teal-500/30'>
// 						{/* Header - Futuristic Banner (Teal Accent) - Fixed Height */}
// 						<div className='relative p-6 bg-gradient-to-r from-gray-900 to-teal-900/40 border-b border-teal-500/30'>
// 							<div className='flex items-center space-x-6'>
// 								{/* Avatar */}
// 								<div className='relative w-28 h-28'>
// 									<ImageLoader image={croppedImageUrl || UserImage} callback={setCroppedImageUrl} size={"112px"} />
// 									{/* Status Dot */}
// 									<div className='absolute bottom-1 right-1 w-4 h-4 bg-lime-500 rounded-full border-2 border-gray-800 shadow-lg shadow-lime-500 animate-pulse'></div>
// 								</div>

// 								{/* Text Info */}
// 								<div>
// 									<h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-wider'>{name}</h1>
// 									<p className='text-lg font-light text-teal-400 mt-1'>
// 										{specialization} <span className='text-gray-500'> | </span> {staffId}
// 									</p>
// 								</div>
// 							</div>

// 							{/* Edit Button (Positioned relative to the card, not the window) */}
// 							<button
// 								onClick={() => {
// 									setEditData(authUser);
// 									setIsEditing(!isEditing);
// 								}}
// 								className={`absolute top-4 right-4 p-2 rounded-full
// 							${isEditing ? "bg-red-600" : "bg-teal-600"}
// 							text-white`}>
// 								{isEditing ? <X /> : <Pencil />}
// 							</button>
// 						</div>

// 						{/* Status Message Display */}
// 						{statusMessage && (
// 							<div
// 								className={`p-3 text-center text-sm font-semibold
// 							${statusMessage.type === "success" ? "bg-green-700/40 text-green-200" : "bg-red-700/40 text-red-200"}`}>
// 								{statusMessage.text}
// 							</div>
// 						)}

// 						{/* Main Content Area - Now uses flex-grow and overflow-y-auto to manage scrolling */}
// 						<div className='flex-1 overflow-y-auto p-6 scrollbar-none'>
// 							{isEditing ? (
// 								<div className='grid grid-cols-1 gap-4'>
// 									<h2 className='text-lg font-semibold text-teal-400 border-b border-teal-500/30 pb-2'>
// 										Data Matrix Configuration
// 									</h2>

// 									{fields.map((field) => (
// 										<ProfileField key={field.key} label={field.label} value={editData[field.key]} />
// 									))}
// 								</div>
// 							) : (
// 								<div className='grid grid-cols-1 gap-3'>
// 									{fields.map((field) => (
// 										<ProfileField key={field.key} icon={field.icon} label={field.label} value={authUser[field.key]} />
// 									))}
// 								</div>
// 							)}
// 						</div>

// 						{/* Footer - System Info - Now fixed-height, regular flow */}
// 						<div className='p-4 sm:p-6 border-t border-teal-500/30 bg-gray-900/50 text-center flex-shrink-0'>
// 							<p className='text-xs text-gray-500'>
// 								ACCESS LEVEL: {roles} | STATUS: {staffType}
// 							</p>
// 						</div>
// 					</div>
// 					{/* Password Change Modal */}
// 					{isPasswordModalOpen && (
// 						<ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} onPasswordChange={handlePasswordChangeResult} />
// 					)}
// 				</div>
// 			</>
// 		)
// 	);
// };

// export default Profile;
