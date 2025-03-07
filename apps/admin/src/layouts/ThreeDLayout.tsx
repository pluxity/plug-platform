import { Layout } from 'antd';

import HeaderNav from './HeaderNav';
import FooterNav from './FooterNav';
import ThreeDComponent from '../components/atoms/ThreeDComponent';

const { Content } = Layout;


const ThreeDLayout = () => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
        </HeaderNav>

        <Content style={{ padding: 24, flex: 1, overflow: 'auto', height: '100%'}}>
          <ThreeDComponent />
        </Content>
        <FooterNav />
      </Layout>
    </Layout>
  );
};

export default ThreeDLayout;
