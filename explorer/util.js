'use strict'

import _ from 'underscore'
import _s from 'underscore.string'

function sortFunction(a, b) {
  let x = b.score - a.score
  if (!x) {
    return a.country.localeCompare(b.country)
  }
  return x
}

function sortFunctionByName(a, b) {
  let x = a.country.localeCompare(b.country)
  if (!x) {
    x = b.score - a.score
  }
  return x
}

// Filter out countries in this list from _EXPLORER_DATASET
const COUNTRY_EXCLUDE_LIST = [
  ['BF', '2006']
  , ['BO', '2006']
  , ['BW', '2006']
  , ['CM', '2006']
  , ['DZ', '2006']
  , ['EC', '2006']
  , ['HN', '2006']
  , ['KE', '2006']
  , ['KR', '2006']
  , ['KZ', '2006']
  , ['MW', '2006']
  , ['NI', '2006']
  , ['PE', '2006']
  , ['PK', '2006']
  , ['PL', '2006']
  , ['SI', '2006']
  , ['TD', '2006']
  , ['TZ', '2006']
  , ['ZM', '2006']
  , ['BF', '2008']
  , ['BW', '2008']
  , ['EC', '2008']
  , ['KE', '2008']
  , ['NI', '2008']
  , ['SD', '2008']
  , ['TD', '2008']
  , ['ZM', '2008']
  , ['SD', '2010']
]

const mungeExplorerDataset = function (EXPLORER_DATASET) {
  /*
  Makes several changes to the passed EXPLORER_DATASET object:

  - remove excluded countries for each EXPLORER_DATASET.country_* object
  - assign an id to all groupings
  - tag questions with parent group ids
  - add an 'entire_world' region
  */


    // Store excluded countries
  const explorerDataset = EXPLORER_DATASET
  explorerDataset.excluded_country = []
  explorerDataset.excluded_country_old = []

  const pruneCountry = function (countryList, excludedCountryList, excluded, year) {
    /*
    Remove `db_${year}` from the passed `excluded` country. If no `db_${year}`
    properties are left, remove the country. Excluded country data is added to
    an `_excluded_country[_old]` array, so pages have access to it if necessary
    (e.g. availabilityHistorical.js uses it).
    */

    const country = _.find(countryList, c => c.alpha2 === excluded)
    if (country[`db_${year}`] !== undefined) {
      let excludedCountry = _.find(excludedCountryList, c => c.alpha2 === excluded)
      if (!excludedCountry) {
        excludedCountry = {
          alpha2: country.alpha2
          , name: country.name
        }
        excludedCountryList.push(excludedCountry)
      }
      excludedCountry[`db_${year}`] = _.clone(country[`db_${year}`])
      delete country[`db_${year}`]
    }

    const countryKeys = _.keys(country)
    if (!_.some(countryKeys, k => _s.startsWith(k, 'db_'))) {
      countryList = _.reject(countryList, c => c.alpha2 === excluded)
    }

    return countryList
  }

  // Remove excluded country/years from `country_old`
  // Country keys in explorerDataset
  const countryKeys = _.filter(_.keys(explorerDataset),
                              key => key.startsWith('country_'))
  _.each(COUNTRY_EXCLUDE_LIST, excluded => {
    _.each(countryKeys, countryKey => {
      const excludedCountryKey = `excluded_${countryKey}`
      explorerDataset[countryKey]
        = pruneCountry(explorerDataset[countryKey],
                       explorerDataset[excludedCountryKey],
                       excluded[0], excluded[1])
    })
  })

  // 2015 survey dataset
  // Assign an ID to all groupings
  let id = 0
  _.forEach(explorerDataset.groupings_2015, (x) => {
    _.forEach(x.entries, (y) => {
      y.group_id = id++
    })
  })
  id = 0
  _.forEach(explorerDataset.question_2015, (qdata, qnum) => {
    qdata.groups = []
    // Tag the question with a list of parent groups
    _.forEach(explorerDataset.groupings_2015, (category) => {
      _.forEach(category.entries, (group) => {
        if (_.contains(group.qs, qnum)) {
          qdata.groups.push('group-'+group.group_id)
        }
      })
    })
  })
  // Create an 'Entire World' region
  let entire_world = {
    name: 'Entire World',
    contains: []
  }
  _.forEach(explorerDataset.country_2015, (country) => {
    entire_world.contains.push(country.alpha2)
  })
  explorerDataset.regions_2015.unshift(entire_world)
  // Attach a region_index to each region
  _.forEach(explorerDataset.regions_2015, (element, index) => {
    element.region_index = parseInt(index)
  })

  // Pre-2015 survey dataset
  // Assign an ID to all groupings
  id = 0
  _.forEach(explorerDataset.groupings_old, (x) => {
    _.forEach(x.entries, (y) => {
      y.group_id = id++
    })
  })
  // Assign group IDs to all questions
  id = 0
  _.forEach(explorerDataset.question_old, (qdata, qnum) => {
    qdata.groups = []
    // Tag the question with a list of parent groups
    _.forEach(explorerDataset.groupings_old, (category) => {
      _.forEach(category.entries, (group) => {
        if (_.contains(group.qs, qnum)) {
          qdata.groups.push('group-'+group.group_id)
        }
      })
    })
  })
  // Create an 'Entire World' region
  entire_world = {
    name: 'Entire World'
    , contains: []
  }
  _.forEach(explorerDataset.country_old, (country) => {
    entire_world.contains.push(country.alpha2)
  })
  explorerDataset.regions_old.unshift(entire_world)
  // Attach a region_index to each region
  _.forEach(explorerDataset.regions_old, (element, index) => {
    element.region_index = parseInt(index)
  })

  return explorerDataset
}


export  {
  sortFunction,
  sortFunctionByName,
  mungeExplorerDataset
}
