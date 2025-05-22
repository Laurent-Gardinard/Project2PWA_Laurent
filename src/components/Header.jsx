/*
File: /src/components/Header.jsx
*/
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="flex justify-between p-4 shadow-md items-center">
            <div className="text-xl font-bold">Ville de Montréal</div>
            <div>
                <a href="#" className="text-blue-600">Mon Compte</a>
            </div>
        </header>
    );
}