'use client'
import styles from './menu.module.css';

import Link from 'next/link';
import { useState } from 'react';

import Collapsible from "@/components/collapsible";
import CollapsibleButton from "@/components/collapsibleButton";
import CollapsibleContent from "@/components/collapsibleContent";

export default function Menu({ ciklus, date, dateFormatted, votes }) {
    
    const [isCollapsed, setCollapsed] = useState(false);

    return (
            <nav className={styles.menu}>
                <div className={styles.title}>
                    <h2>
                        <Link href={`/${ciklus}/szavazas/`}>⯇</Link> Ülésnap
                    </h2>
                    <p>
                        {dateFormatted.replace(/\./g, ". ") + "."}
                        <CollapsibleButton
                            isCollapsed={isCollapsed}
                            setCollapsed={setCollapsed}
                        />
                    </p>
                </div>
                {votes ? (
                    <CollapsibleContent isCollapsed={isCollapsed}>
                        <ul className={styles.alternatingList}>
                            {votes.map((szavazas) => (
                                <Link
                                    href={`/${ciklus}/szavazas/${date}/${szavazas[
                                        "$"
                                    ]["idopont"].substring(11)}/`}
                                    key={szavazas["$"]["idopont"]}
                                >
                                    <li key={szavazas["$"]["idopont"]}>
                                        <p>
                                            <span>{szavazas["$"]["idopont"]}</span>
                                            <span>{"Dátum"}</span>
                                        </p>
                                        <p>
                                            {szavazas["inditvanyok"].map((indivany) => (
                                                <>
                                                    <span>
                                                        {indivany["inditvany"][0]["cim"]}
                                                    </span>
                                                    <span>
                                                        {indivany["inditvany"][0]["iromany"]}
                                                    </span>
                                                </>
                                            ))}
                                        </p>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </CollapsibleContent>
                ) : (
                    <p className={styles.msg}>Nem szavaztak semmiről a parlamentben...</p>
                )}
            </nav>
    )
}