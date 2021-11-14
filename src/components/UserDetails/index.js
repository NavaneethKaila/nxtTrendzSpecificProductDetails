import {BiEdit} from 'react-icons/bi'
import {AiOutlineDelete} from 'react-icons/ai'
import './index.css'

const UserDetails = props => {
  const {eachUserDetails, onDeleteUser, onEditUser, toggleCheckbox} = props
  const {id, name, email, role} = eachUserDetails
  const onCheckbox = event => {
    toggleCheckbox(event.target.checked, id)
  }
  const deleteUser = () => {
    onDeleteUser(id)
  }
  const editUser = () => {
    onEditUser(id)
  }
  return (
    <li className="user-item">
      <div className="user-data-container">
        <input type="checkbox" value={id} onChange={onCheckbox} />
        <p className="label">{name}</p>
        <p className="label">{email}</p>
        <p className="label">{role}</p>
        <div className="edit-delete-actions-container label">
          <button
            type="button"
            className="action-icon-button"
            onClick={editUser}
          >
            <BiEdit className="edit-icon" />
          </button>
          <button
            type="button"
            className="action-icon-button"
            onClick={deleteUser}
          >
            <AiOutlineDelete className="delete-icon" />
          </button>
        </div>
      </div>
      <hr className="hr-line" />
    </li>
  )
}

export default UserDetails
