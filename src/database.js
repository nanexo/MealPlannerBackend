const csv = require('csv-parser');
const fs = require('fs');

function normalizeMacro(value) {
	if(value === "Sp.")
		return 0;

	return value.replace(/</g, '');
}

function loadDatabase() {
	return new Promise((resolve, reject) => {
		const foods = [];
		fs.createReadStream('naehrwertdatenbank.csv')
			.pipe(csv())
			.on('data', (row) => {
				foods.push(
					{
						id: row["ID"],
						title: row["Name"],
						protein: normalizeMacro(row["Protein (g)"]),
						carbs: normalizeMacro(row["Kohlenhydrate, verfügbar (g)"]),
						fat: normalizeMacro(row["Fett, total (g)"]),
						kcal: row["Energie, Kalorien"]
					}
				);
			})
			.on('end', () => {
				resolve(foods);
			})
			.on('error', error => {
				reject(error);
			});
	});
}


module.exports = loadDatabase;