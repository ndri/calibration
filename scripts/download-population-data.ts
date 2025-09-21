import * as fs from 'node:fs';
import * as https from 'node:https';
import { parse } from 'csv-parse/sync';

interface PopulationRecord {
	'Country Name': string;
	'Country Code': string;
	Year: string;
	Value: string;
}

interface PopulationOutput {
	country: string;
	population: number;
	year: number;
}

// Countries/regions to exclude from the output
const COUNTRIES_TO_IGNORE = [
	'Africa Eastern and Southern',
	'Africa Western and Central',
	'Arab World',
	'Caribbean small states',
	'Central Europe and the Baltics',
	'Channel Islands',
	'Early-demographic dividend',
	'East Asia & Pacific',
	'East Asia & Pacific (excluding high income)',
	'East Asia & Pacific (IDA & IBRD countries)',
	'Euro area',
	'Europe & Central Asia',
	'Europe & Central Asia (excluding high income)',
	'Europe & Central Asia (IDA & IBRD countries)',
	'European Union',
	'Fragile and conflict affected situations',
	'Heavily indebted poor countries (HIPC)',
	'High income',
	'IBRD only',
	'IDA & IBRD total',
	'IDA blend',
	'IDA only',
	'IDA total',
	'Late-demographic dividend',
	'Latin America & Caribbean',
	'Latin America & Caribbean (excluding high income)',
	'Latin America & the Caribbean (IDA & IBRD countries)',
	'Least developed countries: UN classification',
	'Low & middle income',
	'Low income',
	'Lower middle income',
	'Middle East & North Africa',
	'Middle East & North Africa (excluding high income)',
	'Middle East & North Africa (IDA & IBRD countries)',
	'Middle income',
	'North America',
	'OECD members',
	'Other small states',
	'Pacific island small states',
	'Post-demographic dividend',
	'Pre-demographic dividend',
	'Small states',
	'South Asia',
	'South Asia (IDA & IBRD)',
	'Sub-Saharan Africa',
	'Sub-Saharan Africa (excluding high income)',
	'Sub-Saharan Africa (IDA & IBRD countries)',
	'Upper middle income',
	'World'
];

// Map to rename countries to more common names
const COUNTRY_RENAME_MAP: Record<string, string> = {
	'Bahamas, The': 'The Bahamas',
	'Brunei Darussalam': 'Brunei',
	'Congo, Dem. Rep.': 'Democratic Republic of the Congo',
	'Congo, Rep.': 'Republic of the Congo',
	'Egypt, Arab Rep.': 'Egypt',
	'Gambia, The': 'The Gambia',
	'Hong Kong SAR, China': 'Hong Kong',
	'Iran, Islamic Rep.': 'Iran',
	"Korea, Dem. People's Rep.": 'North Korea',
	'Korea, Rep.': 'South Korea',
	'Kyrgyz Republic': 'Kyrgyzstan',
	'Lao PDR': 'Laos',
	'Macao SAR, China': 'Macao',
	'Micronesia, Fed. Sts.': 'Micronesia',
	'Russian Federation': 'Russia',
	'Sint Maarten (Dutch part)': 'Sint Maarten',
	'Slovak Republic': 'Slovakia',
	'St. Martin (French part)': 'St. Martin',
	'Syrian Arab Republic': 'Syria',
	Turkiye: 'Turkey',
	'Venezuela, RB': 'Venezuela',
	'Viet Nam': 'Vietnam',
	'West Bank and Gaza': 'Palestine',
	'Yemen, Rep.': 'Yemen'
};

async function downloadCSV(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const makeRequest = (requestUrl: string) => {
			https
				.get(requestUrl, (res) => {
					// Handle redirects
					if (
						res.statusCode === 301 ||
						res.statusCode === 302 ||
						res.statusCode === 307 ||
						res.statusCode === 308
					) {
						const redirectUrl = res.headers.location;
						if (!redirectUrl) {
							reject(new Error('Redirect without location header'));
							return;
						}
						console.log(`Following redirect to: ${redirectUrl}`);
						makeRequest(redirectUrl);
						return;
					}

					if (res.statusCode !== 200) {
						reject(new Error(`Failed to download: ${res.statusCode}`));
						return;
					}

					let data = '';
					res.on('data', (chunk) => {
						data += chunk;
					});

					res.on('end', () => {
						resolve(data);
					});

					res.on('error', reject);
				})
				.on('error', reject);
		};

		makeRequest(url);
	});
}

async function main() {
	try {
		console.log('Downloading population data...');
		const csvData = await downloadCSV(
			'https://datahub.io/core/population/_r/-/data/population.csv'
		);

		console.log('Parsing CSV data...');
		const records: PopulationRecord[] = parse(csvData, {
			columns: true,
			skip_empty_lines: true
		});

		console.log(`Found ${records.length} records`);

		// Group by country and find the latest year for each
		const latestByCountry = new Map<string, PopulationRecord>();

		for (const record of records) {
			const countryName = record['Country Name'];

			// Skip ignored countries/regions
			if (COUNTRIES_TO_IGNORE.includes(countryName)) {
				continue;
			}

			const year = parseInt(record.Year);

			if (!latestByCountry.has(countryName)) {
				latestByCountry.set(countryName, record);
			} else {
				const existing = latestByCountry.get(countryName)!;
				const existingYear = parseInt(existing.Year);

				if (year > existingYear) {
					latestByCountry.set(countryName, record);
				}
			}
		}

		// Convert to output format
		const output: PopulationOutput[] = Array.from(latestByCountry.values())
			.map((record) => {
				const originalName = record['Country Name'];
				const renamedName = COUNTRY_RENAME_MAP[originalName] || originalName;

				return {
					country: renamedName,
					population: parseInt(record.Value),
					year: parseInt(record.Year)
				};
			})
			.sort((a, b) => a.country.localeCompare(b.country));

		// Write to JSON file
		const outputPath = 'src/lib/data/country_populations.json';
		fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

		console.log(`✅ Successfully wrote ${output.length} countries to ${outputPath}`);
		console.log(`Sample output:`);
		console.log(JSON.stringify(output.slice(0, 3), null, 2));

		process.exit(0);
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

main();
