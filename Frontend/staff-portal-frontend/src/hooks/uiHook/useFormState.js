import { useCallback, useRef, useState } from "react";
import { getByPath, setByPath } from "../../utils/objectPath";

export const useFormState = ({ initialValues, validate, onSubmit }) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const initialRef = useRef(initialValues);

	// const setField = (field, value) => {
	// 	setValues((prev) => ({ ...prev, [field]: value }));
	// 	if (errors[field]) {
	// 		setErrors((prev) => ({ ...prev, [field]: undefined }));
	// 	}
	// };
	const setField = useCallback((path, value) => {
		setValues((prev) => setByPath(prev, path, value));

		if (getByPath(errors, path)) {
			setErrors((prev) => setByPath(prev, path, undefined));
		}
	}, []);
	const setAll = useCallback((newValues) => {
		const base = newValues || initialRef.current;
		initialRef.current = base;
		setValues(base);
		setErrors({});
	}, []);

	const validateAll = useCallback(
		(vals = values) => {
			const validationErrors = validate ? validate(vals) : {};
			setErrors(validationErrors || {});
			return Object.keys(validationErrors || {}).length === 0;
		},
		[values, validate]
	);

	const submit = useCallback(async () => {
		if (!validateAll(values)) return false;
		await onSubmit(values);
		return true;
	}, [values, validateAll, onSubmit]);

	const reset = useCallback(() => {
		setValues(initialRef.current);
		setErrors({});
	}, []);

	// const isDirty = () => {
	// 	for (const key in values) {
	// 		if (values[key] !== initialRef.current[key]) return true;
	// 	}
	// 	return false;
	// };
	const isDirty = useCallback(() => {
		const check = (a, b) => {
			if (typeof a !== "object" || a === null) {
				return a !== b;
			}
			return Object.keys(a).some((key) => check(a[key], b?.[key]));
		};

		return check(values, initialRef.current);
	}, [values]);

	return {
		values,
		errors,
		setField,
		setAll,
		submit,
		reset,
		isDirty,
		setValues,
	};
};
