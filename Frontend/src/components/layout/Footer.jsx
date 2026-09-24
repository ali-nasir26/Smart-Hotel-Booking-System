import React from "react"
import { Col, Container, Row } from "react-bootstrap"

const Footer = () => {
	let today = new Date()
	return (
		<footer className="footer luxury-footer mt-5 py-5">
			<Container>
				<Row className="g-4">
					<Col xs={12} md={4}>
						<h5 className="footer-title">Location</h5>
						<p className="mb-1">The Elite Hotel, Marine Drive</p>
						<p className="mb-1">Mumbai, Maharashtra 400020</p>
						<p className="mb-0">India</p>
					</Col>
					<Col xs={12} md={4}>
						<h5 className="footer-title">Contact</h5>
						<p className="mb-1">+91 98765 43210</p>
						<p className="mb-1">reservations@elitehotel.com</p>
						<p className="mb-0">24/7 Concierge Desk</p>
					</Col>
					<Col xs={12} md={4}>
						<h5 className="footer-title">Connect</h5>
						<div className="d-flex flex-column gap-2">
							<a
								className="footer-link"
								href="https://www.linkedin.com/in/vivek-gupta"
								target="_blank"
								rel="noreferrer">
								LinkedIn - Developer Vivek Gupta
							</a>
							<a
								className="footer-link"
								href="https://github.com/vivekgupta"
								target="_blank"
								rel="noreferrer">
								GitHub - Developer Vivek Gupta
							</a>
						</div>
					</Col>
				</Row>
				<Row className="mt-4 pt-3 border-top border-secondary-subtle">
					<Col xs={12} className="text-center">
						<p className="mb-1">&copy; {today.getFullYear()} The Elite Hotel. All rights reserved.</p>
						<p className="mb-0 footer-tagline">Crafted with excellence by Vivek Gupta</p>
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
