import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegListAlt, FaWpforms, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Sidebar: React.FC = () => {
	const { logout } = useContext(AuthContext);

	return (
		<div className="flex flex-col w-64 h-full text-white bg-gray-900">
			<div className="p-4 border-b border-gray-700">
				<h1 className="text-2xl font-semibold">My App</h1>
			</div>
			<nav className="flex flex-col flex-grow p-4">
				<NavLink
					to="/form"
					className={({ isActive }) =>
						`flex items-center py-2 px-4 mb-2 rounded transition-colors ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`
					}
				>
					<FaWpforms className="mr-3" />
					Form
				</NavLink>
				<NavLink
					to="/submissions"
					className={({ isActive }) =>
						`flex items-center py-2 px-4 mb-2 rounded transition-colors ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`
					}
				>
					<FaRegListAlt className="mr-3" />
					Submissions
				</NavLink>
				<button
					onClick={logout}
					className="flex items-center px-4 py-2 mt-auto transition-colors rounded hover:bg-gray-800"
				>
					<FaSignOutAlt className="mr-3" />
					Logout
				</button>
			</nav>
			<div className="p-4 border-t border-gray-700">
				<p className="text-sm">© 2024 My App</p>
			</div>
		</div>
	);
};

export default Sidebar;
