import './UserInfo.css';
import { useNavigate } from 'react-router-dom'

const UserInfo = (props) => {
    const { _id, userimage, username, postCount, isOwner } = props;
    const navigate = useNavigate();

    const editClickHandler = () => {
        navigate('/edit-profile', {
            state: { _id }
        });
    }

    return (
        <div className="profile-info">
            <div className="user-image">
                <img src={userimage} alt="user-image" />
            </div>
            <div className="user-info">
                <p className="user-info-username">{username}</p>
                <div className="user-posts-wrapper">
                    <p>Posts: <span>{postCount}</span></p>
                </div>
                {isOwner ? <button className="edit-user-info" onClick={editClickHandler}>Edit Profile</button> : <></>}

            </div>
        </div>
    );
};

export default UserInfo;