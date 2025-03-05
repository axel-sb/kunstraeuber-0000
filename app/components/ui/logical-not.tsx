import { useState } from 'react'

const LogicalNot = () => {
	//Using Inline Function and the The Logical Not (!) to toggle state
	const [toggle, setToggle] = useState(true)

	const handleClick = () => {
		setToggle(!toggle)
	}

	return (
		<>
			<button onClick={handleClick} className="btn btn-info mb-5">
				Toggle State
			</button>
			{toggle && (
				<ul className="list-group">
					<li className="list-group-item">An item</li>
					<li className="list-group-item">A second item</li>
					<li className="list-group-item">A third item</li>
					<li className="list-group-item">A fourth item</li>
					<li className="list-group-item">And a fifth one</li>
				</ul>
			)}
		</>
	)
}
export default LogicalNot
