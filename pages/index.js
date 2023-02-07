import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SunCalc from "suncalc";
import { MarsOption, MoonOption, SunOption } from "../components/planets";
const ephemeris = require("ephemeris");

export default function Home() {
	const [sunPos, setSunPos] = useState();
	const [compass, setCompass] = useState();
	const [beta, setBeta] = useState();
	const [xBorderLeft, setXBorderLeft] = useState();
	const [xBorderRight, setXBorderRight] = useState();
	const [yBorderTop, setYBorderTop] = useState();
	const [showCamera, setShowCamera] = useState(false);
	const [showTargets, setShowTargets] = useState(false);
	const [selectedTarget, setSelectedTarget] = useState("sun");

	const videoRef = useRef();

	const getVideo = () => {
		setShowCamera((prev) => !prev);

		navigator.mediaDevices
			.getUserMedia({
				video: { facingMode: "environment" },
				audio: false,
			})
			.then((stream) => {
				let video = videoRef.current;
				console.log(stream);
				video.srcObject = stream;
				video.play();
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			console.log("lat: ", lat);
			console.log("lng: ", lng);
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
				<TargetSelected onClick={() => setShowTargets((prev) => !prev)}>
					<TargetOption>
						{selectedTarget == "sun" ? (
							<SunOption />
						) : selectedTarget == "moon" ? (
							<MoonOption />
						) : (
							<MarsOption />
						)}
					</TargetOption>

					{showTargets && (
						<TargetsContainer>
							<TargetOption
								onClick={() => setSelectedTarget("sun")}
							>
								<SunOption />
							</TargetOption>

							<TargetOption
								onClick={() => setSelectedTarget("moon")}
							>
								<MoonOption />
							</TargetOption>

							<TargetOption
								onClick={() => setSelectedTarget("mars")}
							>
								<MarsOption />
							</TargetOption>
						</TargetsContainer>
					)}
				</TargetSelected>

				<CameraVideo
					ref={videoRef}
					muted
					autoPlay={true}
					playsInline={true}
					style={{ opacity: showCamera ? 1 : 0 }}
				/>

				<div style={{ background: "", position: "absolute" }}>
					<p>Sun X: {sunPos?.azimuth.toFixed()}°</p>
					<p>Sun Y: {sunPos?.altitude.toFixed()}°</p>
					<br />
					<p>Your X: {compass?.toFixed() || ""}°</p>
					<p>Your Y: {beta?.toFixed() || ""}°</p>

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

														if (
															compassHeading -
																45 >
															sunPos?.azimuth
														) {
															setXBorderLeft(
																"5px solid yellow"
															);
														} else {
															setXBorderLeft("");
														}
														if (
															compassHeading +
																45 <
															sunPos?.azimuth
														) {
															setXBorderRight(
																"5px solid yellow"
															);
														} else {
															setXBorderRight("");
														}
														if (
															betaVal + 100 <
															sunPos.altitude
														) {
															setYBorderTop(
																"5px solid yellow"
															);
														} else {
															setYBorderTop("");
														}
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
									style={{
										borderLeft: xBorderLeft,
										borderRight: xBorderRight,
									}}
								>
									<Target
										type={selectedTarget}
										style={{
											marginLeft:
												-(compass - sunPos.azimuth) *
												10,
										}}
									/>
								</SunContainer>

								<SunContainer
									y
									style={{
										borderTop: yBorderTop,
									}}
								>
									<Target
										type={selectedTarget}
										style={{
											marginBottom:
												-(beta - sunPos.altitude) * 10,
											// background: selectedTarget == 'sun' ? 'ff0b' : selectedTarget == 'moon' ? '#fffb' : '#8B2500bb'
										}}
									/>
								</SunContainer>
							</>
						)
						// )
					}
				</div>
			</ion-content>

			<CameraButton onClick={() => getVideo()}>
				<ion-icon name="camera" color="medium" />
			</CameraButton>
		</>
	);
}

export const getServerSideProps = async ({ res, params }) => {
	var result = ephemeris.getAllPlanets(
		new Date(),
		-58.653468489146036,
		-34.651012982795315,
		0
	);
	// console.log(result.observed);
	// console.log(result.observed.sun.raw.position.altaz.topocentric)
	console.log(
		"sun azimuth: ",
		result.observed.sun.raw.position.altaz.topocentric.azimuth
	);
	console.log(
		"sun altitude: ",
		90 + result.observed.sun.raw.position.altaz.topocentric.altitude
	);
	console.log("");
	console.log("");
	console.log(
		"mars azimuth: ",
		result.observed.mars.raw.position.altaz.topocentric.azimuth
	);
	console.log(
		"mars altitude: ",
		90 + result.observed.mars.raw.position.altaz.topocentric.altitude
	);
	console.log("");
	console.log("");
	console.log(
		"moon azimuth: ",
		result.observed.moon.raw.position.altaz.topocentric.azimuth
	);
	console.log(
		"moon altitude: ",
		90 + result.observed.moon.raw.position.altaz.topocentric.altitude
	);

	return {
		props: {
			result,
		},
	};
};

const TargetSelected = styled.div`
	border: none;
	border-radius: 14px;
	background: #fff;
	z-index: 99999;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 42px;
	/* width: 48px; */
	font-weight: 500;
	font-size: 14px;
	/* padding: 0 10px; */
	font-family: Roboto, sans-serif;
	cursor: pointer;
	position: fixed;
	top: 15px;
	right: 20px;
`;

const TargetsContainer = styled.div`
	background: #fff;
	z-index: 9999;
	border-radius: 14px;
	position: absolute;
	/* padding-right: 12px; */
	top: 0;
	margin-top: 50px;
	box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
`;

const TargetOption = styled.div`
	width: 100px;
	display: flex;
	align-items: center;
	justify-content: left;
	padding-left: 12px;
	height: 48px;
	font-weight: 500;
	font-family: Roboto, sans-serif;
	color: black !important;
	font-size: 14px;
	/* padding: 0 10px; */
	/* width: 48px; */
	cursor: pointer;
`;

const Target = styled.div`
	height: 150px;
	width: 150px;
	/* background: #ff0b; */
	border-radius: 50%;
	transition: margin 0.1s ease-in-out;
	z-index: 9;
	background: ${({ type }) => type == "sun" ? "ff0b" : type == "moon" ? "#fffb" : "#8B2500bb"};
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

const CameraButton = styled.div`
	border-radius: 50%;
	height: 60px;
	width: 60px;
	background: lightgray;
	border: 3px solid gray;
	color: gray;
	position: fixed;
	right: 25px;
	bottom: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const CameraVideo = styled.video`
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: auto;
`;
