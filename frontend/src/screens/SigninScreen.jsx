import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SigninScreen() {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectInUrl = new URLSearchParams(search).get("redirect");
	const redirect = redirectInUrl ? redirectInUrl : "/";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const { data } = await Axios.post("/api/users/signin", {
				email,
				password,
			});
			ctxDispatch({ type: "USER_SIGNIN", payload: data });
			localStorage.setItem("userInfo", JSON.stringify(data));
			navigate(redirect || "/");
		} catch (err) {
			toast.error(getError(err));
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	return (
		<Container className="small-container">
			<Helmet>
				<title>Sign In</title>
			</Helmet>
			<h1 className="my-3">Sign In</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<div className="mb-3">
					<Button
						style={{
							paddingBottom: "30px",
							width: "100%",
							backgroundColor: "#f3d078",
							cursor: "pointer",
							border: "1px solid #9c7e31",
							height: "29px",
							outline: "none",
							borderRadius: "3px",
							color: "#111",
							background: "linear-gradient(to bottom, #f7dfa5, #f0c14b)",
						}}
						type="submit">
						Sign In
					</Button>
				</div>
				<div className="mb-3">
					<Link
						to={`/signup?redirect=${redirect}`}
						style={{
							fontSize: "14px",
							textAlign: "center",
							color: "#767676",
							marginTop: "20px",
							fontWeight: "600",
						}}>
						<button
							style={{
								background: "linear-gradient(to bottom, #f7f8fa, #e7e9ec)",
								height: "29px",
								width: "300px",
								borderRadius: "3px",
								border: "1px solid #adb1b8",
								outline: "none",
								marginTop: "15px",
							}}>
							New customer? Create your account
						</button>
					</Link>
				</div>
			</Form>
		</Container>
	);
}
