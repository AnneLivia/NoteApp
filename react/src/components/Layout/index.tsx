import { Page, Layout } from '@shopify/polaris';
import { ReactNode } from 'react';
import './index.css';

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <Page fullWidth>
      <Layout>
        <div className='layout'>{children}</div>
      </Layout>
    </Page>
  );
};

export default AppLayout;
