import { FC, ReactNode } from "react";
interface ICardProps {
  children: ReactNode | ReactNode[]
};

const Card: FC<ICardProps> = (props) => {
  return (
    <div className="w-full p-4 bg-gray-500 rounded-2xl">
      {props.children}
    </div>
  );
}

export default Card