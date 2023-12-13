'use client'
import { useState } from "react"
import styles from "./collapsible.module.css";

export default function Collapsible({ children }) {

    const [isCollapsed, setCollapsed] = useState(true);

    return <div>
        { children }
    </div>
}