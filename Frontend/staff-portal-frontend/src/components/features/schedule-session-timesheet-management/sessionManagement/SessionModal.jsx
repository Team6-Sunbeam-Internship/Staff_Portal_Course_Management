import React, { useState, useEffect } from "react";

export default function SessionModal({
	show,
	onHide,
	onSave,
	availableStaff,
	existingMeetingIds,
	//   batchCycles,
	//   courses,
	initialData,
	selectedBatchCycleName,
	selectedCourseName,
}) {
	const [formData, setFormData] = useState({
		batchCycleName: selectedBatchCycleName || "",
		courseName: selectedCourseName || "",
		sessionDate: "",
		startTime: "",
		endTime: "",
		title: "",
		meetingId: "",
		meetingCredentials: "",
		staffName: "",
		status: "SCHEDULED",
		description: "",
		codeShareToken: "",
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
		} else {
			setFormData({
				batchCycleName: selectedBatchCycleName || "",
				courseName: selectedCourseName || "",
				sessionDate: "",
				startTime: "",
				endTime: "",
				title: "",
				meetingId: "",
				meetingCredentials: "",
				staffName: "",
				status: "SCHEDULED",
				description: "",
				codeShareToken: "",
			});
		}
	}, [initialData, selectedBatchCycleName, selectedCourseName]);

	const handleChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const validate = () => {
		let newErrors = {};
		Object.keys(formData).forEach((field) => {
			if (!formData[field]) {
				newErrors[field] = "This field is required";
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (validate()) {
			onSave(formData);
		}
	};

	if (!show) return null;

	//   const filteredCourses = courses.filter(
	//     (c) => c.cycleName === formData.batchCycleName
	//   );

	return (
		<div className='modal d-block' tabIndex='-1'>
			<div className='modal-dialog modal-lg'>
				<div className='modal-content'>
					<div className='modal-header py-2'>
						<h6 className='modal-title mb-0'>{initialData ? "Edit Session" : "Add Session"}</h6>
						<button type='button' className='btn-close' onClick={onHide}></button>
					</div>

					<div className='modal-body py-2'>
						<div className='row g-2'>
							{/* Batch Cycle Name */}

							<div className='col-md-6'>
								<label className='form-label'>Batch Cycle</label>
								<input type='text' className='form-control' value={formData.batchCycleName} readOnly />
							</div>

							{/* Course */}
							<div className='col-md-6'>
								<label className='form-label'>Course</label>
								<input type='text' className='form-control' value={formData.courseName} readOnly />
							</div>
							{/* Date */}
							<div className='col-md-4'>
								<label className='form-label'>Date</label>
								<input
									type='date'
									className={`form-control form-control-sm ${errors.sessionDate ? "is-invalid" : ""}`}
									value={formData.sessionDate}
									onChange={(e) => handleChange("sessionDate", e.target.value)}
								/>
								<div className='invalid-feedback'>{errors.sessionDate}</div>
							</div>

							{/* Start Time */}
							<div className='col-md-4'>
								<label className='form-label'>Start Time</label>
								<input
									type='time'
									className={`form-control form-control-sm ${errors.startTime ? "is-invalid" : ""}`}
									value={formData.startTime}
									onChange={(e) => handleChange("startTime", e.target.value)}
								/>
								<div className='invalid-feedback'>{errors.startTime}</div>
							</div>

							{/* End Time */}
							<div className='col-md-4'>
								<label className='form-label'>End Time</label>
								<input
									type='time'
									className={`form-control form-control-sm ${errors.endTime ? "is-invalid" : ""}`}
									value={formData.endTime}
									onChange={(e) => handleChange("endTime", e.target.value)}
								/>
								<div className='invalid-feedback'>{errors.endTime}</div>
							</div>

							{/* Title */}
							<div className='col-md-6'>
								<label className='form-label'>Title</label>
								<input
									type='text'
									className={`form-control form-control-sm ${errors.title ? "is-invalid" : ""}`}
									value={formData.title}
									onChange={(e) => handleChange("title", e.target.value)}
								/>
								<div className='invalid-feedback'>{errors.title}</div>
							</div>

							{/* Meeting ID */}
							<div className='col-md-6'>
								<label className='form-label'>Meeting ID</label>
								<input
									type='text'
									className={`form-control form-control-sm ${errors.meetingId ? "is-invalid" : ""}`}
									value={formData.meetingId}
									onChange={(e) => handleChange("meetingId", e.target.value)}
									list='meetingIdOptions'
									placeholder='Select or enter meeting ID'
								/>
								<datalist id='meetingIdOptions'>
									{existingMeetingIds.map((id, index) => (
										<option key={index} value={id} />
									))}
								</datalist>
								<div className='invalid-feedback'>{errors.meetingId}</div>
							</div>

							{/* Credentials */}
							<div className='col-md-6'>
								<label className='form-label'>Credentials</label>
								<input
									type='text'
									className={`form-control form-control-sm ${errors.meetingCredentials ? "is-invalid" : ""}`}
									value={formData.meetingCredentials}
									onChange={(e) => handleChange("meetingCredentials", e.target.value)}
								/>
								<div className='invalid-feedback'>{errors.meetingCredentials}</div>
							</div>

							{/* Staff */}
							<div className='col-md-6'>
								<label className='form-label'>Staff</label>
								<select
									className={`form-select form-select-sm ${errors.staffName ? "is-invalid" : ""}`}
									value={formData.staffName}
									onChange={(e) => handleChange("staffName", e.target.value)}>
									<option value=''>Select Staff</option>
									{availableStaff.map((s) => (
										<option key={s.staffId} value={`${s.firstName}${s.lastName}`}>
											{`${s.firstName}${s.lastName}`}
										</option>
									))}
								</select>
								<div className='invalid-feedback'>{errors.staffName}</div>
							</div>

							{/* Status */}
							<div className='col-md-6'>
								<label className='form-label'>Status</label>
								<select
									className={`form-select form-select-sm ${errors.status ? "is-invalid" : ""}`}
									value={formData.status}
									onChange={(e) => handleChange("status", e.target.value)}>
									<option value='SCHEDULED'>Scheduled</option>
									<option value='IN_PROGRESS'>In Progress</option>
									<option value='COMPLETED'>Completed</option>
									<option value='CANCELLED'>Cancelled</option>
								</select>
								<div className='invalid-feedback'>{errors.status}</div>
							</div>

							{/* Description */}
							<div className='col-md-12'>
								<label className='form-label'>Description</label>
								<textarea
									className={`form-control form-control-sm ${errors.description ? "is-invalid" : ""}`}
									rows='1'
									value={formData.description}
									onChange={(e) => handleChange("description", e.target.value)}
								/>
								<div className='invalid-feedback'>{errors.description}</div>
							</div>

							{/* CodeShare Token */}
							<div className='col-md-6'>
								<label className='form-label'>CodeShare Token</label>
								<input
									type='text'
									className={`form-control form-control-sm ${errors.codeShareToken ? "is-invalid" : ""}`}
									value={formData.codeShareToken}
									onChange={(e) => handleChange("codeShareToken", e.target.value)}
								/>
								<div className='invalid-feedback'>{errors.codeShareToken}</div>
							</div>
						</div>
					</div>

					<div className='modal-footer py-2'>
						<button className='btn btn-secondary btn-sm' onClick={onHide}>
							Cancel
						</button>
						<button className='btn btn-success btn-sm' onClick={handleSave}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
