import { Layout } from 'antd';

const { Footer } = Layout;

type FooterNavProps = React.HTMLAttributes<HTMLDivElement>;

const FooterNav = ({ ...others }: FooterNavProps) => {
  return (
    <Footer {...others} style={{ textAlign: 'center' }}>PLUXITY ©{new Date().getFullYear()} Created by PLUXITY</Footer>
  );
};

export default FooterNav;
