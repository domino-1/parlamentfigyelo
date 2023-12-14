import styles from "../../szavazas.module.css";
import Link from "next/link";
const xml2js = require("xml2js");

async function getVoteRes(date = "2023.03.07", time = "00:00:00") {
	let data = await fetch(
		`https://www.parlament.hu/cgi-bin/web-api-pub/szavazas.cgi?access_token=${process.env.PARLAMENT_API_KEY}&p_szavdatum=${date}.${time}` /*,
		{next: {revalidate: process.env.CACHE_TIME_LONG /28800/}} szavazas eredmenyet jo eselyel nem kell frissitgetni*/
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

function padString(input, length, paddingCharacter) {
	while (input.length < length) {
		input = paddingCharacter + input;
	}
	return input;
}

export default async function Page({params, searchParams}) {
	const todayFormated =
		params.date.slice(0, 4) + "." + params.date.slice(4, 6) + "." + params.date.slice(6, 8);
	const data = await getVoteRes(todayFormated, params.torveny);

	function iromanyLink(string) {
		if (string.indexOf("/") === 1) {
			string = string.slice(2);

			return (
				"//parlament.hu/irom" +
				params.ciklus +
				"/" +
				padString(string, 5, "0") +
				"/" +
				padString(string, 5, "0") +
				".pdf"
			);
		} else if (string.indexOf("/") !== -1) {
			const coreProposal = string.slice(0, string.indexOf("/"));
			const proposalNumber = string.slice(string.indexOf("/") + 1);

			return (
				"//parlament.hu/irom" +
				params.ciklus +
				"/" +
				padString(coreProposal, 5, "0") +
				"/" +
				padString(coreProposal, 5, "0") +
				"-" +
				padString(proposalNumber, 4, "0") +
				".pdf"
			);
		} else {
			return "#";
		}
	}

	//let szavazasok = data["szavazasok"] ? data["szavazasok"]["szavazas"] : false;

	const tulajdonsagok = data["szavazas"]["szavazas"][0]["tulajdonsagok"][0]["tulajdonsag"];
	const inditvanyok = data["szavazas"]["szavazas"][0]["inditvanyok"];

	return (
		<>
			<h2>Információk</h2>
			{tulajdonsagok.map((tulajdonsag) => {
				return (
					<p key="elem">
						{tulajdonsag["$"]["nev"]}: {tulajdonsag["$"]["ertek"]}
					</p>
				);
			})}
			<p>&nbsp;</p>
			{inditvanyok.map((inditvany) => {
				inditvany = inditvany["inditvany"];

				let out = [];

				inditvany.forEach((info) => {
					for (const property in info) {
						out.push(
							<span>
								{property.toString().charAt(0).toUpperCase()}
								{property.toString().slice(1)}:{" "}
								{property === "benyujto" ? (
									info[property][0]["$"]["nev"]
								) : property === "iromany" ? (
									<Link
										className={styles.iromany}
										href={iromanyLink(info[property].toString())}
									>
										{info[property].toString()}
									</Link>
								) : (
									info[property].toString()
								)}
							</span>
						);
					}
				});

				return out;
			})}
			<hr
				style={{
					width: "100%",
					margin: "1rem 0",
					borderTop: 0,
					borderColor: "var(--border-color)",
				}}
			/>
			<h2>Eredmények</h2>
			<p>
				<small>
					<span style={{color: "cyan"}}>kék = Tartózkodik, </span>
					<span style={{color: "white"}}>fehér = Nem szavazott, </span>
					<span style={{color: "gray"}}>szürke = Előre bejelentett hiányzó</span>
				</small>
			</p>
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
