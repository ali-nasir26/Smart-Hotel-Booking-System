import React, { useContext } from "react"
import MainHeader from "../layout/MainHeader"
import HotelService from "../common/HotelService"
import Parallax from "../common/Parallax"
import RoomCarousel from "../common/RoomCarousel"
import RoomSearch from "../common/RoomSearch"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
const Home = () => {
	const location = useLocation()

	const message = location.state && location.state.message
	const currentUser = localStorage.getItem("userId")
	return (
		<section>
			{message && <p className="text-warning px-5">{message}</p>}
			{/* {currentUser && (
				<h6 className="text-success text-center"> You are logged-In as {currentUser}</h6>
			)} */}
			<MainHeader />
			<div className="container">
				<RoomSearch />
				<section className="luxury-section">
					<div className="section-heading-wrap text-center mb-4">
						<p className="section-kicker">Featured Rooms & Suites</p>
						<h2 className="luxury-section-title">Curated Spaces For Elevated Comfort</h2>
					</div>
				</section>
				<RoomCarousel />
				<Parallax />
				<HotelService />
				<section className="luxury-section">
					<div className="section-heading-wrap text-center mb-4">
						<p className="section-kicker">Guest Testimonials</p>
						<h2 className="luxury-section-title">Loved By Discerning Travelers</h2>
					</div>
					<div className="row g-4">
						<div className="col-md-4">
							<div className="hotel-card testimonial-card h-100 p-4">
								<p>
									“From concierge to cuisine, every moment felt exceptional. The suite view was
									breathtaking.”
								</p>
								<h6 className="mb-0 hotel-color">Ananya Mehta</h6>
								<small>Business Traveler</small>
							</div>
						</div>
						<div className="col-md-4">
							<div className="hotel-card testimonial-card h-100 p-4">
								<p>
									“Elegant interiors, flawless service, and a truly relaxing spa experience. Highly
									recommended.”
								</p>
								<h6 className="mb-0 hotel-color">Rohan Kapoor</h6>
								<small>Family Vacation</small>
							</div>
						</div>
						<div className="col-md-4">
							<div className="hotel-card testimonial-card h-100 p-4">
								<p>
									“A luxury stay that balances sophistication and warmth. Booking was smooth and
									quick.”
								</p>
								<h6 className="mb-0 hotel-color">Priya Sharma</h6>
								<small>Weekend Getaway</small>
							</div>
						</div>
					</div>
				</section>

				<section className="luxury-cta text-center">
					<p className="section-kicker">Reserve Your Signature Stay</p>
					<h3>Step Into A World Of Refined Hospitality</h3>
					<p>Book your luxury room now and experience timeless elegance at The Elite Hotel.</p>
					<Link to="/browse-all-rooms" className="btn btn-hotel mt-2">
						Book Your Stay
					</Link>
				</section>
			</div>
		</section>
	)
}

export default Home
