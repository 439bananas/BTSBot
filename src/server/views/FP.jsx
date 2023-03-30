import * as React from "react";
import { Link } from "react-router-dom";
import translate from "./components/getLanguageString";

export default function Home(props) {
    return (
        <div>
            <h1>Yeet</h1>
            <Link to="/about">About</Link>
            <p>{translate(props.language, "name")}</p>
        </div>
    )
}