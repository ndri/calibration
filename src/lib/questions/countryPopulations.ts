import countryPopulations from '$lib/data/country_populations.json';
import type { Question } from '$lib/types';
import { formatNumber } from '$lib/utils/numbers';

export function generateCountryPopulationQuestion(): Question {
	const countryPopulationsClone = [...countryPopulations];

	const countryIndex1 = Math.floor(Math.random() * countryPopulationsClone.length);
	const country1 = countryPopulationsClone.splice(countryIndex1, 1)[0];

	const countryIndex2 = Math.floor(Math.random() * countryPopulationsClone.length);
	const country2 = countryPopulationsClone.splice(countryIndex2, 1)[0];

	const [higherPopulationCountry, lowerPopulationCountry] =
		country1.population > country2.population ? [country1, country2] : [country2, country1];

	return {
		question: 'Which country has a higher population?',
		options: [country1.country, country2.country],
		answer: higherPopulationCountry.country,
		explanation: `${higherPopulationCountry.country} (${formatNumber(higherPopulationCountry.population)}) has a higher population than ${lowerPopulationCountry.country} (${formatNumber(lowerPopulationCountry.population)}).`
	};
}
