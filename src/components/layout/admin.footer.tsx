'use client';

import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;
    return (
        <Footer style={{ textAlign: 'center' }}>
            Nest-Next ©{new Date().getFullYear()} Created by PhatNgo
        </Footer>
    );
};

export default AdminFooter;
