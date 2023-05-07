import { Dialog as ReactDialog } from "@headlessui/react";

function Dialog(props: any) {
  const { open, onClose, title, render } = props;
  return (
    <ReactDialog open={open} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
        <ReactDialog.Panel className="max-w-md mx-auto overflow-hidden rounded-2xl bg-zinc-50 px-12 py-6 align-middle shadow-xl">
          <div className="border-b border-slate-400 pb-2 mb-6">
            <ReactDialog.Title className="font-semibold text-xl">{title}</ReactDialog.Title>
          </div>
          {render()}
        </ReactDialog.Panel>
      </div>
    </ReactDialog>
  );
}

export default Dialog;
