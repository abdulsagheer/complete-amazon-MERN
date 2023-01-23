import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

function Product(props) {
	const { product } = props;

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const addToCartHandler = async (item) => {
		const existItem = cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${item._id}`);
		if (data.countInStock < quantity) {
			window.alert("Sorry. Product is out of stock");
			return;
		}
		ctxDispatch({
			type: "CART_ADD_ITEM",
			payload: { ...item, quantity },
		});
	};

	return (
		<Card>
			<Link to={`/product/${product.slug}`}>
				<img src={product.image} className="card-img-top" alt={product.name} />
			</Link>
			<Card.Body>
				<Link
					to={`/product/${product.slug}`}
					style={{ textDecoration: "none", color: "white" }}>
					<Card.Title className="fw-bold">{product.name}</Card.Title>
				</Link>
				<Rating rating={product.rating} numReviews={product.numReviews} />
				<Card.Text>
					<div className="fw-bold fs-4">
						<sup>$</sup>
						{product.price}
					</div>
					<img
						className="mb-1"
						style={{ width: "80px" }}
						src="images/fullfilled.png"
						alt="amazon"
					/>
					<p style={{ color: "gray" }}>10% Off on SBI Cards</p>
				</Card.Text>
				{product.countInStock <= 4 && product.countInStock !== 0 && (
					<p
						style={{
							color: "#FE7954",
						}}>{`Only ${product.countInStock} left in stock.`}</p>
				)}
				{product.countInStock === 0 ? (
					<Button
						style={{
							border: "none",
							outline: "none",
							borderRadius: "20px",
							color: "#0f1111",
							width: "200px",
							letterSpacing: "0.5px",
							fontSize: "14px",
							boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.5)",
						}}
						variant="light"
						className="bg-danger"
						disabled>
						Out of stock
					</Button>
				) : (
					<Button
						style={{
							backgroundColor: "#ffd814",
							border: "none",
							outline: "none",
							borderRadius: "20px",
							color: "#0f1111",
							width: "200px",
							letterSpacing: "0.5px",
							fontSize: "14px",
							boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.5)",
						}}
						onClick={() => addToCartHandler(product)}>
						Add to cart
					</Button>
				)}
			</Card.Body>
		</Card>
	);
}
export default Product;
