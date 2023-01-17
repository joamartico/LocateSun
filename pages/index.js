import { useEffect, useState } from "react";
import styled from "styled-components";
import SunCalc from "suncalc";

export default function Home() {
	// const [compassAlpha, setCompassAlpha] = useState();
	const [compass, setCompass] = useState();
	const [sunPos, setSunPos] = useState();
	const [gamma, setGamma] = useState();
	const [beta, setBeta] = useState();
	const [lockX, setLockX] = useState(false);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			console.log("my position: ", lat, lng);
			var date = new Date();
			const sunPos = SunCalc.getPosition(date, lat, lng);
			const fixedAzimuth = (sunPos.azimuth * 180) / Math.PI + 180;
			const fixedAltitude = (sunPos.altitude * 180) / Math.PI + 180;
			setSunPos({ altitude: fixedAltitude, azimuth: fixedAzimuth });
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
					<p>Sun Altitude: {sunPos?.altitude.toFixed()}</p>
					<p>Sun Angle: {sunPos?.azimuth.toFixed()}°</p>
					<p>Compass: {compass?.toFixed() || ""}°</p>
					<p>Gamma: {gamma?.toFixed() || ""}°</p>
					<p>Beta: {beta?.toFixed() || ""}°</p>
					{/* <p>Altitude: {altitude || ""}</p> */}
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
														console.log('deviceorientation event: ', event)
														// var alpha = event.alpha;
														// setCompassAlpha(
														// 	360 - alpha.toFixed()
														// );
														var compassHeading =
															event.webkitCompassHeading;
														setCompass(
															compassHeading
														);

														var gammaVal = event.gamma;
														setGamma(gammaVal);

														var betaVal = event.beta;
														setBeta(betaVal);
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
						{
							sunPos && compass && (
								// Math.abs(compass - sunPos.azimuth) < 20 && (
								<Sun
									style={{
										marginLeft:
											-(compass - sunPos.azimuth) * 10,
									}}
								/>
							)
							// )
						}
					</div>

					{compass && (
						<ion-button onClick={() => setLockX((prev) => !prev)}>
							{lockX ? "Unlock X" : "Lock X"}
						</ion-button>
					)}
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
