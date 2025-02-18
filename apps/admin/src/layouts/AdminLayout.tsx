import { ReactNode, useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import SiderNav from './SiderNav';
import HeaderNav from './HeaderNav';
import FooterNav from './FooterNav';

const { Content } = Layout;

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderNav
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{
          background: 'none',
          position: 'relative',
          height: '100vh',
        }}
      />

      <Layout>
        <HeaderNav
          style={{
            padding: 0,
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px #f0f1f2',
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: 'black' }} />
              ) : (
                <MenuFoldOutlined style={{ color: 'black' }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '20px',
              marginLeft: '16px',
              color: '#1890ff',
            }}
          />
        </HeaderNav>

        <Content style={{ padding: 24, flex: 1, overflow: 'auto', background: '#fff' }}>
          {children}
        </Content>

        <FooterNav />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
