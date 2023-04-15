import { Dialog as ReactDialog } from "@headlessui/react";

function Dialog(props: any) {
  const { open, onClose, title, render } = props;
  return (
    <ReactDialog open={open} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
        <ReactDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-300 p-6 text-left align-middle shadow-xl transition-all">
          <ReactDialog.Title>{title}</ReactDialog.Title>
          {render()}
        </ReactDialog.Panel>
      </div>
    </ReactDialog>
  );
}

export default Dialog;
