import styled from "styled-components";

export const Sun = ({ withText, style }) => (
	<>
		<Planet
			style={style}
			color="linear-gradient(to bottom, #FFF500, #FFCD00)"
			size="big"
		/>{" "}
		{withText && <Text>Sun</Text>}
	</>
);

export const Moon = ({ withText, style }) => (
	<>
		<Planet
			style={style}
			color="radial-gradient(circle at 50% 50%, #fff, #ccc)"
			size="small"
		/>
		{withText && <Text>Moon</Text>}
	</>
);

export const Mercury = ({ withText, style }) => (
	<>
		<Planet
			style={style}
			color="linear-gradient(to bottom, #F2E9D9 0%, #C6B09F 100%)"
			size="medium"
		/>
		{withText && <Text>Mercury</Text>}
	</>
);

export const Venus = ({ withText, style }) => (
	<>
		<Planet
			style={style}
			color="radial-gradient(ellipse at center, #FFC107 0%, #FF9800 100%)"
			size="medium"
		/>
		{withText && <Text>Venus</Text>}
	</>
);

export const Mars = ({ withText, style }) => (
	<>
		<Planet
			style={style}
			color="linear-gradient(to right, #ff7e00, #b32400)"
			size="medium"
		/>
		{withText && <Text>Mars</Text>}
	</>
);

export const Jupiter = ({ withText, style }) => (
	<>
		<Planet
			style={style}
			color="linear-gradient(to bottom, #EFC07F, #C7B89A)"
			size="big"
		/>
		{withText && <Text>Jupiter</Text>}
	</>
);

export const Saturn = ({ withText, style }) => (
	<>
		<Planet
			style={style}
			color="radial-gradient(ellipse at center, #FFB900 0%, #E0A600 100%)"
			size="big"
		/>
		{withText && <Text>Saturn</Text>}
	</>
);

const Planet = styled.div`
	border-radius: 50%;
	background: ${({ color }) => color};
	width: 30px;
	height: 30px;
	transform: ${({ size }) =>
		size == "small" ? "scale(0.7)" : size == "medium" ? "scale(0.8)" : ""};
	/* margin-right: 8px; */
	transition: margin 0.1s ease-in-out;
`;

const Text = styled.div`
	margin-left: 8px;
	font-size: 14px;
	font-weight: 500;
	color: #000 !important;
`;

export function GetPlanet({ planet, withText, style }) {
	if (planet == "sun") return <Sun withText={withText} style={style} />;
	if (planet == "moon") return <Moon withText={withText} style={style} />;
	if (planet == "mars") return <Mars withText={withText} style={style} />;
	if (planet == "mercury")
		return <Mercury withText={withText} style={style} />;
	if (planet == "venus") return <Venus withText={withText} style={style} />;
	if (planet == "jupiter") return <Jupiter withText={withText} style={style} />;
	if (planet == "saturn") return <Saturn withText={withText} style={style} />;
	return <Sun withText={withText} style={style} />;
}
