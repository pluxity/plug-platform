import { Layout, Menu, SiderProps } from 'antd';
import { 
    HomeOutlined, 
    UserOutlined, 
    SettingOutlined, 
    AppstoreOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const items = [
    { key: '/', icon: <HomeOutlined />, label: '홈 화면' },
    { key: '/users', icon: <UserOutlined />, label: '사용자' },
    { key: '/settings', icon: <SettingOutlined />, label: '시스템 셋팅' },
    {
      key: 'drawings',
      icon: <AppstoreOutlined />,
      label: '도면',
      children: [
        { key: '/drawings/category', label: '카테고리 관리' },
        { key: '/drawings/drawing', label: '도면 관리' },
      ],
    },
    {
        key: 'objects',
        icon: <AppstoreOutlined />,
        label: '오브젝트',
        children: [
          { key: '/objects/category', label: '오브젝트 카테고리 관리' },
          { key: '/objects/object', label: '오브젝트 관리' },
        ],
      },
  ];

type SideNavProps = SiderProps;

const SideNav = ({...others }: SideNavProps) => {

    const navigate = useNavigate();

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };
    
    return (
        <Sider
            {...others}
        >
            <div 
                className="logo" 
                style={{ 
                height: '64px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                }}
            >
                <img 
                src={`/logo.svg`}
                alt="Logo" 
                style={{ maxHeight: '100%', maxWidth: '100%' }} 
                />
            </div>
            <Menu 
                mode="inline" 
                defaultSelectedKeys={['/']} 
                items={items} 
                onClick={handleMenuClick}
                style={{
                    boxShadow: 'none',
                    border: 'none',
                    background: 'none',
                }}
                 />
        </Sider>
    );
};

export default SideNav;
