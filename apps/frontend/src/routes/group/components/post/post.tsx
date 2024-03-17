import { ReactElement } from 'react';

export interface Props {
  data: {
    content: string;
    createdAt: string;
    groupId: string;
    id: string;
    userId: string;
  };
}

export const Post = ({ data }: Props): ReactElement => {
  return (
    <div key={data.id}>
      <h2 key={`${data.id}-content`}>{data.content}</h2>
      <p key={`${data.id}-createdAt`}>{data.createdAt}</p>
    </div>
  );
};
