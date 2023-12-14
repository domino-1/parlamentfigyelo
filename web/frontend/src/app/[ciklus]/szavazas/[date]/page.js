import styles from "../szavazas.module.css";
import Link from "next/link";
var xml2js = require("xml2js");

export async function getVotes(date = "2023.03.07") {
	let data = await fetch(
		`https://www.parlament.hu/cgi-bin/web-api-pub/szavazasok.cgi?access_token=${process.env.PARLAMENT_API_KEY}&p_datum_tol=${date}&p_datum_ig=${date}`,
		{next: {revalidate: process.env.CACHE_TIME_LONG /*28800*/}}
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

	return <p className={styles.msg}>Nincs kiválasztva szavazás...</p>;
}
