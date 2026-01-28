import { createContext, useCallback, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
	const [showModal, setShowModal] = useState({
		open: false,
		entity: null, // Module | Subject | Section | Topic
		mode: null, // CREATE | EDIT
		payload: null, // editing data
	});
	
	const openModal = useCallback((entity, mode = "CREATE", payload = null) => {
		setShowModal({ open: true, entity, mode, payload });
	},[])
	const closeModal = useCallback(() => {
		setShowModal({ open: false, entity: null, mode: null, payload: null });
	},[])
	
	const value = { showModal, openModal, closeModal };
	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
};

export default ModalContext;
