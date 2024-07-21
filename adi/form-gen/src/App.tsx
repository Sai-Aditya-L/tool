import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
} from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { QuestionnaireProvider } from "./context/QuestionnaireContext";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthRoutes from "./routes/AuthRoutes";

function App() {
	return (
		<AuthProvider>
			<QuestionnaireProvider>
				<Router>
					<div className="flex h-screen">
						<AuthContext.Consumer>
							{({ isLoggedIn }) => isLoggedIn && <Sidebar />}
						</AuthContext.Consumer>
						<div className="flex-grow p-4">
							<Routes>
								<Route path="/login" element={<Login />} />
								<Route path="/register" element={<Register />} />
								<Route
									path="*"
									element={<AuthRoutes />}
								/>
							</Routes>
						</div>
					</div>
				</Router>
			</QuestionnaireProvider>
		</AuthProvider>
	);
}

export default App;
