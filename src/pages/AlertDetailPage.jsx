/*
File: /src/pages/AlertDetailPage.jsx
*/
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function AlertDetailPage() {
    const { id } = useParams();
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        // 1. Try from localStorage.geojson
        const local = localStorage.getItem("geojson");
        if (local) {
            const list = JSON.parse(local);
            const match = list.find(a => String(a.id) === id);
            if (match) {
                return setAlert(match);
            }
        }

        // 2. Fallback to GeoJSON
        fetch("https://donnees.montreal.ca/dataset/556c84af-aebf-4ca9-9a9c-2f246601674c/resource/d249e452-46f5-422f-91ae-898c98eea6cc/download/avis-alertes.geojson")
            .then(res => res.json())
            .then(data => {
                const match = data.features.find(f => String(f.properties._id) === id);
                if (match) {
                    const props = match.properties;
                    setAlert({
                        id: props._id,
                        title: props.titre,
                        summary: props.resume,
                        description: props.description,
                        borough: props.arrondissement,
                        subject: props.sujet,
                        date: props.date,
                        coords: match.geometry?.coordinates?.length === 2 ? match.geometry.coordinates.reverse() : null
                    });
                }
            });
    }, [id]);

    if (!alert) return <p className="p-4">Chargement...</p>;

    return (
        <main className="p-4 space-y-4">
            <Link to="/" className="text-blue-600 underline">← Retour à la liste</Link>

            <h1 className="text-2xl font-bold">{alert.title}</h1>
            <p className="text-sm text-gray-500">{alert.borough} – {alert.subject} – {alert.date}</p>
            <p className="mt-2">{alert.description}</p>

            {alert.coords ? (
                <MapContainer center={alert.coords} zoom={15} className="h-64 w-full rounded" scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <Marker position={alert.coords}>
                        <Popup>
                            {alert.title}
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <div className="p-4 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded">
                    📍 Coordonnées géographiques non disponibles pour cette alerte.
                </div>
            )}
        </main>
    );
}
