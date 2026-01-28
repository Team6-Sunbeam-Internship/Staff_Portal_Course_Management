import { AtSign, MapPinHouse, Smartphone, User, VenusAndMars } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { useGetAllCourseTypesQuery, useGetUniqueCourseNamesQuery } from "../../../../store";
import { CustomSelect, Input } from "../../../layout";

export const StaffForm = forwardRef(({ staff, onSubmit, isLoading = false, staffRoleOptions, staffTypeOptions }, ref) => {
	const isEditing = !!staff;

	const [filters, setFilters] = useState({
		courseTypeId: "",
		courseName: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const { data: courseTypes, isLoading: isLoadingCourseTypes, isError: isErrorCourseTypes } = useGetAllCourseTypesQuery();
	const { data: uniqueCourseNames, isLoading: isLoadingUniqueCourseNames, isError: isErrorUniqueCourseNames } = useGetUniqueCourseNamesQuery();

	const courseTypeOptions = useMemo(() => {
		if (isLoadingCourseTypes || isErrorCourseTypes) return [{ value: "", label: "Select Course Type" }];
		const mapped = courseTypes.map((courseType) => ({
			label: courseType.title,
			value: courseType.id,
		}));
		return [{ value: "", label: "Select Course Type" }, ...mapped];
	}, [isLoadingCourseTypes, isErrorCourseTypes, courseTypes]);

	const courseNameOptions = useMemo(() => {
		if (!filters.courseTypeId) return [{ value: "", label: "Select Course Name" }];
		if (isLoadingUniqueCourseNames || isErrorUniqueCourseNames) return [{ value: "", label: "Select Course Name" }];

		const mapped =
			uniqueCourseNames[filters.courseTypeId]?.map((courseName) => ({
				label: courseName,
				value: courseName,
			})) || [];

		return [{ value: "", label: "Select Course Name" }, { value: "MULTIPLE", label: "Multiple Courses" }, ...mapped];
	}, [isLoadingUniqueCourseNames, isErrorUniqueCourseNames, uniqueCourseNames, filters.courseTypeId]);

	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			gender: "",
			phoneNumber: "",
			courseSpecialization: "",
			staffType: "",
			role: "",
			address: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.firstName?.trim()) errs.firstName = "First name is required";
			if (!vals.lastName?.trim()) errs.lastName = "Last name is required";
			if (!vals.email?.trim()) errs.email = "Email is required";
			if (!vals.gender?.trim()) errs.gender = "Gender is required";
			if (!vals.phoneNumber?.trim()) errs.phoneNumber = "Phone number is required";
			if (!vals.courseSpecialization?.trim()) errs.courseSpecialization = "Course specialization is required";
			if (!vals.staffType) errs.staffType = "Staff type is required";
			if (!vals.role) errs.role = "Staff role is required";
			if (!vals.address?.trim()) errs.address = "Address is required";
			return errs;
		},
		onSubmit: (vals) => {
			if (isEditing) {
				onSubmit({
					id: staff.staffId,
					payload: vals,
				});
			} else {
				onSubmit({
					payload: vals,
				});
			}
		},
	});

	useEffect(() => {
		if (isEditing && staff) {
			setAll({
				firstName: staff.firstName || "",
				lastName: staff.lastName || "",
				email: staff.email || "",
				phoneNumber: staff.phoneNumber || "",
				courseSpecialization: staff.courseSpecialization || "",
				staffType: staff.staffType || "",
				role: staff.role || "",
				address: staff.address || "",
			});
			// Also set filters for course type and name if available
			// This would require additional logic to extract courseTypeId from courseSpecialization
		}
	}, [isEditing, staff]);

	// Update courseSpecialization when courseName changes
	useEffect(() => {
		if (filters.courseName) {
			setField("courseSpecialization", filters.courseName.toUpperCase());
		}
	}, [filters.courseName]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));
	
	const genderOptions = [
		{ value: "", label: "Select Gender" },
		{ value: "MALE", label: "Male" },
		{ value: "FEMALE", label: "Female" },
		{ value: "OTHER", label: "Other" },
	];
	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					type='text'
					label='First Name'
					icon={User}
					value={values.firstName}
					onChange={(e) => setField("firstName", e.target.value)}
					error={errors.firstName}
					disabled={isLoading}
				/>
				<Input
					type='text'
					label='Last Name'
					icon={User}
					value={values.lastName}
					onChange={(e) => setField("lastName", e.target.value)}
					error={errors.lastName}
					disabled={isLoading}
				/>
				<Input
					type='email'
					label='Email'
					icon={AtSign}
					value={values.email}
					onChange={(e) => setField("email", e.target.value)}
					error={errors.email}
					disabled={isLoading}
				/>
				<CustomSelect
					label='Gender'
					value={values.gender}
					options={genderOptions}
					onChange={(e) => setField("gender", e.target.value)}
					disabled={isLoading}
				/>
				<Input
					type='number'
					label='Phone Number'
					icon={Smartphone}
					value={values.phoneNumber}
					onChange={(e) => setField("phoneNumber", e.target.value)}
					error={errors.phoneNumber}
					disabled={isLoading}
				/>
				<Input
					type='text'
					label='Address'
					icon={MapPinHouse}
					value={values.address}
					onChange={(e) => setField("address", e.target.value)}
					error={errors.address}
					disabled={isLoading}
				/>
				<CustomSelect
					label='Course Type'
					value={filters.courseTypeId}
					options={courseTypeOptions}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					isLoading={isLoadingCourseTypes}
					disabled={isLoading}
				/>
				<CustomSelect
					label='Course Name'
					value={filters.courseName}
					options={courseNameOptions}
					onChange={(e) => handleFilterChange("courseName", e.target.value)}
					isLoading={isLoadingUniqueCourseNames}
					disabled={!filters.courseTypeId || isLoading}
					error={errors.courseSpecialization}
				/>
				<CustomSelect
					label='Staff Type'
					value={values.staffType}
					options={staffTypeOptions}
					onChange={(e) => setField("staffType", e.target.value)}
					error={errors.staffType}
					disabled={isLoading}
				/>
				<CustomSelect
					label='Staff Role'
					value={values.role}
					options={staffRoleOptions}
					onChange={(e) => setField("role", e.target.value)}
					error={errors.role}
					disabled={isLoading}
				/>
			</div>
		</div>
	);
});

export default StaffForm;
