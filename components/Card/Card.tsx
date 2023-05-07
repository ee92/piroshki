import { FC, ReactNode } from "react";
interface ICardProps {
  children: ReactNode | ReactNode[];
}

const Card: FC<ICardProps> = (props) => {
  return (
    <div className="w-full rounded-2xl p-8 border-2 border-black h-full">{props.children}</div>
  );
};

export default Card;
