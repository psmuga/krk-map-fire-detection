import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const index = 1;
    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(e) {
            setPosition(e.latlng);
            // map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker marker_index={index} key={index} position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

function ISSMarker() {
    const [position, setPosition] = useState(null);
    const index = 2;
    const map = useMap();
    useEffect(() => {
        async function getISS() {
            const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
            const data = await response.json();
            const { latitude, longitude } = data;
            setPosition([latitude, longitude]);
            map.flyTo([latitude, longitude], map.getZoom());
        }
        getISS();
    }, [map]);

    useEffect(() => {
        const interval = setInterval(() => {
            async function getISS() {
                const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
                const data = await response.json();
                const { latitude, longitude } = data;
                setPosition([latitude, longitude]);
            }
            getISS();
        }, 5000);
        return () => clearInterval(interval);
    }, [map]);

    return position === null ? null : (
        <Marker marker_index={index} key={index} position={position}>
            <Popup>Current ISS position</Popup>
        </Marker>
    );
}

function App() {
    const [position] = useState([0, 0]);

    return (
        <div className='App'>
            <MapContainer id='mapid' center={position} zoom={3} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <ISSMarker></ISSMarker>
                <LocationMarker></LocationMarker>
            </MapContainer>
        </div>
    );
}

export default App;
