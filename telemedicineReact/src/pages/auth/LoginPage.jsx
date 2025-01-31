import { useEffect, useState } from 'react';
import { PATHS } from '../../constants/path';
import { Link } from 'react-router-dom';
import login from '../../services/authService.js'; 
import { useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login_image.jpg';
import LoginVideo from "../../assets/Login_Doctor.mp4";  

export default function LoginPage() {
	const navigate = useNavigate();

	const [credentials, setCredentials] = useState({username:'', password:''});

	const loginUser = async (credentials) => {
		try{
			let response = await login(credentials);
			console.log(response);
			if ('accessToken' in response){
				alert("Logged In");
				Object.entries(response).forEach(([key, value]) => {
					localStorage.setItem(key, value); //adding the key value to local storage
				});	
				window.location.href = PATHS.HOME;
			}	
		}
		catch(error){
			alert(error.response.data.message);
			console.log("Error: ", error);
		}
	}

	function handleFormSubmit(e){
		e.preventDefault();
		loginUser(credentials);
	}

	function handleFormChange(e){
		const {name, value} = e.target;
		setCredentials((prevData) => ({
			...prevData, 
			[name]: value
		}))
	}
	useEffect(() => {
		// console.log(credentials);
	}, [credentials]);

	return (
		<main className="fixed inset-0 bg-primary bg-gradient-to-r from-primary">
		<span className="text-3xl font-montserrat font-extrabold text-white tracking-widest bg-gradient-to-r from-gray-500 via-white to-white bg-clip-text text-transparent">TELECHAUKI</span> 

		<div className="h-full w-full flex items-center justify-center px-4">
			{/* Main container using Flex */}
			<div className="w-full max-w-3xl mt-auto mb-auto flex bg-primary-light bg-gradient-to-r from-primary to-primary-light backdrop-blur-sm rounded-2xl p-8 shadow-lg">
				
				{/* Image Section (Left Column) */}
				<div className="w-1/2 mt-0 flex justify-center items-center">
					{/* Add your video here */}
					<video
						className="w-full h-full object-cover rounded-xl shadow-lg"
						autoPlay
						loop
						muted
					>
						<source src={LoginVideo} type="video/mp4" />
						{/* You can add more source tags for different video formats if needed */}
						Your browser does not support the video tag.
					</video>
				</div>

				{/* Login Section (Right Column) */}
				<div className="w-1/2 flex flex-col justify-center items-center space-y-6 ml-5">
					<h1 className="text-4xl font-semibold text-white mb-8 text-center bg-gradient-to-r from-primary-light via-[#036f72] to-primary bg-clip-text text-transparent">
						LOGIN
					</h1>

					<form className="space-y-6" onSubmit={(e) => handleFormSubmit(e)}>
						<div className="space-y-2 text-start w-full">
							<label className="text-sm text-gray-400">Username</label>
							<input
								type="text"
								name="username"
								value={credentials.username}
								onChange={handleFormChange}
								className="w-full px-4 py-2 rounded-md border  bg-primary text: border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
							/>
						</div>
						<div className="space-y-2 text-start w-full">
							<label className="text-sm text-gray-400">Password</label>
							<input
								type="password"
								name="password"
								value={credentials.password}
								onChange={handleFormChange}
								className="w-full px-4 py-2 rounded-md border bg-primary border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100"
							/>
						</div>
						<div className="text-center mt-4">
							<Link className="text-gray-400 hover:text-white text-sm">
								Forgot your password?
							</Link>
						</div>
						<button
							type="submit"
							className="w-full bg-[#036f72] text-white py-2 rounded-md hover:bg-[#278d903c] transition-colors"
						>
							SIGN IN
						</button>
						<div className="text-center text-gray-400">
							<span>Don't have an account ?</span>{" "}
							<Link
								onClick={() => navigate(PATHS.REGISTER)}
								className="text-gray-300 hover:text-white text-sm"
							>
								SignUp
							</Link>
						</div>

						{/* Google Sign-In Option */}
						<div className="mt-6 text-center">
							<button
								type="button"
								className="w-full bg-gray-300 text-black py-2 rounded-md mt-2 hover:bg-[#036f72] hover:text-white transition-colors"
							>
								Sign in with Google
							</button>
						</div>
					</form>
				</div>

			</div>
		</div>
	</main>
	);
}
