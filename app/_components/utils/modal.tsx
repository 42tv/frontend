import useModalStore from "./modalStore";

const Modal = () => {
    const { isOpen, content, closeModal } = useModalStore();

    if (!isOpen) return null; // Do not render if the modal is closed

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal} // Close modal on background click
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing when content is clicked
            >
                {content}
            </div>
        </div>
    );
};

export default Modal;
