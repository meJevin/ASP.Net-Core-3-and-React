import React from "react";
import {UserIcon} from "./UserIcon";

export const Header = () => (
    <div>
        <a href="./">Q & A</a>
        <input type="text" placeholder="Search..."/>
        <a href="./signin">
            <UserIcon/>
            <span>
                Sign In
            </span>
        </a>
    </div>
);