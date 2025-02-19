import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FormsList from "../components/FormsList";
import Submissions from "../components/Submissions";
import FormManagement from "../components/FormManagement";
import { AuthContext } from "../context/AuthContext";

const AuthRoutes = () => {
	const { isLoggedIn, isInitialized } = useContext(AuthContext);
	return isInitialized ? (
		isLoggedIn ? (
			<Routes>
				<Route path="/forms" element={<FormManagement />} />
				<Route path="/form" element={<FormsList />} />
				<Route path="/submissions" element={<Submissions />} />
				<Route path="*" element={<Navigate to="/forms" />} />
			</Routes>
		) : (
			<Navigate to="/login" />
		)
	) : (
		<div>Loading.....</div>
	);
};

export default AuthRoutes;
