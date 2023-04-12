import { useState } from "react";
import Dialog from "../Dialog";
import styles from './DialogButton.module.css';

interface DialogButtonProps {
  title: string,
  component: React.FC
}

function DialogButton(props: DialogButtonProps) {
  const { title, component } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="bg-emerald-400 hover:bg-emerald-500 text-black font-bold py-2 px-4 rounded"
        onClick={() => setOpen(true)}
      >
        {title}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        render={component}
      />
    </>
  )
}

export default DialogButton;