/*
File: /src/pages/HomePage.jsx
*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const MTL_BOROUGHS = [
    'Ahuntsic-Cartierville', 'Anjou', 'Côte-des-Neiges–Notre-Dame-de-Grâce',
    'Lachine', 'LaSalle', 'L’Île-Bizard–Sainte-Geneviève',
    'Mercier–Hochelaga-Maisonneuve', 'Montréal-Nord', 'Outremont',
    'Pierrefonds-Roxboro', 'Plateau-Mont-Royal', 'Rivière-des-Prairies–Pointe-aux-Trembles',
    'Rosemont–La Petite-Patrie', 'Saint-Laurent', 'Saint-Léonard',
    'Sud-Ouest', 'Verdun', 'Ville-Marie', 'Villeray–Saint-Michel–Parc-Extension'
];

const SUBJECT_OPTIONS = [
    'Eau', 'Fermeture de route', 'Accident', 'Fermeture de circulation',
    'Incendie', 'Coupure d\'électricité', 'Inondation', 'Éboulement'
];

export default function HomePage() {
    const [search, setSearch] = useState(localStorage.getItem('search') || '');
    const [alerts, setAlerts] = useState([]);
    const [boroughs, setBoroughs] = useState(JSON.parse(localStorage.getItem('boroughs') || '[]'));
    const [subjects, setSubjects] = useState(JSON.parse(localStorage.getItem('subjects') || '[]'));
    const [startDate, setStartDate] = useState(localStorage.getItem('startDate') || '');
    const [endDate, setEndDate] = useState(localStorage.getItem('endDate') || '');
    const [openBorough, setOpenBorough] = useState(false);
    const [openSubject, setOpenSubject] = useState(false);

    const subjectDropdownRef = useRef();
    const boroughDropdownRef = useRef();

    useEffect(() => {
        fetch("https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=fc6e5f85-7eba-451c-8243-bdf35c2ab336")
            .then(res => res.json())
            .then(data => {
                const parsed = data.result.records.map(record => ({
                    id: record._id,
                    title: record.titre,
                    summary: record.resume || '',
                    description: record.description || '',
                    borough: record.arrondissement || 'Autre',
                    subject: record.sujet || 'Inconnu',
                    date: record.date || '1970-01-01'
                }));
                setAlerts(parsed);
                localStorage.setItem('geojson', JSON.stringify(parsed));
            });
    }, []);

    useEffect(() => {
        localStorage.setItem('search', search);
        localStorage.setItem('boroughs', JSON.stringify(boroughs));
        localStorage.setItem('subjects', JSON.stringify(subjects));
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);
    }, [search, boroughs, subjects, startDate, endDate]);

    const toggleCheckbox = (value, list, setter) => {
        setter(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    };

    const filtered = alerts.filter(alert => {
        const matchSearch = alert.title?.toLowerCase().includes(search.toLowerCase());
        const matchBorough = boroughs.length ? boroughs.some(b => alert.borough?.toLowerCase().includes(b.toLowerCase())) : true;
        const matchSubject = subjects.length ? subjects.some(sub => alert.subject?.toLowerCase().includes(sub.toLowerCase())) : true;
        const matchStart = startDate ? new Date(alert.date) >= new Date(startDate) : true;
        const matchEnd = endDate ? new Date(alert.date) <= new Date(endDate) : true;
        return matchSearch && matchBorough && matchSubject && matchStart && matchEnd;
    });

    const renderBadge = (label, onClick) => (
        <span key={label} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm cursor-pointer mr-2" onClick={onClick}>{label} ×</span>
    );

    return (
        <div className="p-4 space-y-4">
            <input type="text" placeholder="Rechercher une alerte..." value={search} onChange={e => setSearch(e.target.value)} className="p-2 border rounded w-full" />

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                    <button onClick={() => setOpenBorough(!openBorough)} className="border px-4 py-2 rounded w-64">Arrondissement ▾</button>
                    {openBorough && (
                        <div ref={boroughDropdownRef} className="absolute z-10 mt-1 bg-white border rounded shadow max-h-64 overflow-y-auto w-64 flex flex-col">
                            {MTL_BOROUGHS.map(b => (
                                <label key={b} className="flex items-center px-2 py-1">
                                    <input type="checkbox" checked={boroughs.includes(b)} onChange={() => toggleCheckbox(b, boroughs, setBoroughs)} className="mr-2" />
                                    {b}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button onClick={() => setOpenSubject(!openSubject)} className="border px-4 py-2 rounded w-64">Sujet ▾</button>
                    {openSubject && (
                        <div ref={subjectDropdownRef} className="absolute z-10 mt-1 bg-white border rounded shadow max-h-64 overflow-y-auto w-64 flex flex-col">
                            {SUBJECT_OPTIONS.map(s => (
                                <label key={s} className="flex items-center px-2 py-1">
                                    <input type="checkbox" checked={subjects.includes(s)} onChange={() => toggleCheckbox(s, subjects, setSubjects)} className="mr-2" />
                                    {s}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded" />
            </div>

            <div className="flex justify-between items-center flex-wrap gap-2">
                <button onClick={() => { setSearch(''); setBoroughs([]); setSubjects([]); setStartDate(''); setEndDate(''); localStorage.clear(); }} className="text-sm text-red-600 underline">Tout effacer les filtres</button>
                <div className="flex flex-wrap gap-2">
                    {boroughs.map(b => renderBadge(b, () => setBoroughs(prev => prev.filter(v => v !== b))))}
                    {subjects.map(s => renderBadge(s, () => setSubjects(prev => prev.filter(v => v !== s))))}
                    {startDate && renderBadge(`Début: ${startDate}`, () => setStartDate(''))}
                    {endDate && renderBadge(`Fin: ${endDate}`, () => setEndDate(''))}
                </div>
            </div>

            <p className="text-sm text-gray-600">{filtered.length} alerte(s) trouvée(s).</p>
            {filtered.length === 0 && <p>Aucune alerte trouvée.</p>}

            <div className="space-y-2">
                {filtered.map(alert => (
                    <Link key={alert.id} to={`/alert/${alert.id}`} className="block border rounded p-4 hover:bg-gray-50">
                        <h2 className="text-lg font-bold text-blue-600 underline">{alert.title}</h2>
                        <p>{alert.summary}</p>
                        <p className="text-sm text-gray-500">{alert.borough} – {alert.subject} – {alert.date}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
