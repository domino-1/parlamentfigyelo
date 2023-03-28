//import Image from "next/image";
import {redirect} from "next/navigation";
import {Inter} from "next/font/google";
import styles from "./page.module.css";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
	return redirect(
		`42/szavazas/${new Date().toJSON().slice(0, 10).replace(/-/g, "")}` //toda: point this to latest
	);
}
