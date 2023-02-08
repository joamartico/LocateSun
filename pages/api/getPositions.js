import ephemeris from "ephemeris";

const planets = ["sun", "moon", "mars", "mercury", "venus", "jupiter", "saturn"];


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
        // sun : {
        //     azimuth: result.observed['sun'].raw.position.altaz.topocentric.azimuth,
        //     altitude: 90 + result.observed.sun.raw.position.altaz.topocentric.altitude
        // }, 
        // moon : {
        //     azimuth: result.observed['moon'].raw.position.altaz.topocentric.azimuth,
        //     altitude: 90 + result.observed.moon.raw.position.altaz.topocentric.altitude
        // }, 
        // mars : {
        //     azimuth: result.observed['mars'].raw.position.altaz.topocentric.azimuth,
        //     altitude: 90 + result.observed.mars.raw.position.altaz.topocentric.altitude
        // }, 
    }

    planets.map(target => {
        positions[target] = {
            azimuth: result.observed[target].raw.position.altaz.topocentric.azimuth,
            altitude: 90 + result.observed[target].raw.position.altaz.topocentric.altitude
        }
    })

	res.status(200).json(positions);

}