import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { GetPlanet } from "../components/GetPlanet";

export default function Home() {
	const [compass, setCompass] = useState();
	const [beta, setBeta] = useState();
	const [xBorderLeft, setXBorderLeft] = useState();
	const [xBorderRight, setXBorderRight] = useState();
	const [yBorderTop, setYBorderTop] = useState();
	const [showCamera, setShowCamera] = useState(false);
	const [showTargets, setShowTargets] = useState(false);
	const [selectedTarget, setSelectedTarget] = useState("sun");
	const [positions, setPositions] = useState();

	const videoRef = useRef();

	const planets = ["sun", "moon", "mars", "mercury", "venus", "jupiter", "saturn"];

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

			fetch(
				"/api/getPositions?" +
					new URLSearchParams({
						lat,
						lng,
					})
			).then(async (res) => {
				const _positions = await res.json();
				console.log(_positions);
				setPositions(_positions);
			});
		});
	}, []);

	return (
		<>
			<ion-content fullscreen>
				<TargetSelected onClick={() => setShowTargets((prev) => !prev)}>
					<TargetOption>
						<GetPlanet planet={selectedTarget} withText />
					</TargetOption>

					{showTargets && (
						<TargetsContainer>
							{planets.map((planet) => (
								<TargetOption
									onClick={() => setSelectedTarget(planet)}
								>
									<GetPlanet planet={planet} withText />
								</TargetOption>
							))}
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

				<div
					style={{
						paddingLeft: "10px",
						position: "absolute",
						textTransform: "capitalize",
					}}
				>
					<p>
						{selectedTarget} X:{" "}
						{positions &&
							positions[selectedTarget]?.azimuth.toFixed()}
						°
					</p>
					<p>
						{selectedTarget} Y:{" "}
						{positions &&
							positions[selectedTarget]?.altitude.toFixed()}
						°
					</p>
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
															positions[
																selectedTarget
															]?.azimuth
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
															positions[
																selectedTarget
															]?.azimuth
														) {
															setXBorderRight(
																"5px solid yellow"
															);
														} else {
															setXBorderRight("");
														}
														if (
															betaVal + 100 <
															positions[
																selectedTarget
															].altitude
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
								} else {
									alert("requestPermission is not a function")
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
						positions && compass && (
							<>
								<TargetContainer
									x
									style={{
										borderLeft: xBorderLeft,
										borderRight: xBorderRight,
									}}
								>
									<GetPlanet
										planet={selectedTarget}
										style={{
											transform: "scale(5)",
											opacity: 0.7,
											marginLeft:
												-(
													compass -
													positions[selectedTarget]
														.azimuth
												) * 10,
										}}
									/>
								</TargetContainer>

								<TargetContainer
									y
									style={{
										borderTop: yBorderTop,
									}}
								>
									<GetPlanet
										planet={selectedTarget}
										style={{
											transform: "scale(5)",
											opacity: 0.7,
											marginBottom:
												-(
													beta -
													positions[selectedTarget]
														.altitude
												) * 10,
											// background: selectedTarget == 'sun' ? 'ff0b' : selectedTarget == 'moon' ? '#fffb' : '#8B2500bb'
										}}
									/>
								</TargetContainer>
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
	width: 120px;
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

const TargetContainer = styled.div`
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
		opacity: 0.6;
	}
`;

const CameraVideo = styled.video`
	position: fixed;
	top: 0;
	left: 50%;
	transform: translate(-50%);
	height: 100vh;
	width: auto;
`;
