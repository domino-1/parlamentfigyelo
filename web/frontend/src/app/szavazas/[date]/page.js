import styles from "../szavazas.module.css";
import Link from "next/link";
var xml2js = require("xml2js");

async function getVotes(date = "2023.03.07") {
	let data = await fetch(
		`https://www.parlament.hu/cgi-bin/web-api-pub/szavazasok.cgi?access_token=${process.env.PARLAMENT_API_KEY}&p_datum_tol=${date}&p_datum_ig=${date}`,
		{next: {revalidate: 28800}}
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

export default async function Page({params, searchParams}) {
	const todayFormated =
		params.date.slice(0, 4) + "." + params.date.slice(4, 6) + "." + params.date.slice(6, 8);
	const data = await getVotes(todayFormated);

	let szavazasok = data["szavazasok"] ? data["szavazasok"]["szavazas"] : false;

	return (
		<>
			<nav className={styles.menu}>
				<div className={styles.title}>
					<h2>
						<Link href="./.">⯇</Link>
						{searchParams.ulnap ? searchParams.ulnap + ". " : ""}
						Ülésnap
					</h2>
					<p>{todayFormated.replace(/\./g, ". ") + "."}</p>
				</div>
				{szavazasok ? (
					<ul>
						{szavazasok.map((szavazas) => (
							<li key={szavazas["$"]["idopont"]}>
								<p>
									<span>{szavazas["$"]["idopont"]}</span>
									<span>{"Dátum"}</span>
								</p>
								{szavazas["inditvanyok"].map((indivany) => (
									<>
										<p>
											<span>{indivany["inditvany"][0]["cim"]}</span>
											<span>{indivany["inditvany"][0]["iromany"]}</span>
										</p>
										<p>
											<span>{indivany["inditvany"][0]["ok"]}</span>
										</p>
									</>
								))}
							</li>
						))}
					</ul>
				) : (
					<p className={styles.msg}>
						Ezen a napon nem szavaztak semmiről a parlamentben...
					</p>
				)}
			</nav>
			<main className={[styles.content, "content"].join(" ")}>
				<p className={styles.msg}>Nincs kiválasztva szavazás...</p>
			</main>
		</>
	);
}
