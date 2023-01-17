import { useEffect, useState } from "react";
import styled from "styled-components";
import SunCalc from "suncalc";

export default function Home() {
	const [sunPos, setSunPos] = useState();
	const [gamma, setGamma] = useState();
	const [compass, setCompass] = useState();
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
			const fixedAltitude = (sunPos.altitude * 180) / Math.PI + 90;
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

				<div style={{ background: "", position: "absolute" }}>
					<p>Sun X: {sunPos?.azimuth.toFixed()}°</p>
					<p>Sun Y: {sunPos?.altitude.toFixed()}°</p>
					<br/>
					<p>Your X: {compass?.toFixed() || ""}°</p>
					<p>Your Y: {beta?.toFixed() || ""}°</p>
					{/* <p>Gamma: {gamma?.toFixed() || ""}°</p> */}
					{/* <p>Altitude: {altitude || ""}</p> */}
					{/* <p>{compassAlpha || "Compass Alpha"}°</p> */}

					{/* {compass && (
						<ion-button onClick={() => setLockX((prev) => !prev)}>
							{lockX ? "Unlock X" : "Lock X"}
						</ion-button>
					)} */}

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
														console.log(
															"deviceorientation event: ",
															event
														);
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
															event.gamma;
														setGamma(gammaVal);

														var betaVal =
															event.beta;
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
				</div>

				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{
						sunPos && compass && (
							<>
								<SunContainer x>
									<Sun
										style={{
											marginLeft:
												-(compass - sunPos.azimuth) *
												10,
										}}
									/>
								</SunContainer>

								<SunContainer y>
									<Sun
										style={{
											marginBottom:
												-(beta - sunPos.altitude) *
												10,
										}}
									/>
								</SunContainer>
							</>
						)
						// )
					}
				</div>
			</ion-content>
		</>
	);
}

const Sun = styled.div`
	height: 150px;
	width: 150px;
	background: #ff0b;
	border-radius: 50%;
	transition: margin 0.1s ease-in-out;
	z-index: 9;
	/* top: 350px; */
`;

const SunContainer = styled.div`
	width: ${({ x }) => (x ? "100%" : "155px")};
	height: ${({ y }) => (y ? "100%" : "155px")};
	border: 1px solid #aaaa;
	z-index: 999;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
`;
