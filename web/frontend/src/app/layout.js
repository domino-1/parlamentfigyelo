import "./globals.css";
import Link from "next/link";

export const metadata = {
	title: "Parlamentfigyelő",
	description: "Hogyan és mikor szavaztak a képviselőink?",
};

export default function RootLayout({children}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
