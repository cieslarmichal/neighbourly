import { ReactElement } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

interface Props {
  onClick: () => void;
  passwordType: 'password' | 'text';
}

export const PasswordEyeIcon = ({ onClick, passwordType }: Props): ReactElement => {
  return (
    <div onClick={onClick}>
      {passwordType === 'password' ? (
        <IoMdEyeOff className="text-primary opacity-65 text-3xl pointer-events-auto" />
      ) : (
        <IoMdEye className="text-primary opacity-65 text-3xl pointer-events-auto" />
      )}
    </div>
  );
};
