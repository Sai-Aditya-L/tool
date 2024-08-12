import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FormWrapper from "../components/FormWrapper";
import Submissions from "../components/Submissions";
import { AuthContext } from "../context/AuthContext";

const AuthRoutes = () => {
	const { isLoggedIn, isInitialized } = useContext(AuthContext);
	return isInitialized ? (
		isLoggedIn ? (
			<Routes>
				<Route path="/form" element={<FormWrapper />} />
				<Route path="/submissions" element={<Submissions />} />
				<Route path="*" element={<Navigate to="/form" />} />
			</Routes>
		) : (
			<Navigate to="/login" />
		)
	) : (
		<div>Loading.....</div>
	);
};

export default AuthRoutes;
