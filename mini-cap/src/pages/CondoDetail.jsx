import Header from "../components/Header";
import Footer from "../components/Footer";
import CondoDetails from "../components/CondoDetails";
import "../index.css";
import "../styling/CondoDetails.css";
import React, { useState } from "react";
import AddCondoBtn from "../components/AddCondoBtn";
import { Link, useNavigate } from "react-router-dom";
import BackArrowBtn from "../components/BackArrowBtn";



export default function CondoDetail(){
	const [modal, setModal] = useState(false);

	const toggleModal = () => {
		setModal(!modal);
	};

		return(
			<>
				<Header/>
				
					<div className="details"><CondoDetails/></div>

				<BackArrowBtn/>
				
				<Footer/>
		
			</>
		);

	};

