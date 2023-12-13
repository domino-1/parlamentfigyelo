'use client'
import { useState } from "react"

export default function Check() {
    const [emptyDays, setEmptyDays] = useState(false);
    const onChangeEmptyDays = (e) => {
        setEmptyDays(e.target.value);
    };

    return (<>
        <input type="checkbox" defaultChecked={emptyDays} name="emptyDays" id="emptyDays" onChange={onChangeEmptyDays} />
        <label name="emptyDays"> Szavazás nélküli napok mutatása</label>
    </>)
}