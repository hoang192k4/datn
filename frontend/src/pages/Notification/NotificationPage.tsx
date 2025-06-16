import { useSelector } from "react-redux"

const NotificationPage = () => {

    const user = useSelector((state: any) => state.auth.user);

    console.log(user);

    return (
        <>
            <h1>NotificationPgae</h1>
        </>
    )
}

export default NotificationPage