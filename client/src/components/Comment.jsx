import dateFormat from 'dateformat';
import './Comment.css'

const Comment = (props) => {
    return (

        <div className="comment" data={props.commentuserid}>
            <div className="post-comment-ouner">{props.commentusersname}</div>
            <p>{props.comment}</p>
            <p className="date">{dateFormat(props.commentDate, "dd.mm.yyyy,  h:MM:ss TT")}</p>
        </div>
    )
}

export default Comment;