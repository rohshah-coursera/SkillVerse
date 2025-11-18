import './Profile.css'

function ProfileButton({ onClick }) {
  return (
    <div className="profile-button" onClick={onClick}>
      <div className="profile-avatar">👤</div>
    </div>
  )
}

export default ProfileButton

