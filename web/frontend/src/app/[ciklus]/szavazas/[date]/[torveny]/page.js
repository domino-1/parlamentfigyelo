import styles from "../../szavazas.module.css";
import Link from "next/link";
var xml2js = require("xml2js");

async function getVoteRes(date = "2023.03.07", time = "00:00:00") {
	let data = await fetch(
		`https://www.parlament.hu/cgi-bin/web-api-pub/szavazas.cgi?access_token=${process.env.PARLAMENT_API_KEY}&p_szavdatum=${date}.${time}`
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
	const data = await getVoteRes(todayFormated, params.torveny);

	//let szavazasok = data["szavazasok"] ? data["szavazasok"]["szavazas"] : false;

	return (
		<>
			<p>{JSON.stringify(data["szavazas"]["szavazas"][0]["tulajdonsagok"])}</p>
			<p>&nbsp;</p>
			<p>{JSON.stringify(data["szavazas"]["szavazas"][0]["inditvanyok"])}</p>
			<p>&nbsp;</p>
			{data["szavazas"]["szavazas"][0]["tulajdonsagok"][0]["tulajdonsag"][0]["$"]["ertek"] ===
			"Listás" ? (
				<ul className={styles.szavazas_eredmeny}>
					<li className={styles.Igen}>
						<h3>IGEN</h3>
					</li>
					<li className={styles.Nem}>
						<h3>NEM</h3>
					</li>
					<li>
						<h3>EGYÉBB</h3>
					</li>
					{data["szavazas"]["szavazas"][0]["nev_szerint"][0]["szavazat"].map(
						(szavazat) => (
							<li
								key={szavazat["$"]["kepviselo"]}
								className={
									styles[
										szavazat["$"]["szavazat"]
											.replace(/ /g, "_")
											.replace(/Tart./, "Tartózkodik")
									]
								}
								title={szavazat["$"]["szavazat"].replace(/Tart./, "Tartózkodik")}
							>
								{szavazat["$"]["kepviselo"]}
							</li>
						)
					)}
				</ul>
			) : (
				<p class={styles.msg}>Ennek a szavazásnak az adatai nem publikusak.</p>
			)}
		</>
	);
}
