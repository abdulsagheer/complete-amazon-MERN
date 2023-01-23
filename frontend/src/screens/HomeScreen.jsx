import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Banner from "../components/Banner";
// import data from '../data';
import "./Slide.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Footer from "../components/Footer/Footer";

const responsive = {
	desktop: {
		breakpoint: { max: 3000, min: 1024 },
		items: 4,
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 2,
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 1,
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return { ...state, products: action.payload, loading: false };
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

function HomeScreen() {
	const [{ loading, error, products }, dispatch] = useReducer(reducer, {
		products: [],
		loading: true,
		error: "",
	});
	// const [products, setProducts] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: "FETCH_REQUEST" });
			try {
				const result = await axios.get("/api/products");
				dispatch({ type: "FETCH_SUCCESS", payload: result.data });
			} catch (err) {
				dispatch({ type: "FETCH_FAIL", payload: err.message });
			}

			// setProducts(result.data);
		};
		fetchData();
	}, []);
	return (
		<div>
			<Helmet>
				<title>Amazon</title>
			</Helmet>
			<Banner />
			<div className="my-3">
				<h2 className="fw-bold">Featured Products</h2>
			</div>
			<div className="products">
				{loading ? (
					<LoadingBox />
				) : error ? (
					<MessageBox variant="danger">{error}</MessageBox>
				) : (
					<Row>
						{/* <Carousel
							responsive={responsive}
							infinite={true}
							draggable={false}
							swipeable={true}
							centerMode={true}
							autoPlay={true}
							autoPlaySpeed={4000}
							keyBoardControl={true}
							showDots={false}
							removeArrowOnDeviceType={["tablet", "mobile"]}
							dotListClass="custom-dot-list-style"
							itemClass="carousel-item-padding-40-px"
							containerClass="carousel-container"> */}
						{products.map((product) => (
							<Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
								<Product product={product}></Product>
							</Col>
						))}
						{/* </Carousel> */}
					</Row>
				)}
			</div>
		</div>
	);
}
export default HomeScreen;
