import { useEffect, useState } from "react";
import styled from "styled-components";
import SunCalc from "suncalc";
import IonSearchbar from "../components/IonSearchbar";

export default function Home() {
	const [search, setSearch] = useState("");
	const [compassAlpha, setCompassAlpha] = useState();
	const [sunPos, setSunPos] = useState();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			console.log('my position: ', lat, lng)
			var date = new Date();
			const sunPos = SunCalc.getPosition(date, lat, lng);
			const fixedAzimuth = (sunPos.azimuth * 180/(Math.PI) + 180).toFixed()
			setSunPos({altitude: sunPos.altitude, azimuth: fixedAzimuth});
		});
	}, []);

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Search food</ion-title>

					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">Feed</ion-title>
					</ion-toolbar>
					<ion-toolbar>
						<IonSearchbar
							value={search}
							onChange={(e) => setSearch(e.detail.value)}
							placeholder="Search Food"
							animated
							show-cancel-button="focus"
						/>
					</ion-toolbar>
				</ion-header>

				<ion-button
					onClick={() => {
						if (
							typeof DeviceOrientationEvent.requestPermission ===
							"function"
						) {
							DeviceOrientationEvent.requestPermission()
								.then((permissionState) => {
									alert(permissionState);
									if (permissionState === "granted") {
										window.addEventListener(
											"deviceorientation",
											function (event) {
												var alpha = event.alpha; // ángulo en grados respecto al norte
												setCompassAlpha(alpha.toFixed());
											}
										);
									}
								})
								.catch(alert);
						}
					}}
				>
					Allow Orientation
				</ion-button>

				<p>Sun: Altitude: {sunPos?.altitude}</p>
				<p>Sun Angle: {sunPos?.azimuth}°</p>

				<br/>
				<br/>
				<br/>

				<p>{compassAlpha || 'Compass Alpha'}</p>

				{sunPos && compassAlpha && Math.abs(compassAlpha - sunPos.azimuth) < 5  && <Sun />}
				
			</ion-content>
		</>
	);
}


const Sun = styled.div`
	height: 150px;
	width: 150px;
	background: #ff0;
	margin: auto;
	border-radius: 100%;
`;