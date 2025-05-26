import {logOut} from "@plug/v1/auth/api/auth";

const UserProfile = () => {
    return(
        <button className="w-10 h-10 bg-purple-500 rounded-full" onClick={logOut}>
            👤
        </button>
    )
}

export default UserProfile