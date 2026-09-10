import React, { useEffect } from 'react';
import { PageActions } from '../utils/actions/';
import { Notifications } from '../components/_shared';
import { PageMain } from '../components/page-layout/';
import { ViewerProfileGate } from '../components/viewer-profiles/ViewerProfileGate';

interface PageProps {
  id: string;
  children?: any;
}

export const Page: React.FC<PageProps> = ({ id, children = null }) => {
  useEffect(() => {
    PageActions.initPage(id);
  }, []);

  return (
    <>
      <ViewerProfileGate>
        <PageMain key="page-main">{children}</PageMain>
      </ViewerProfileGate>
      <Notifications key="notifications" />
    </>
  );
};
