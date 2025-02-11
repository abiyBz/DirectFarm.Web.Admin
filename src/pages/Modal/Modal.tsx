import React from 'react';

interface ModalProps {
  url: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4">Payment Page</h2>
        <iframe src={url} title="Payment" className="w-full h-[400px] border-none"></iframe>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
