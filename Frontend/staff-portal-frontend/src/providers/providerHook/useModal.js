import { useContext } from "react";
import ModalContext from "../ModalProvider";

export const useModal = () => {
	const context = useContext(ModalContext);
	if (context === null) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
};
