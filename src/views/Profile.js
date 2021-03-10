
const Profile = (props) => {
    return(
        <div>
            <h1>Profile</h1>
            <p>{props.user.username}:{props.user.discriminator}</p>
        </div>  
    )
}

export default Profile