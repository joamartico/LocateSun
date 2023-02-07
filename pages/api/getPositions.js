import ephemeris from "ephemeris";

export default async function handler(req, res) {
    const lat = req.query.lat;
    const lng = req.query.lng;

    var result = ephemeris.getAllPlanets(
		new Date(),
		// -58.653468489146036,
        lng,
		// -34.651012982795315,
        lat,
		0
	);

    const positions = {
        sun : {
            azimuth: result.observed.sun.raw.position.altaz.topocentric.azimuth,
            altitude: 90 + result.observed.sun.raw.position.altaz.topocentric.altitude
        }, 
        moon : {
            azimuth: result.observed.moon.raw.position.altaz.topocentric.azimuth,
            altitude: 90 + result.observed.moon.raw.position.altaz.topocentric.altitude
        }, 
        mars : {
            azimuth: result.observed.mars.raw.position.altaz.topocentric.azimuth,
            altitude: 90 + result.observed.mars.raw.position.altaz.topocentric.altitude
        }, 
    }

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

	res.status(200).json(positions);

}