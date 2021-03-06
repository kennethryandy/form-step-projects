[{
	"name": "read_data",
	"file_name": "ne_10m_admin_1_states_provinces_lakes/ne_10m_admin_1_states_provinces_lakes.shp",
	"filter": "iso_a2 = \"AU\" AND iso_3166_2 IS NOT NULL"
  },{
	"name": "join_data",
	"data": [
		["2573", "AU-NSW"],
		["6323", "AU-QLD"],
		["2555", "AU-SA"],
		["2553", "AU-TAS"],
		["2554", "AU-VIC"],
		["6322", "AU-WA"],
		["2572", "AU-ACT"],
		["6324", "AU-NT"]
	],
	"fields": [{
		"name": "OBJECTID_1",
		"type": 4,
		"width": 9
	},{
		"name": "iso_3166_2",
		"type": 4,
		"width": 10
	}],
	"on": "OBJECTID_1"
  },{
	"name": "write_data",
	"format": "jvectormap",
	"params": {
	  "code_field": "iso_3166_2",
	  "name_field": "name",
	  "name": "au"
	}
}]