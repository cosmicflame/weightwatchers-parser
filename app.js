var fs = require('fs')
var xml2js = require('xml2js')
var _ = require('underscore')

function getXmlFileAsJson(filename, callback) {

	var parser = new xml2js.Parser()

	//TODO path.resolve instead here?
	fs.readFile(__dirname + "/" + filename, function(err, data) {

		if (err) {
			callback(err)
		} else {
			parser.parseString(data, function(pErr, res) {
				callback(pErr, res)
			})
		}
	})
}

function extractDatesAndWeights(data, callback) {

	var base = data.WeightTrackerDataWithEntries.WeightHistory[0].WeightEntry

	var datesAndWeights = _.map(base, function(entry) {
		var newEntry = {}
		newEntry.date = entry.DateEntered[0]
		newEntry.weight = entry.Weight[0].Value[0]
		return newEntry
	})

	callback(null, datesAndWeights)
}

function writeCsv(data, outFile, callback) {
	callback()
}

// Actual work begins here :)
var argv = require('minimist')(process.argv.slice(2));

var inFile = argv.in
var outFile = argv.out

if (inFile && outFile) {
	getXmlFileAsJson(inFile, function(err, json) {
		if (err) {
			console.log("Failed to read & parse XML")
		} else {
			extractDatesAndWeights(json, function(err, data) {
				if (err) {
					console.log("Failed to extract data")
				} else {
					writeCsv(data, outFile, function(err) {
						if (err) {
							console.log("Failed to write CSV")
						} else {
							console.log("Done!")
						}
					})
				}
			})
		}
	})
} else {
	console.log("Please provide both --in and --out")
}

