import React from "react"
import { Row, Col, Card } from "react-bootstrap"
import {
	FaSpa,
	FaCocktail,
	FaParking,
	FaSwimmingPool,
	FaUtensils,
	FaWifi
} from "react-icons/fa"

const HotelService = () => {
	return (
		<section className="luxury-section">
			<div className="section-heading-wrap text-center mb-4">
				<p className="section-kicker">Signature Amenities</p>
				<h2 className="luxury-section-title">Indulgent Experiences Await</h2>
			</div>
			<Row xs={1} md={2} lg={3} className="g-4 mt-2">
				<Col>
					<Card className="hotel-card amenity-card h-100">
						<Card.Body>
							<Card.Title className="hotel-color d-flex gap-2 align-items-center">
								<FaSpa /> Spa & Wellness
							</Card.Title>
							<Card.Text>Unwind with curated spa therapies and private wellness rituals.</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="hotel-card amenity-card h-100">
						<Card.Body>
							<Card.Title className="hotel-color d-flex gap-2 align-items-center">
								<FaSwimmingPool /> Infinity Pool
							</Card.Title>
							<Card.Text>Relax by a temperature-controlled pool with skyline serenity.</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="hotel-card amenity-card h-100">
						<Card.Body>
							<Card.Title className="hotel-color d-flex gap-2 align-items-center">
								<FaUtensils /> Fine Dining
							</Card.Title>
							<Card.Text>Enjoy world-class cuisine crafted by award-winning chefs.</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="hotel-card amenity-card h-100">
						<Card.Body>
							<Card.Title className="hotel-color d-flex gap-2 align-items-center">
								<FaCocktail /> Sky Lounge
							</Card.Title>
							<Card.Text>Signature mocktails and panoramic evening views in a chic ambience.</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="hotel-card amenity-card h-100">
						<Card.Body>
							<Card.Title className="hotel-color d-flex gap-2 align-items-center">
								<FaParking /> Valet Parking
							</Card.Title>
							<Card.Text>Complimentary valet service for a seamless premium arrival.</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="hotel-card amenity-card h-100">
						<Card.Body>
							<Card.Title className="hotel-color d-flex gap-2 align-items-center">
								<FaWifi /> High-Speed WiFi
							</Card.Title>
							<Card.Text>Stay effortlessly connected with enterprise-grade wireless access.</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</section>
	)
}

export default HotelService
