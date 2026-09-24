import React from "react"
import { Link } from "react-router-dom"

const MainHeader = () => {
	return (
		<header className="header-banner">
			<div className="overlay"></div>
			<div className="animated-texts overlay-content text-center text-md-start">
				<p className="hero-kicker">Luxury Stays. Timeless Elegance.</p>
				<h1 className="hero-heading">
					Experience <span className="hotel-color">The Elite Hotel</span>
				</h1>
				<p className="hero-subtitle">
					Where curated comfort, fine dining, and bespoke hospitality redefine your stay.
				</p>
				<div className="hero-rating-badge">⭐ 4.8 / 5 Luxury Rating</div>
				<div className="d-flex flex-wrap gap-2 mt-4 justify-content-center justify-content-md-start">
					<Link to="/browse-all-rooms" className="btn btn-hotel">
						Explore Suites
					</Link>
					<Link to="/find-booking" className="btn btn-outline-light">
						Manage Booking
					</Link>
				</div>
			</div>
		</header>
	)
}

export default MainHeader
