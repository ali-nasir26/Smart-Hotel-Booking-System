import React, { useEffect, useState } from "react";
import { deleteUser, getBookingsByUserId, getUser } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "./AuthProvider";

const Profile = () => {
	// State variables initialized correctly
	const [user, setUser] = useState(null);
	const [bookings, setBookings] = useState([]);
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const { handleLogout } = useAuth();

	// Get user details from localStorage
	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem("token");

	// Effect to fetch user data
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUser(userId, token);
				setUser(userData);
			} catch (error) {
				console.error(error);
				setErrorMessage(error.message);
			}
		};

		if (userId && token) {
			fetchUser();
		}
	}, [userId, token]);

	// Effect to fetch booking history
	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await getBookingsByUserId(userId, token);
				setBookings(response);
			} catch (error) {
				console.error("Error fetching bookings:", error.message);
				setErrorMessage(error.message);
			}
		};

		if (userId && token) {
			fetchBookings();
		}
	}, [userId, token]);

	// Function to handle account deletion
	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);
		if (confirmed) {
			try {
				const response = await deleteUser(userId);
				setMessage(response);
				handleLogout(); // Use centralized logout from AuthProvider
				navigate("/", { state: { message: "Your account has been deleted successfully." } });
			} catch (error) {
				setErrorMessage(error.message);
			}
		}
	};

	// Display a loading message until the user data is fetched
	if (!user) {
		return <p className="text-center mt-5">Loading user data...</p>;
	}

	return (
		<div className="container">
			{message && <p className="alert alert-success mt-3">{message}</p>}
			{errorMessage && <p className="alert alert-danger mt-3">{errorMessage}</p>}

			<div className="card p-5 mt-5" style={{ backgroundColor: "whitesmoke" }}>
				<h4 className="card-title text-center">User Information</h4>
				<div className="card-body">
					<div className="col-md-10 mx-auto">
						<div className="card mb-3 shadow">
							<div className="row g-0">
								<div className="col-md-2 d-flex justify-content-center align-items-center">
									<img
										src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
										alt="Profile"
										className="rounded-circle"
										style={{ width: "150px", height: "150px", objectFit: "cover" }}
									/>
								</div>
								<div className="col-md-10">
									<div className="card-body">
										<div className="form-group row">
											<label className="col-md-2 col-form-label fw-bold">ID:</label>
											<div className="col-md-10">
												<p className="card-text">{user.id}</p>
											</div>
										</div>
										<hr />
										<div className="form-group row">
											<label className="col-md-2 col-form-label fw-bold">First Name:</label>
											<div className="col-md-10">
												<p className="card-text">{user.firstName}</p>
											</div>
										</div>
										<hr />
										<div className="form-group row">
											<label className="col-md-2 col-form-label fw-bold">Last Name:</label>
											<div className="col-md-10">
												<p className="card-text">{user.lastName}</p>
											</div>
										</div>
										<hr />
										<div className="form-group row">
											<label className="col-md-2 col-form-label fw-bold">Email:</label>
											<div className="col-md-10">
												<p className="card-text">{user.email}</p>
											</div>
										</div>
										<hr />
										<div className="form-group row">
											<label className="col-md-2 col-form-label fw-bold">Roles:</label>
											<div className="col-md-10">
												<ul className="list-unstyled">
													{/* Correctly displays roles as a list of strings */}
													{user.roles && user.roles.map((role, index) => (
														<li key={index} className="card-text">
															{role}
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<h4 className="card-title text-center mt-4">Booking History</h4>
						{bookings.length > 0 ? (
							<table className="table table-bordered table-hover shadow">
								<thead>
									<tr>
										<th>Booking ID</th>
										<th>Room ID</th>
										<th>Room Type</th>
										<th>Check-In Date</th>
										<th>Check-Out Date</th>
										<th>Confirmation Code</th>
									</tr>
								</thead>
								<tbody>
									{bookings.map((booking, index) => (
										<tr key={index}>
											<td>{booking.id}</td>
											<td>{booking.room.id}</td>
											<td>{booking.room.roomType}</td>
											{/* Correctly formats dates */}
											<td>{moment(booking.checkInDate).format("MMM Do, YYYY")}</td>
											<td>{moment(booking.checkOutDate).format("MMM Do, YYYY")}</td>
											<td>{booking.bookingConfirmationCode}</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p>You have not made any bookings yet.</p>
						)}

						<div className="d-flex justify-content-center">
							<div className="mx-2">
								<button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>
									Delete Account
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;