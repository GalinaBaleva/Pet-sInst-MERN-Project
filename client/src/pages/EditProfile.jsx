import { useLocation, Navigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";

const EditProfile = () => {
    const location = useLocation();
    if (!location.state?._id) return <Navigate to="/profile" />;
    const _id = location.state._id;

    return (
        <>
            <ProfileForm
                action='password'
                title='Changing Password'
                _id={_id}
            />
            <ProfileForm
                title='Changing Image'
                _id={_id}
            />
        </>
    )
}

export default EditProfile;