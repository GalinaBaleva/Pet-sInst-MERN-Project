import { useLocation } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";

const EditProfile = () => {
    const location = useLocation();
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