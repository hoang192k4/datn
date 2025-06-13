import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';
const MainLayout = () => {
    return (
        <>
            <Header />
            <div style={{ minHeight: 'calc(100vh - 180px)' }}>
                <Outlet />
            </div>

            <Footer />
        </>

    )
}

export default MainLayout