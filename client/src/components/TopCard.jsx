import './TopCard.css'

const TopCard = (props) => {
    return (
        <div className="card">
            <div className="card-img"><img src={props.image} alt="pet" /></div>
            <div className="card-info">
                <div className="card-pets-name">{props.name}</div>
                <div className="card-likes">
                    <i className="fa-regular fa-heart"><p>{props.likes}</p></i>
 
                </div>
                <div className="card-description">{props.description}</div>
            </div>
        </div>
    )
}

export default TopCard;