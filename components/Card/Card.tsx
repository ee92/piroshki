import { FC, ReactNode } from "react";
interface ICardProps {
  children: ReactNode | ReactNode[];
}

const Card: FC<ICardProps> = (props) => {
  return (
    <div className="w-full rounded-2xl bg-gray-500 p-4">{props.children}</div>
  );
};

export default Card;
