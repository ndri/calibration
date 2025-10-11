import countryPopulations from '$lib/data/country_populations.json';
import type { Question } from '$lib/questions/questions';
import { chooseNearbyPair } from '$lib/utils/array';
import { formatNumber } from '$lib/utils/numbers';

type CountryPopulation = (typeof countryPopulations)[number];

export const countryPopulationsQuestion = 'Which country has a higher population?';

function countryNameToCountryPopulation(countryName: string) {
	return countryPopulations.find((country) => country.country === countryName);
}

function sortByPopulation(countries: CountryPopulation[]) {
	return [...countries].sort((a, b) => b.population - a.population);
}

export function countriesToExplanation(countryName1: string, countryName2: string) {
	const country1 = countryNameToCountryPopulation(countryName1);
	const country2 = countryNameToCountryPopulation(countryName2);

	if (!country1 || !country2) return;

	const [higherPopulationCountry, lowerPopulationCountry] = sortByPopulation([country1, country2]);

	return generateCountryPopulationExplanation(higherPopulationCountry, lowerPopulationCountry);
}

export function generateCountryPopulationExplanation(
	higherPopulationCountry: CountryPopulation,
	lowerPopulationCountry: CountryPopulation
) {
	return `${higherPopulationCountry.country} (${formatNumber(higherPopulationCountry.population)}) has a higher population than ${lowerPopulationCountry.country} (${formatNumber(lowerPopulationCountry.population)}).`;
}

export function generateCountryPopulationQuestion(): Question {
	const [country1, country2] = chooseNearbyPair(
		countryPopulations,
		(country) => country.population
	);

	const [higherPopulationCountry, lowerPopulationCountry] = sortByPopulation([country1, country2]);

	return {
		question: countryPopulationsQuestion,
		options: [country1.country, country2.country],
		answer: higherPopulationCountry.country,
		explanation: generateCountryPopulationExplanation(
			higherPopulationCountry,
			lowerPopulationCountry
		)
	};
}
