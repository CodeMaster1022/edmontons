import { MapContainer, GeoJSON, TileLayer, ScaleControl } from "react-leaflet";
import { useState, useEffect, useRef, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import edmonton from "./edmonton.json";
// import test from "./test.json";
import axios from "axios";
import { getColor, layersUtils, getCenterOfGeoJson } from "./mapUtils";

const CanadaList = ["Manitoba"];
const fetchDataForRegion = async (region) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?state=${region.toLowerCase()}&country=canada&polygon_geojson=1&format=geojson`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const COUNTRY_VIEW_ID = "edmonton";
const EdmontonMap = () => {
  const mapStyle = { height: "100vh", width: "100vw" };
  const [geoJsonId, setGeoJsonId] = useState("edmonton");
  const geoJson = edmonton.Objects[geoJsonId];

  const [bound, setBound] = useState();
  var mapRef = useRef(null);
  var geoJsonRef = useRef(null);
  const mapCenter = getCenterOfGeoJson(geoJson);

  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mapDataArray = await Promise.all(
          CanadaList.map((region) => fetchDataForRegion(region))
        );
        console.log(mapDataArray);
        setMapData(mapDataArray);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, [setMapData]);

  // const onDrillDown = (e) => {
  //   const featureId = e.target.feature.id;
  //   if (!edmonton.Objects[featureId]) return;
  //   setBound([e.target.getBounds()]);

  //   console.log(e.target.getBounds());
  //   setGeoJsonId(featureId);
  // };

  return (
    <>
      <button
        onClick={() => setGeoJsonId(COUNTRY_VIEW_ID)}
        className="backButton"
      >
        Back To City View
      </button>
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={10}
        style={mapStyle}
        // bounds={bound}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={geoJson}
          key={geoJsonId}
          style={geoJSONStyle}
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
          id="geoJsonAll"
        />
        <ScaleControl />
      </MapContainer>
    </>
  );

  function onEachFeature(_, layer) {
    let layerUtils = layersUtils(geoJsonRef, mapRef);
    layer.on({
      mouseover: layerUtils.highlightOnClick,
      // click: onDrillDown,
    });
  }

  function geoJSONStyle(feature) {
    return {
      color: "#1f2021",
      weight: 1,
      fillOpacity: 0.5,
      fillColor: getColor(Math.floor(Math.random() * 26)),
    };
  }
};
export default EdmontonMap;
