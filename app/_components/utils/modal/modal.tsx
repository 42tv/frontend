'use client';
import { MdClose } from "react-icons/md";
import useModalStore from "../store/modalStore";
import { OverlayProvider, OverlayControllerComponent } from 'overlay-kit';

const OverlayModalController: OverlayControllerComponent = ({ isOpen, close }) => {
    const { content } = useModalStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="rounded-lg shadow-lg relative">
                {/* X 버튼 */}
                <button
                    className="absolute w-[25px] h-[25px] top-2 right-2 flex justify-center items-center cursor-pointer z-20"
                    onClick={close}
                >
                    <MdClose className="w-full h-full" />
                </button>
                {content}
            </div>
        </div>
    );
};

const Modal = () => {
    const { isOpen, closeModal } = useModalStore();

    if (!isOpen) return null;

    return (
        <OverlayProvider>
            <OverlayModalController isOpen={isOpen} close={closeModal} overlayId="modal" unmount={() => {}} />
        </OverlayProvider>
    );
};

export default Modal;
