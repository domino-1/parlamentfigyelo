import styles from "./szavazas.module.css";
import Link from "next/link";
var xml2js = require("xml2js");

async function getDays(ciklus = 42) {
	let data = await fetch(
		`https://www.parlament.hu/cgi-bin/web-api-pub/ulesnap.cgi?access_token=${process.env.PARLAMENT_API_KEY}&p_ckl=${ciklus}`
	)
		.then((response) => response.text())
		.then(async function (res) {
			return await xml2js
				.parseStringPromise(res)
				.then(function (result) {
					return result;
				})
				.catch(function (err) {
					/* Failed */
				});
		});

	return data;
}

export default async function Page({params}) {
	const data = await getDays(params.ciklus);

	let ulesnapok = data["ulesnapok"]["ulesnap"];

	return (
		<>
			<nav className={styles.menu}>
				<div className={styles.title}>
					<h2>Ülésnapok</h2>
					<p>{params.ciklus}. ciklus</p>
				</div>
				<ul>
					{ulesnapok.map((ulnap) => (
						<li key={ulnap["ulnap"][0]}>
							<Link
								href={`/${params.ciklus}/szavazas/${ulnap["datum"][0].replace(
									/\./g,
									""
								)}/`}
							>
								<>
									<p>
										<span>
											{ulnap["ulnap"][0] +
												". ülésnap (" +
												ulnap["nap"][0] +
												")"}
										</span>
										<span>{ulnap["datum"][0]}</span>
									</p>
									<p>
										<span>Ülésszakasz: {ulnap["ulszak"][0]}</span>
										<span>Típus: {ulnap["ulesjelleg"][0]}</span>
									</p>
								</>
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<main className={[styles.content, "content"].join(" ")}>
				<p className={styles.msg}>Nincs kiválasztva ülésnap...</p>
			</main>
		</>
	);
}
