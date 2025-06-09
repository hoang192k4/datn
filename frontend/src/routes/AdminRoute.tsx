import Dashboard from "../pages/admin/dashboard/dashboard"

export const AdminRoute = () => {
    return [
        {
            'path': 'dashboard',
            'element': <Dashboard />,
        },
        {
            'path': '',
            'element': <Dashboard />,
        },
    ];
}