'use client'
import styles from "./collapsible.module.css";

import {config} from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

export default function CollapsibleButton({ isCollapsed, setCollapsed }) {

    function handleClick() {
        setCollapsed( !isCollapsed )
    }

    return (
        <button className={styles.button} onClick={handleClick}>
            <FontAwesomeIcon icon={faBars} />
        </button>
    )
}