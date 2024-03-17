/* eslint-disable react-refresh/only-export-components */
import { createRoute } from '@tanstack/react-router';
import { ReactElement } from 'react';
import { RequireAuthComponent } from '../../core/components/requireAuth/requireAuthComponent';
import { groupsRoute } from '../groups/groups';
import { AuthenticatedLayout } from '../../layouts/authenticated/authenticatedLayout';
import { useFindPostsQuery } from '../../api/posts/queries/findPosts/findPostsQuery';
import { FindPostsResponseBody } from '@common/contracts';
import { Post } from './components/post/post';

export const Group = (): ReactElement => {
  const params = groupRoute.useParams();

  useFindPostsQuery({
    groupId: params.groupId,
  });

  const dummyPosts: FindPostsResponseBody = {
    data: [
      {
        content: 'Hello, world!',
        createdAt: new Date().toISOString(),
        groupId: '1',
        id: '1',
        userId: '1',
      },
      {
        content: 'OOO WAA AA AAA AA',
        createdAt: new Date().toISOString(),
        groupId: '1',
        id: '2',
        userId: '1',
      },
      {
        content: 'Hello from the other side!',
        createdAt: new Date().toISOString(),
        groupId: '1',
        id: '3',
        userId: '1',
      },
    ],
  };

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col items-center  gap-8 justify-center">
        <h1>Group</h1>
        <div className="flex flex-col gap-4">
          {dummyPosts?.data?.map((post) => {
            return <Post data={post}/>;
          })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export const groupRoute = createRoute({
  getParentRoute: () => groupsRoute,
  path: '$groupId',
  component: () => {
    return (
      <RequireAuthComponent>
        <Group />
      </RequireAuthComponent>
    );
  },
});
