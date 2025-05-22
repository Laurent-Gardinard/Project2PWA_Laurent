/*
File: /src/components/AlertCard.jsx
*/
import React from 'react';
import { Link } from 'react-router-dom';

export default function AlertCard({ alert }) {
    return (
        <Link to={`/alert/${alert.id}`} className="block p-4 border rounded hover:shadow-md">
            <h2 className="text-xl font-semibold">{alert.title}</h2>
            <p>{alert.summary}</p>
        </Link>
    );
}
