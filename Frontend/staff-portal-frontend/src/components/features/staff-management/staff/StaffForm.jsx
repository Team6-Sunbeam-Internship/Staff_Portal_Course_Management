import React, { useEffect, useMemo, useState } from "react";
import { useGetAllCourseTypesQuery, useGetUniqueCourseNamesQuery } from "../../../../store";
import { CustomSelect, FormField, Input } from "../../../layout";

export const StaffForm = ({ staff, onSubmit, onCancel, isLoading = false, staffRoleOptions, staffTypeOptions }) => {
	const [filters, setFilters] = useState({
		courseTypeId: "",
		courseName: "",
		staffRole: "",
		staffType: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const { data: courseTypes, isLoading: isLoadingCourseTypes, isError: isErrorCourseTypes, error: errorCourseTypes } = useGetAllCourseTypesQuery();
	const {
		data: uniqueCourseNames,
		isLoading: isLoadingUniqueCourseNames,
		isError: isErrorUniqueCourseNames,
		error: errorUniqueCourseNames,
	} = useGetUniqueCourseNamesQuery(); // [{courseTypeId1: {coursename1, coursenam2, courseName3}}, {courseTypeId2: {coursename1, coursenam2, courseName3}}]

	const courseTypeOptions = useMemo(() => {
		if (isLoadingCourseTypes || isErrorCourseTypes) return [];
		return courseTypes.map((courseType) => ({
			label: courseType.name,
			value: courseType.id,
		}));
	}, [isLoadingCourseTypes, isErrorCourseTypes, courseTypes]);
	const courseNameOptions = useMemo(() => {
		if (!filters.courseTypeId) return [];
		if (isLoadingUniqueCourseNames || isErrorUniqueCourseNames) return [];
		return uniqueCourseNames[filters.courseTypeId]?.map((courseName) => ({
			label: courseName,
			value: courseName,
		}));
	}, [isLoadingUniqueCourseNames, isErrorUniqueCourseNames, uniqueCourseNames, filters.courseTypeId]);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		courseSpecialization: "", // multiple or courseName
		staffType: "",
		staffRole: "",
		address: "",
	});

	useEffect(() => {
		if (staff) {
			setFormData({
				firstName: staff.firstName || "",
				lastName: staff.lastName || "",
				email: staff.email || "",
				phoneNumber: staff.phone || "",
				courseSpecialization: staff.courseSpecialization || "", // multiple or courseName
				staffType: staff.staffType || "",
				staffRole: staff.staffRole || "",
				address: staff.address || "",
			});
		}
	}, [staff]);

	const [errors, setErros] = useState({});

	const validateForm = () => {
		if (!formData.firstName) errors.firstName = "First name is required";
		if (!formData.lastName) errors.lastName = "Last name is required";
		if (!formData.email) errors.email = "Email is required";
		if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";
		if (!formData.courseSpecialization) errors.courseSpecialization = "Course specialization is required";
		if (!formData.staffType) errors.staffType = "Staff type is required";
		if (!formData.staffRole) errors.staffRole = "Staff role is required";
		if (!formData.address) errors.address = "Address is required";
		setErros(errors);
		return Object.keys(errors).length === 0;
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit({
				...formData,
				courseSpecialization: filters.courseName,
				staffType: formData.staffType,
				staffRole: formData.staffRole,
			});
		}
	};

	return (
		<>
			<form onSubmit={handleFormSubmit} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField>
						<Input
							type='text'
							label='First Name'
							value={formData.firstName}
							onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
							error={errors.firstName}
						/>
					</FormField>
					<FormField>
						<Input
							type='text'
							label='Last Name'
							value={formData.lastName}
							onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
							error={errors.lastName}
						/>
					</FormField>
					<FormField>
						<Input
							type='email'
							label='Email'
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							error={errors.email}
						/>
					</FormField>
					<FormField>
						<Input
							type='number'
							label='Phone Number'
							value={formData.phoneNumber}
							onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
							error={errors.phoneNumber}
						/>
					</FormField>
					<FormField>
						<Input
							type='text'
							label='Address'
							value={formData.address}
							onChange={(e) => setFormData({ ...formData, address: e.target.value })}
							error={errors.address}
						/>
					</FormField>
					<FormField>
						<CustomSelect
							label='Course Type'
							value={filters.courseTypeId}
							options={courseTypeOptions}
							onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
							isLoading={isLoadingCourseTypes}
						/>
					</FormField>
					<FormField>
						<CustomSelect
							label='Course Name'
							value={filters.courseName}
							options={courseNameOptions}
							onChange={(e) => handleFilterChange("courseName", e.target.value)}
							isLoading={isLoadingUniqueCourseNames}
							disabled={!filters.courseTypeId}
						/>
					</FormField>

					<FormField>
						<CustomSelect
							label='Staff Type'
							value={formData.staffType}
							options={staffTypeOptions}
							onChange={(e) => handleFilterChange("staffType", e.target.value)}
						/>
					</FormField>
					<FormField>
						<CustomSelect
							label='Staff Role'
							value={formData.staffRole}
							options={staffRoleOptions}
							onChange={(e) => handleFilterChange("staffRole", e.target.value)}
						/>
					</FormField>
				</div>
				<div className='flex items-center justify-end space-x-3 pt-4'>
					<Button type='button' variant='danger' onClick={onCancel} disabled={isLoading}>
						Cancel
					</Button>
					<Button variant='secondary' type='submit' disabled={isLoading}>
						{isLoading ? "Saving..." : "Save"}
					</Button>
				</div>
			</form>
		</>
	);
};

export default StaffForm;
