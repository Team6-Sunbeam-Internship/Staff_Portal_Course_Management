import { createContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
	const [showModal, setShowModal] = useState(false);
	const value = { showModal, setShowModal };
	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
};

export default ModalContext;
