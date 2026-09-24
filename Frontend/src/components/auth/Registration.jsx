import React, { useState } from "react"
import { registerUser } from "../utils/ApiFunctions"
import { Link } from "react-router-dom"

const Registration = () => {
	const [registration, setRegistration] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: ""
	})

	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")
	const [registeredEmail, setRegisteredEmail] = useState("")

	const handleInputChange = (e) => {
		setRegistration({ ...registration, [e.target.name]: e.target.value })
	}

	const handleRegistration = async (e) => {
		e.preventDefault()
		const emailUsed = registration.email.trim()
		try {
			const result = await registerUser({ ...registration, email: emailUsed })
			setRegisteredEmail(emailUsed)
			setSuccessMessage(
				result.message ||
					"Registration successful. Check your inbox for a verification link before signing in."
			)
			setErrorMessage("")
			setRegistration({ firstName: "", lastName: "", email: "", password: "" })
		} catch (error) {
			setSuccessMessage("")
			setRegisteredEmail("")
			setErrorMessage(error.message || "Registration failed.")
		}
		setTimeout(() => {
			setErrorMessage("")
		}, 10000)
	}

	const showSuccessPanel = Boolean(registeredEmail && successMessage)

	return (
		<section className="container py-5">
			<div className="hotel-card p-4 p-md-5 col-12 col-md-6 mx-auto">
				{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
				{showSuccessPanel && (
					<div className="alert alert-success" role="status">
						<p className="mb-2 fw-semibold">{successMessage}</p>
						<p className="mb-2">
							We sent a verification link to <strong>{registeredEmail}</strong>. Please check your inbox
							and spam folder. The link expires after a limited time.
						</p>
						<p className="mb-0">
							After you verify, you can{" "}
							<Link to="/login" className="alert-link">
								log in here
							</Link>
							.
						</p>
					</div>
				)}

				<h2 className="hotel-label mb-4">Register</h2>
				<form onSubmit={handleRegistration}>
					<div className="mb-3 row">
						<label htmlFor="firstName" className="col-sm-2 col-form-label">
							first Name
						</label>
						<div className="col-sm-10">
							<input
								id="firstName"
								name="firstName"
								type="text"
								className="form-control"
								value={registration.firstName}
								onChange={handleInputChange}
								disabled={showSuccessPanel}
							/>
						</div>
					</div>

					<div className="mb-3 row">
						<label htmlFor="lastName" className="col-sm-2 col-form-label">
							Last Name
						</label>
						<div className="col-sm-10">
							<input
								id="lastName"
								name="lastName"
								type="text"
								className="form-control"
								value={registration.lastName}
								onChange={handleInputChange}
								disabled={showSuccessPanel}
							/>
						</div>
					</div>

					<div className="mb-3 row">
						<label htmlFor="email" className="col-sm-2 col-form-label">
							Email
						</label>
						<div className="col-sm-10">
							<input
								id="email"
								name="email"
								type="email"
								className="form-control"
								value={registration.email}
								onChange={handleInputChange}
								disabled={showSuccessPanel}
							/>
						</div>
					</div>

					<div className="mb-3 row">
						<label htmlFor="password" className="col-sm-2 col-form-label">
							Password
						</label>
						<div className="col-sm-10">
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								value={registration.password}
								onChange={handleInputChange}
								disabled={showSuccessPanel}
							/>
						</div>
					</div>
					<div className="mb-3">
						<button type="submit" className="btn btn-hotel w-100 mb-3" disabled={showSuccessPanel}>
							Register
						</button>
						<div className="text-center">
							Already have an account? <Link to={"/login"}>Login</Link>
						</div>
					</div>
				</form>
			</div>
		</section>
	)
}

export default Registration
