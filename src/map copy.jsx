/* eslint-disable no-unused-vars */
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
// import * as topojson from "topojson-client";
import features from "./edmonton.json";

import { getColor, layersUtils, getCenterOfGeoJson } from "./mapUtils";
const COUNTRY_VIEW_ID = "india-states";
const Map = () => {
  const mapStyle = { height: "100vh", width: "100vw" };
  const [geoJsonId, setGeoJsonId] = useState("india-states");
  var mapRef = useRef(null);
  var geoJsonRef = useRef(null);
  const mapCenter = getCenterOfGeoJson(features);
  const onDrillDown = (e) => {
    const featureId = e.target.value;
    console.log("hellow world");
    if (!features.objects[featureId]) {
      return;
    }
    // setGeoJsonId("Anirniq");
  };
  useEffect(() => {
    console.log(features, "react");
  }, []);
  return (
    <>
      <button
        onClick={() => setGeoJsonId(COUNTRY_VIEW_ID)}
        className="backButton"
      >
        Back To Country View
      </button>
      <MapContainer ref={mapRef} center={mapCenter} zoom={10} style={mapStyle}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={features}
          key={geoJsonId}
          style={geoJSONStyle}
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
          id="geoJsonAll"
        />
      </MapContainer>
    </>
  );

  function onEachFeature(_, layer) {
    let layerUtils = layersUtils(geoJsonRef, mapRef);
    layer.on({
      mouseover: layerUtils.highlightOnClick,
      mouseout: layerUtils.resetHighlight,
      click: onDrillDown,
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
export default Map;
