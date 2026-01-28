import { useRef } from "react";
import { Modal } from "./Modal";
import { ModalHeader } from "./ModalHeader";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { Button } from "../buttons";
import { Plus, X } from "lucide-react";

export const ModalForm = ({ isOpen, onClose, title, description, children, loading, saveButtonName="Save"}) => {
	const formRef = useRef(null);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg'>
			<ModalHeader title={title} description={description} onClose={onClose} />

			<ModalBody>{children(formRef)}</ModalBody>

			<ModalFooter>
				<Button icon={X} variant='gradientRose' onClick={onClose}>
					Cancel
				</Button>
				<Button icon={Plus} variant='gradientEmerald' onClick={() => formRef.current?.submit()} disabled={loading}>
					{loading ? "Saving..." : `${saveButtonName}`}
				</Button>
			</ModalFooter>
		</Modal>
	);
};
