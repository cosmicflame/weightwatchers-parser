var fs = require('fs')
var xml2js = require('xml2js')
var _ = require('underscore')
var json2csv = require('json2csv')
var moment = require('moment')

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
		newEntry.date = formatDateString(entry.DateEntered[0])
		newEntry.weight = entry.Weight[0].Value[0]
		return newEntry
	})

	callback(null, datesAndWeights)
}

function formatDateString(dateString) {
	return moment(dateString).format("YYYY-MM-DD")
}

function writeCsv(data, outFile, callback) {

	json2csv({data: data, fields: ['date', 'weight']}, function(err, csv) {
		if (err) {
			callback(err)
		} else {
			// TODO path.resolve needed here?
			fs.writeFile(outFile, csv, callback)
		}
	})
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

