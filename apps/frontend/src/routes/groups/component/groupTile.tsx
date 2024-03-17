import { ReactNode } from 'react';
import { GiPadlock } from 'react-icons/gi';

interface Props {
  name: string;
  isPrivate: boolean;
  onClick: () => void;
}

export const GroupTile = ({ onClick, isPrivate, name, ...props }: Props): ReactNode => {
  const onPadlockClick = () => {
    console.log('padlock clicked');
    // Request access to group
  };

  return (
    <div className="flex flex-1 p-4 justify-center items-center border border-solid rounded-sm border-spacing-2 border-blue-300/75" {...props}>
      <div className="flex flex-col min-w-36 cursor-pointer" onClick={onClick}>
        <h2 className='text-lg font-bold'>{name}</h2>
        {isPrivate ? <p>Private group</p> : <p>Public group</p>}
      </div>
      {isPrivate ? (
        <GiPadlock
          className="cursor-pointer text-xl"
          onClick={onPadlockClick}
        />
      ) : (
        <p className='text-xl w-[1em]'>&nbsp;</p>
      )}
    </div>
  );
};
