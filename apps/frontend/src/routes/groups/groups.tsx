/* eslint-disable react-refresh/only-export-components */
import { createRoute, useNavigate } from '@tanstack/react-router';
import { FC, useMemo, useState } from 'react';
import { rootRoute } from '../root';
import { RequireAuthComponent } from '../../core/components/requireAuth/requireAuthComponent';
import { AccessType, FindGroupsResponseBody } from '@common/contracts';
import { AuthenticatedLayout } from '../../layouts/authenticated/authenticatedLayout';
import { GroupTile } from './component/groupTile';
import { useFindGroupsWithinQuery } from '../../api/groups/queries/findGroupsWithin/findGroupsWithinQuery';

export const GroupsPage: FC = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  useFindGroupsWithinQuery({
    latitude: position?.coords.latitude as number,
    longitude: position?.coords.longitude as number,
    radius: 3000,
  });

  const navigate = useNavigate();

  const dummyGroups: FindGroupsResponseBody = {
    data: [
      {
        accessType: AccessType.public,
        id: '1',
        name: 'Group 1',
      },
      {
        accessType: AccessType.private,
        id: '2',
        name: 'Group 2',
      },
    ],
  };

  useMemo(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition(position);
    });
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold">Groups</h1>

        <div className="flex flex-col py-8 gap-4">
          {dummyGroups?.data?.map((group) => {
            return (
              <GroupTile
                isPrivate={group.accessType === 'private'}
                name={group.name}
                key={group.id}
                onClick={() =>
                  navigate({
                    to: `/groups/${group.id}`,
                    from: '/groups',
                  })
                }
              />
            );
          })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'groups',
});


export const groupIndexRoute = createRoute({
  getParentRoute: () => groupsRoute,
  path: '/',
  component: () => {
    return (
      <RequireAuthComponent>
        <GroupsPage />
      </RequireAuthComponent>
    );
  },
})