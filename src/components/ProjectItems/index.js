import './index.css'

const ProjectItems = props => {
  const {projectItemDetails} = props
  const {name, imageUrl} = projectItemDetails

  return (
    <li className="listItemContainer">
      <img src={imageUrl} alt={name} className="image-url" />
      <p className="name">{name}</p>
    </li>
  )
}
export default ProjectItems
