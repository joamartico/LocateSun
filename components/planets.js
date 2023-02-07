import styled from "styled-components";

export const SunOption = () => (
	<>
		<Planet
			color="linear-gradient(to bottom, #FFF500, #FFCD00)"
			size="big"
		/>{" "}
		Sun
	</>
);

export const MoonOption = () => (
	<>
		<Planet
			color="radial-gradient(circle, #fff, #e5e5e5, #fff)"
			size="small"
		/>
		Moon
	</>
);

export const MarsOption = () => (
	<>
		<Planet
			color="linear-gradient(to right, #dd6600, #ff9f1a);"
			size="medium"
		/>
		Mars
	</>
);

const Planet = styled.div`
	border-radius: 50%;
	background: ${({ color }) => color};
	width: 30px;
	height: 30px;
	transform: ${({ size }) =>
		size == "small" ? "scale(0.7)" : size == "medium" ? "scale(0.8)" : ""};
	margin-right: 8px;
`;
