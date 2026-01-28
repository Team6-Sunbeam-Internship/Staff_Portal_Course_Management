import { AlertTriangle, KeyRound, Save, X } from "lucide-react";
import { useState } from "react";

const ChangePasswordModal = ({ onClose, onPasswordChange }) => {
	const [passwords, setPasswords] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setPasswords({ ...passwords, [e.target.name]: e.target.value });
		setError(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError(null);

		if (passwords.newPassword.length < 8) {
			setError("New password must be at least 8 characters long.");
			return;
		}

		if (passwords.newPassword !== passwords.confirmPassword) {
			setError("New password and confirmation do not match.");
			return;
		}

		// Placeholder for API call: Check current password for demonstration
		setTimeout(() => {
			if (passwords.currentPassword === "correct-password-placeholder") {
				onPasswordChange(true); // Simulate success
				onClose();
			} else {
				setError("Invalid current password provided.");
				onPasswordChange(false); // Simulate failure
			}
		}, 500);
	};

	return (
		// Fixed overlay for the modal
		<div className='fixed inset-0 bg-black/79 z-[60] flex items-center justify-center p-4' on>
			<div className='w-full max-w-md bg-gray-900 border border-orange-600/50 rounded-xl p-6 shadow-2xl shadow-orange-900/70 relative'>
				<h3 className='text-2xl font-bold text-white mb-4 flex items-center space-x-2 border-b border-orange-500/50 pb-2'>
					<KeyRound className='w-6 h-6 text-orange-400' />
					<span>Authorize Access Change</span>
				</h3>

				<button onClick={onClose} className='absolute top-4 right-4 text-gray-400 hover:text-red-500 transition' aria-label='Close'>
					<X className='w-6 h-6' />
				</button>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* Current Password */}
					<div>
						<label htmlFor='currentPassword' className='text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1 block'>
							Current Password
						</label>
						<input
							type='password'
							id='currentPassword'
							name='currentPassword'
							value={passwords.currentPassword}
							onChange={handleChange}
							required
							className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
						/>
					</div>

					{/* New Password */}
					<div>
						<label htmlFor='newPassword' className='text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1 block'>
							New Password (min 8 chars)
						</label>
						<input
							type='password'
							id='newPassword'
							name='newPassword'
							value={passwords.newPassword}
							onChange={handleChange}
							required
							className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
						/>
					</div>

					{/* Confirm Password */}
					<div>
						<label htmlFor='confirmPassword' className='text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1 block'>
							Confirm New Password
						</label>
						<input
							type='password'
							id='confirmPassword'
							name='confirmPassword'
							value={passwords.confirmPassword}
							onChange={handleChange}
							required
							className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
						/>
					</div>

					{/* Error Message */}
					{error && (
						<div className='flex items-center space-x-2 text-red-400 bg-red-900/20 p-2 rounded-lg border border-red-500/50'>
							<AlertTriangle className='w-5 h-5 flex-shrink-0' />
							<p className='text-sm'>{error}</p>
						</div>
					)}

					<div className='pt-2'>
						<button
							type='submit'
							className='w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 transition duration-300 shadow-lg shadow-orange-500/50 cursor-pointer'>
							<Save className='w-5 h-5' />
							<span>Confirm Change</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChangePasswordModal;
