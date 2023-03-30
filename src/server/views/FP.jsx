import * as React from "react";
import { Link } from "react-router-dom";

export default function Home(props) {
    return (
        <div>
            <h1>Yeet</h1>
            <Link to="/about">About</Link>
            <p>{JSON.stringify(props)}</p>
        </div>
    )
}
