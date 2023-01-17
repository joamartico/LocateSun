import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SunCalc from "suncalc";

export default function Home() {
	const [sunPos, setSunPos] = useState();
	const [compass, setCompass] = useState();
	const [beta, setBeta] = useState();
	const [lockX, setLockX] = useState(false);
	const xContRef = useRef();
	const yContRef = useRef();
	const [borderLeft, setBorderLeft] = useState()
	const [borderRight, setBorderRight] = useState()

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

	function getBorderActiveX() {
		if (compass - 45 > sunPos.azimuth) return "left";
		if (compass + 45 < sunPos.azimuth) return "right";
	}
	function getBorderActiveY() {
		if (beta + 100 < sunPos.altitude) return "top";
		// if(compass - 100 > sunPos.altitude) return 'bottom'
	}

	return (
		<>
			<ion-content fullscreen>
				{/* <ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">SunLocate</ion-title>
					</ion-toolbar>
				</ion-header> */}

				<div style={{ background: "", position: "absolute" }}>
					<p>Sun X: {sunPos?.azimuth.toFixed()}°</p>
					<p>Sun Y: {sunPos?.altitude.toFixed()}°</p>
					<br />
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
														var compassHeading =
															event.webkitCompassHeading;
														setCompass(
															compassHeading
														);

														var betaVal =
															event.beta;
														setBeta(betaVal);

														if(compass - 45 > sunPos?.azimuth) {
															setBorderLeft('3px solid yellow')
															xContRef.current.style.borderLeft = "3px solid yellow";
														} else {
															setBorderLeft('')
														}
														if(compass + 45 < sunPos?.azimuth) {
															xContRef.current.style.borderRight = "3px solid yellow";
															setBorderRight('3px solid yellow')
														} else {
															setBorderRight('')
														}
														// if (beta + 100 < sunPos.altitude) {
														// 	yContRef.current.style.borderTop = "3px solid yellow";
														// }
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
								<SunContainer
									x
									ref={xContRef}
									style={{
										borderLeft: borderLeft,
										borderRight: borderRight
									}}
								>
									<Sun
										style={{
											marginLeft:
												-(compass - sunPos.azimuth) *
												10,
										}}
									/>
								</SunContainer>

								<SunContainer
									y
									ref={yContRef}
								>
									<Sun
										style={{
											marginBottom:
												-(beta - sunPos.altitude) * 10,
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
	border-bottom: ${({ x }) => (x ? "3px solid #6af5" : "")};
	border-top: ${({ x }) => (x ? "3px solid #6af5" : "")};
	border-left: ${({ y }) => (y ? "3px solid #6af5" : "")};
	border-right: ${({ y }) => (y ? "3px solid #6af5" : "")};
	z-index: 999;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
`;
