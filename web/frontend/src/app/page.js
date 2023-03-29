//import Image from "next/image";
import {redirect} from "next/navigation";
import {Inter} from "next/font/google";
import styles from "./page.module.css";

const inter = Inter({subsets: ["latin"]});

const latestCiklus = 42;

export default function Home() {
	return redirect(`${latestCiklus}/szavazas/`);
}
