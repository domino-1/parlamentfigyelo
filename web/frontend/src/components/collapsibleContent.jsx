'use client'
import styles from "./collapsible.module.css";

export default function CollapsibleContent({ children, isCollapsed }) {

    return (<div className={`${styles.content} ${isCollapsed ? styles.closed : ""}`}>
        { children }
    </div>
    )
}