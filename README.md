# Open Budget Survey Explorer

[![Build Status](https://travis-ci.org/okfn/ibp-explorer.svg?branch=master)](https://travis-ci.org/okfn/ibp-explorer)
[![Coverage Status](https://coveralls.io/repos/github/okfn/ibp-explorer/badge.svg?branch=master)](https://coveralls.io/github/okfn/ibp-explorer?branch=master)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/okfn/ibp-explorer/issues)

* Live version: http://survey.internationalbudget.org

Developed in collaboration between the [International Budget Partnership](http://internationalbudget.org) and the [Open Knowledge Foundation](http://okfn.org). Written by [Tom Rees](http://github.com/zephod), [Hélène Durand](http://github.com/hdurand), [Tryggvi Björgvinsson](http://github.com/trickvi), and [Damjan Velickovski](https://github.com/dumyan).

## Setup & Deployment

This codebase contains two separate web applications which function together from the end-user perspective.
The two web applications are *explorer* and *tracker*. They are logically separated in the code and served together
trough [Node.js](http://nodejs.org) on different routes (*explorer* is the biggest part of the web application and
it is served on the root route - `/` and *tracker* is the 'Document Availability' page and it is served on the `/availability` route.)

This is a web application developed using [Brunch](http://brunch.io) and [webpack](https://webpack.github.io/). To run locally:

* Clone this repository. 
* Install [Node.js](http://nodejs.org).
* Set the environment variables needed for [ibp-explorer-data-client](https://github.com/okfn/ibp-explorer-data-client) in `.env`.
* Run `npm install` in the root directory of this repo to install dependencies.
* Run `npm run build:dev` to bundle the front-end for the explorer and build the tracker. If you want to watch for code changes use `npm run build:dev:watch`. This will also start the server.
  * Run `npm run build:dev:tracker` or `npm run build:dev:tracker:watch` to do the same **only** for the tracker.
  * Run `npm run build:dev:explorer` or `npm run build:dev:explorer:watch` to do the same **only** for the explorer.
* Run `npm run start` to start the node server.
* Point your browser at http://localhost:3000

To deploy:

* Get the above working.
* Kill any running processes from `ibp-explorer`.
* Set production `PORT`
* Run `npm run build:prod`. This will build minified version of the tracker and the explorer.

### Environment variables:

* `PORT` - port on which the server will listen. Default is 3000.
* 'TRACKER_LAST_UPDATE' - date to be displayed on the Availability page when the last API update occured

You will need to set additional environment variables needed by [ibp-explorer-data-client](https://github.com/okfn/ibp-explorer-data-client)

* For calls to Indaba API
  * **API_BASE** - Base URL for the API
  * **API_USERNMAE** - Username for the API
  * **API_PASSWORD** - Password for the API
* Google Drive files/folders 
  * **SERVICE_CREDENTIALS** - Google Service JSON token. You can do ``export SERVICE_CREDENTIALS=`cat <path_to_credentials.json>` ``
  * **DRIVE_ROOT** - Which gdrive folder serves as root when searching for documents
* AWS S3 storage
  * **AWS_ACCESS_KEY_ID** - Your access key
  * **AWS_SECRET_ACCESS_KEY** - Your secret access key
  * **AWS_REGION** - Region where the bucket is
  * **AWS_BUCKET** - Name of the bucket where to store snapshots
* Google Drive Libray reindexing
  * **DRIVE_ROOT** - ID of the root where the documents should be searched
  * **SPREADSHEET_ID** - ID of the spreadsheet where the found documents should be written

To test:

* Run webpack-dev-server with `npm run start`
* Run `npm run test`

## Updating the explorer data

All the data lives in the `./data` folder, along with a Pythin tool to Extract-Transform-Load it through a complicated data-massage. Outputs are:

* `./vendor/ibp_dataset.js` which is used by the javascript datatool.
* `./app/assets/downloads/` which is filled with downloadable files.

To update the data:

* Modify the Excel files in the `./data` folder.

To get those changes processed by the tool:

* Get Python set up on your system.
* Install [Pip](http://pypi.python.org/pypi/pip), the Python package manager.
* `pip install openpyxl`
* `pip install unicodecsv`
* `pip install xlrd`
* You're all set up. Run `python etl.py` to update the tool.
* Run the tool locally to prove it works. 
* Follow the above deployment instructions to get it ready for a live server.


## Updating the tracker translations

* `npm run extract-pot` to extract all the strings for translations into a .pot file
* `npm run merge-po` to merge the new strings for translation into the existing po files
* Update the translations in the .po files
* `npm run compile-json` to compile the .po files to json message files which the app uses