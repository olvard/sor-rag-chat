//import { describe } from "node:test"
import "../styles/globals.css"

export const metadata = {
	title: "sorgpt",
	description: "Sunrise Of The Reaping GPT"
}

const RootLayout = ({children}) => {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}

export default RootLayout