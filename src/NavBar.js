import { Button, withAuthenticator }from "@aws-amplify/ui-react";

export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="site-title">Nakatomi Corporation</a>
        <ul>
            <li>
                <Button id="signOut" onClick={signOut}>Sign Out</Button>
            </li>
        </ul>
    </nav>
}