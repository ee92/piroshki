import { useState } from "react";
import Dialog from "../Dialog";
import styles from "./DialogButton.module.css";

interface DialogButtonProps {
  title: string;
  component: React.FC;
}

function DialogButton(props: DialogButtonProps) {
  const { title, component } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="rounded px-4 py-2 font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 hover:from-purple-500 hover:to-pink-600"
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
  );
}

export default DialogButton;
