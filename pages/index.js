import { useEffect, useState } from "react";
import styled from "styled-components";
import SunCalc from "suncalc";

export default function Home() {
	// const [compassAlpha, setCompassAlpha] = useState();
	const [compass, setCompass] = useState();
	const [sunPos, setSunPos] = useState();
	const [gamma, setGamma] = useState();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			console.log("my position: ", lat, lng);
			var date = new Date();
			const sunPos = SunCalc.getPosition(date, lat, lng);
			const fixedAzimuth = (
				(sunPos.azimuth * 180) / Math.PI +
				180
			);
			setSunPos({ altitude: sunPos.altitude, azimuth: fixedAzimuth });
		});
	}, []);

	return (
		<>
			<ion-content fullscreen>
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">SunLocate</ion-title>
					</ion-toolbar>
				</ion-header>

				<div style={{ background: "" }}>
					<p>Sun: Altitude: {sunPos?.altitude.toFixed()}</p>
					<p>Sun Angle: {sunPos?.azimuth.toFixed()}°</p>
					<p>Compass: {compass?.toFixed() || ""}°</p>
					<p>Gamma: {gamma || ""}°</p>
					{/* <p>{compassAlpha || "Compass Alpha"}°</p> */}

					{!compass && (
						<ion-button
							onClick={() => {
								if (
									typeof DeviceOrientationEvent.requestPermission ===
									"function"
								) {
									DeviceOrientationEvent.requestPermission()
										.then((permissionState) => {
											if (permissionState === "granted") {
												window.addEventListener(
													"deviceorientation",
													function (event) {
														// var alpha = event.alpha;
														// setCompassAlpha(
														// 	360 - alpha.toFixed()
														// );
														var compassHeading =
															event.webkitCompassHeading;
														setCompass(
															compassHeading
														);

														var gammaVal =
															event.beta;
														setGama(gammaVal);
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
					)}

					<div
						style={{
							width: "100%",
							background: "",
							display: "flex",
							justifyContent: "center",
						}}
					>
						{sunPos &&
							compass &&
							// Math.abs(compass - sunPos.azimuth) < 20 && (
								<Sun
									style={{
										marginLeft:
											-(compass - sunPos.azimuth) * 10,
									}}
								/>
							// ) 
							}
					</div>
				</div>
			</ion-content>
		</>
	);
}

const Sun = styled.div`
	height: 150px;
	width: 150px;
	background: #ff0;
	/* margin: auto; */
	border-radius: 100%;
	transition: margin 0.1s ease-in-out;
`;
