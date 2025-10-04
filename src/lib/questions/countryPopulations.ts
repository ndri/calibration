import countryPopulations from '$lib/data/country_populations.json';
import type { Question } from '$lib/types';
import { chooseNearbyPair } from '$lib/utils/array';
import { formatNumber } from '$lib/utils/numbers';

export function generateCountryPopulationQuestion(): Question {
	const [country1, country2] = chooseNearbyPair(
		countryPopulations,
		(country) => country.population
	);

	const [higherPopulationCountry, lowerPopulationCountry] =
		country1.population > country2.population ? [country1, country2] : [country2, country1];

	return {
		question: 'Which country has a higher population?',
		options: [country1.country, country2.country],
		answer: higherPopulationCountry.country,
		explanation: `${higherPopulationCountry.country} (${formatNumber(higherPopulationCountry.population)}) has a higher population than ${lowerPopulationCountry.country} (${formatNumber(lowerPopulationCountry.population)}).`
	};
}
