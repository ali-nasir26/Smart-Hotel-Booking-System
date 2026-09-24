import React, { useState } from "react"
import { loginUser } from "../utils/ApiFunctions"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

const Login = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const [login, setLogin] = useState({
		email: "",
		password: ""
	})

	const navigate = useNavigate()
	const auth = useAuth()
	const location = useLocation()
	const redirectUrl = location.state?.path || "/"

	const handleInputChange = (e) => {
		setLogin({ ...login, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const success = await loginUser(login)
			const token = success.token
			auth.handleLogin(token, success.email, success.roles || [])
			navigate(redirectUrl, { replace: true })
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setErrorMessage("")
		}, 4000)
	}

	return (
		<section className="container py-5">
			<div className="hotel-card p-4 p-md-5 col-12 col-md-6 mx-auto">
				{errorMessage && <p className="alert alert-danger mb-4">{errorMessage}</p>}
				<h2 className="hotel-label mb-4">Login</h2>

				<form onSubmit={handleSubmit}>
					<div className="row mb-3">
						<label htmlFor="email" className="col-sm-2 col-form-label fw-semibold">
							Email
						</label>
						<div className="col-sm-10">
							<input
								id="email"
								name="email"
								type="email"
								className="form-control"
								value={login.email}
								onChange={handleInputChange}
							/>
						</div>
					</div>

					<div className="row mb-3">
						<label htmlFor="password" className="col-sm-2 col-form-label fw-semibold">
							Password
						</label>
						<div className="col-sm-10">
							<input
								id="password"
								name="password"
								type="password"
								className="form-control"
								value={login.password}
								onChange={handleInputChange}
							/>
						</div>
					</div>

					<button type="submit" className="btn btn-hotel w-100 mb-3">
						Login
					</button>

					<div className="text-center">
						Don&apos;t have an account yet? <Link to={"/register"}>Register</Link>
					</div>
					<div className="text-center mt-2">
						<Link to={"/forgot-password"}>Forgot Password?</Link>
					</div>
				</form>
			</div>
		</section>
	)
}

export default Login
