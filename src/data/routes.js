// Route segments for each journey
// Each route contains detailed segments with intermediate cities and transport modes.
// Extracted from official Amtrak timetable data

export const routes = {
  // ============================================================================
  // CALIFORNIA ZEPHYR (August 2021)
  // ============================================================================
  "california-zephyr-2021-08": {
    journeyId: "california-zephyr-2021-08",
    segments: [
      { order: 1, from: { name: "Chicago, IL", lat: 41.8789, lng: -87.6397 }, to: { name: "Naperville, IL", lat: 41.7729, lng: -88.1479 } },
      { order: 2, from: { name: "Naperville, IL", lat: 41.7729, lng: -88.1479 }, to: { name: "Princeton, IL", lat: 41.3681, lng: -89.4648 } },
      { order: 3, from: { name: "Princeton, IL", lat: 41.3681, lng: -89.4648 }, to: { name: "Galesburg, IL", lat: 40.9478, lng: -90.3712 } },
      { order: 4, from: { name: "Galesburg, IL", lat: 40.9478, lng: -90.3712 }, to: { name: "Burlington, IA", lat: 40.8078, lng: -91.1129 } },
      { order: 5, from: { name: "Burlington, IA", lat: 40.8078, lng: -91.1129 }, to: { name: "Mt. Pleasant, IA", lat: 40.9635, lng: -91.5582 } },
      { order: 6, from: { name: "Mt. Pleasant, IA", lat: 40.9635, lng: -91.5582 }, to: { name: "Ottumwa, IA", lat: 41.0197, lng: -92.4113 } },
      { order: 7, from: { name: "Ottumwa, IA", lat: 41.0197, lng: -92.4113 }, to: { name: "Osceola, IA", lat: 41.0339, lng: -93.7655 } },
      { order: 8, from: { name: "Osceola, IA", lat: 41.0339, lng: -93.7655 }, to: { name: "Creston, IA", lat: 41.0586, lng: -94.3614 } },
      { order: 9, from: { name: "Creston, IA", lat: 41.0586, lng: -94.3614 }, to: { name: "Omaha, NE", lat: 41.2587, lng: -95.9379 } },
      { order: 10, from: { name: "Omaha, NE", lat: 41.2587, lng: -95.9379 }, to: { name: "Lincoln, NE", lat: 40.8001, lng: -96.6674 } },
      { order: 11, from: { name: "Lincoln, NE", lat: 40.8001, lng: -96.6674 }, to: { name: "Hastings, NE", lat: 40.5861, lng: -98.3881 } },
      { order: 12, from: { name: "Hastings, NE", lat: 40.5861, lng: -98.3881 }, to: { name: "Holdrege, NE", lat: 40.4403, lng: -99.3704 } },
      { order: 13, from: { name: "Holdrege, NE", lat: 40.4403, lng: -99.3704 }, to: { name: "McCook, NE", lat: 40.2025, lng: -100.6254 } },
      { order: 14, from: { name: "McCook, NE", lat: 40.2025, lng: -100.6254 }, to: { name: "Fort Morgan, CO", lat: 40.2503, lng: -103.7999 } },
      { order: 15, from: { name: "Fort Morgan, CO", lat: 40.2503, lng: -103.7999 }, to: { name: "Denver, CO", lat: 39.7348, lng: -104.9653 } },
      { order: 16, from: { name: "Denver, CO", lat: 39.7348, lng: -104.9653 }, to: { name: "Fraser-Winter Park, CO", lat: 39.9442, lng: -105.8172 } },
      { order: 17, from: { name: "Fraser-Winter Park, CO", lat: 39.9442, lng: -105.8172 }, to: { name: "Granby, CO", lat: 40.0861, lng: -105.9395 } },
      { order: 18, from: { name: "Granby, CO", lat: 40.0861, lng: -105.9395 }, to: { name: "Glenwood Springs, CO", lat: 39.5507, lng: -107.3255 } },
      { order: 19, from: { name: "Glenwood Springs, CO", lat: 39.5507, lng: -107.3255 }, to: { name: "Grand Junction, CO", lat: 39.064, lng: -108.5507 } },
      { order: 20, from: { name: "Grand Junction, CO", lat: 39.064, lng: -108.5507 }, to: { name: "Green River, UT", lat: 38.9886, lng: -110.1504 } },
      { order: 21, from: { name: "Green River, UT", lat: 38.9886, lng: -110.1504 }, to: { name: "Helper, UT", lat: 39.6841, lng: -110.8546 } },
      { order: 22, from: { name: "Helper, UT", lat: 39.6841, lng: -110.8546 }, to: { name: "Provo, UT", lat: 40.2338, lng: -111.6585 } },
      { order: 23, from: { name: "Provo, UT", lat: 40.2338, lng: -111.6585 }, to: { name: "Salt Lake City, UT", lat: 40.767, lng: -111.8904 } },
      { order: 24, from: { name: "Salt Lake City, UT", lat: 40.767, lng: -111.8904 }, to: { name: "Elko, NV", lat: 40.8324, lng: -115.7631 } },
      { order: 25, from: { name: "Elko, NV", lat: 40.8324, lng: -115.7631 }, to: { name: "Winnemucca, NV", lat: 40.9730, lng: -117.7357 } },
      { order: 26, from: { name: "Winnemucca, NV", lat: 40.9730, lng: -117.7357 }, to: { name: "Reno, NV", lat: 39.5293, lng: -119.8137 } },
      { order: 27, from: { name: "Reno, NV", lat: 39.5293, lng: -119.8137 }, to: { name: "Truckee, CA", lat: 39.3280, lng: -120.1833 } },
      { order: 28, from: { name: "Truckee, CA", lat: 39.3280, lng: -120.1833 }, to: { name: "Colfax, CA", lat: 39.1007, lng: -120.9533 } },
      { order: 29, from: { name: "Colfax, CA", lat: 39.1007, lng: -120.9533 }, to: { name: "Roseville, CA", lat: 38.7521, lng: -121.2880 } },
      { order: 30, from: { name: "Roseville, CA", lat: 38.7521, lng: -121.2880 }, to: { name: "Sacramento, CA", lat: 38.581021, lng: -121.4939328 } },
      { order: 31, from: { name: "Sacramento, CA", lat: 38.581021, lng: -121.4939328 }, to: { name: "Davis, CA", lat: 38.5449, lng: -121.7405 } },
      { order: 32, from: { name: "Davis, CA", lat: 38.5449, lng: -121.7405 }, to: { name: "Martinez, CA", lat: 38.0194, lng: -122.1341 } },
      { order: 33, from: { name: "Martinez, CA", lat: 38.0194, lng: -122.1341 }, to: { name: "Richmond, CA", lat: 37.9358, lng: -122.3477 } },
      { order: 34, from: { name: "Richmond, CA", lat: 37.9358, lng: -122.3477 }, to: { name: "Emeryville, CA", lat: 37.8314, lng: -122.2865 } },
      { order: 35, from: { name: "Emeryville, CA", lat: 37.8314, lng: -122.2865 }, to: { name: "San Francisco, CA", lat: 37.7749, lng: -122.4194 } }
    ]
  },

  // ============================================================================
  // EMPIRE BUILDER (August 2021)
  // ============================================================================
  "empire-builder-2021-08": {
    journeyId: "empire-builder-2021-08",
    segments: [
      { order: 1, from: { name: "Portland, OR", lat: 45.5288, lng: -122.6764 }, to: { name: "Vancouver, WA", lat: 45.6387, lng: -122.6615 } },
      { order: 2, from: { name: "Vancouver, WA", lat: 45.6387, lng: -122.6615 }, to: { name: "Bingen-White Salmon, WA", lat: 45.7151, lng: -121.4698 } },
      { order: 3, from: { name: "Bingen-White Salmon, WA", lat: 45.7151, lng: -121.4698 }, to: { name: "Wishram, WA", lat: 45.6590, lng: -120.9626 } },
      { order: 4, from: { name: "Wishram, WA", lat: 45.6590, lng: -120.9626 }, to: { name: "Pasco, WA", lat: 46.2396, lng: -119.1006 } },
      { order: 5, from: { name: "Pasco, WA", lat: 46.2396, lng: -119.1006 }, to: { name: "Spokane, WA", lat: 47.6588, lng: -117.4260 } },
      { order: 6, from: { name: "Spokane, WA", lat: 47.6588, lng: -117.4260 }, to: { name: "Sandpoint, ID", lat: 48.2766, lng: -116.5533 } },
      { order: 7, from: { name: "Sandpoint, ID", lat: 48.2766, lng: -116.5533 }, to: { name: "Libby, MT", lat: 48.3883, lng: -115.5558 } },
      { order: 8, from: { name: "Libby, MT", lat: 48.3883, lng: -115.5558 }, to: { name: "Whitefish, MT", lat: 48.4108, lng: -114.3378 } },
      { order: 9, from: { name: "Whitefish, MT", lat: 48.4108, lng: -114.3378 }, to: { name: "West Glacier, MT", lat: 48.4970, lng: -113.9764 } },
      { order: 10, from: { name: "West Glacier, MT", lat: 48.4970, lng: -113.9764 }, to: { name: "Essex, MT", lat: 48.2919, lng: -113.6169 } },
      { order: 11, from: { name: "Essex, MT", lat: 48.2919, lng: -113.6169 }, to: { name: "East Glacier Park, MT", lat: 48.4475, lng: -113.2106 } },
      { order: 12, from: { name: "East Glacier Park, MT", lat: 48.4475, lng: -113.2106 }, to: { name: "Browning, MT", lat: 48.5569, lng: -113.0134 } },
      { order: 13, from: { name: "Browning, MT", lat: 48.5569, lng: -113.0134 }, to: { name: "Cut Bank, MT", lat: 48.6333, lng: -112.3261 } },
      { order: 14, from: { name: "Cut Bank, MT", lat: 48.6333, lng: -112.3261 }, to: { name: "Shelby, MT", lat: 48.5086, lng: -111.8558 } },
      { order: 15, from: { name: "Shelby, MT", lat: 48.5086, lng: -111.8558 }, to: { name: "Havre, MT", lat: 48.5500, lng: -109.6841 } },
      { order: 16, from: { name: "Havre, MT", lat: 48.5500, lng: -109.6841 }, to: { name: "Malta, MT", lat: 48.3600, lng: -107.8697 } },
      { order: 17, from: { name: "Malta, MT", lat: 48.3600, lng: -107.8697 }, to: { name: "Glasgow, MT", lat: 48.1969, lng: -106.6367 } },
      { order: 18, from: { name: "Glasgow, MT", lat: 48.1969, lng: -106.6367 }, to: { name: "Wolf Point, MT", lat: 48.0906, lng: -105.6408 } },
      { order: 19, from: { name: "Wolf Point, MT", lat: 48.0906, lng: -105.6408 }, to: { name: "Williston, ND", lat: 48.1470, lng: -103.6180 } },
      { order: 20, from: { name: "Williston, ND", lat: 48.1470, lng: -103.6180 }, to: { name: "Stanley, ND", lat: 48.3197, lng: -102.3910 } },
      { order: 21, from: { name: "Stanley, ND", lat: 48.3197, lng: -102.3910 }, to: { name: "Minot, ND", lat: 48.2330, lng: -101.2960 } },
      { order: 22, from: { name: "Minot, ND", lat: 48.2330, lng: -101.2960 }, to: { name: "Rugby, ND", lat: 48.3689, lng: -99.9962 } },
      { order: 23, from: { name: "Rugby, ND", lat: 48.3689, lng: -99.9962 }, to: { name: "Devils Lake, ND", lat: 48.1128, lng: -98.8651 } },
      { order: 24, from: { name: "Devils Lake, ND", lat: 48.1128, lng: -98.8651 }, to: { name: "Grand Forks, ND", lat: 47.9253, lng: -97.0329 } },
      { order: 25, from: { name: "Grand Forks, ND", lat: 47.9253, lng: -97.0329 }, to: { name: "Fargo, ND", lat: 46.8772, lng: -96.7898 } },
      { order: 26, from: { name: "Fargo, ND", lat: 46.8772, lng: -96.7898 }, to: { name: "Detroit Lakes, MN", lat: 46.8172, lng: -95.8453 } },
      { order: 27, from: { name: "Detroit Lakes, MN", lat: 46.8172, lng: -95.8453 }, to: { name: "Staples, MN", lat: 46.3569, lng: -94.7908 } },
      { order: 28, from: { name: "Staples, MN", lat: 46.3569, lng: -94.7908 }, to: { name: "St. Cloud, MN", lat: 45.5608, lng: -94.1622 } },
      { order: 29, from: { name: "St. Cloud, MN", lat: 45.5608, lng: -94.1622 }, to: { name: "St. Paul-Minneapolis, MN", lat: 44.9537, lng: -93.0900 } },
      { order: 30, from: { name: "St. Paul-Minneapolis, MN", lat: 44.9537, lng: -93.0900 }, to: { name: "Red Wing, MN", lat: 44.5625, lng: -92.5338 } },
      { order: 31, from: { name: "Red Wing, MN", lat: 44.5625, lng: -92.5338 }, to: { name: "Winona, MN", lat: 44.0498, lng: -91.6393 } },
      { order: 32, from: { name: "Winona, MN", lat: 44.0498, lng: -91.6393 }, to: { name: "La Crosse, WI", lat: 43.8014, lng: -91.2396 } },
      { order: 33, from: { name: "La Crosse, WI", lat: 43.8014, lng: -91.2396 }, to: { name: "Tomah, WI", lat: 43.9747, lng: -90.5040 } },
      { order: 34, from: { name: "Tomah, WI", lat: 43.9747, lng: -90.5040 }, to: { name: "Wisconsin Dells, WI", lat: 43.6275, lng: -89.7710 } },
      { order: 35, from: { name: "Wisconsin Dells, WI", lat: 43.6275, lng: -89.7710 }, to: { name: "Portage, WI", lat: 43.5391, lng: -89.4626 } },
      { order: 36, from: { name: "Portage, WI", lat: 43.5391, lng: -89.4626 }, to: { name: "Columbus, WI", lat: 43.3372, lng: -89.0151 } },
      { order: 37, from: { name: "Columbus, WI", lat: 43.3372, lng: -89.0151 }, to: { name: "Milwaukee, WI", lat: 43.0389, lng: -87.9065 } },
      { order: 38, from: { name: "Milwaukee, WI", lat: 43.0389, lng: -87.9065 }, to: { name: "Glenview, IL", lat: 42.0834, lng: -87.7884 } },
      { order: 39, from: { name: "Glenview, IL", lat: 42.0834, lng: -87.7884 }, to: { name: "Chicago, IL", lat: 41.8789, lng: -87.6397 } }
    ]
  },

  // ============================================================================
  // SOUTHWEST CHIEF (August 2021)
  // ============================================================================
  "southwest-chief-2021-08": {
    journeyId: "southwest-chief-2021-08",
    segments: [
      { order: 1, from: { name: "Chicago, IL", lat: 41.8781, lng: -87.6298 }, to: { name: "Naperville, IL", lat: 41.7508, lng: -88.1535 } },
      { order: 2, from: { name: "Naperville, IL", lat: 41.7508, lng: -88.1535 }, to: { name: "Mendota, IL", lat: 41.5473, lng: -89.1176 } },
      { order: 3, from: { name: "Mendota, IL", lat: 41.5473, lng: -89.1176 }, to: { name: "Princeton, IL", lat: 41.3681, lng: -89.4648 } },
      { order: 4, from: { name: "Princeton, IL", lat: 41.3681, lng: -89.4648 }, to: { name: "Galesburg, IL", lat: 40.9478, lng: -90.3712 } },
      { order: 5, from: { name: "Galesburg, IL", lat: 40.9478, lng: -90.3712 }, to: { name: "Fort Madison, IA", lat: 40.6298, lng: -91.3157 } },
      { order: 6, from: { name: "Fort Madison, IA", lat: 40.6298, lng: -91.3157 }, to: { name: "La Plata, MO", lat: 40.0264, lng: -92.4913 } },
      { order: 7, from: { name: "La Plata, MO", lat: 40.0264, lng: -92.4913 }, to: { name: "Kansas City, MO", lat: 39.0997, lng: -94.5786 } },
      { order: 8, from: { name: "Kansas City, MO", lat: 39.0997, lng: -94.5786 }, to: { name: "Lawrence, KS", lat: 38.9717, lng: -95.2353 } },
      { order: 9, from: { name: "Lawrence, KS", lat: 38.9717, lng: -95.2353 }, to: { name: "Topeka, KS", lat: 39.0473, lng: -95.6752 } },
      { order: 10, from: { name: "Topeka, KS", lat: 39.0473, lng: -95.6752 }, to: { name: "Newton, KS", lat: 38.0467, lng: -97.3450 } },
      { order: 11, from: { name: "Newton, KS", lat: 38.0467, lng: -97.3450 }, to: { name: "Hutchinson, KS", lat: 38.0608, lng: -97.9298 } },
      { order: 12, from: { name: "Hutchinson, KS", lat: 38.0608, lng: -97.9298 }, to: { name: "Dodge City, KS", lat: 37.7528, lng: -100.0171 } },
      { order: 13, from: { name: "Dodge City, KS", lat: 37.7528, lng: -100.0171 }, to: { name: "Garden City, KS", lat: 37.9717, lng: -100.8726 } },
      { order: 14, from: { name: "Garden City, KS", lat: 37.9717, lng: -100.8726 }, to: { name: "Lamar, CO", lat: 38.0872, lng: -102.6202 } },
      { order: 15, from: { name: "Lamar, CO", lat: 38.0872, lng: -102.6202 }, to: { name: "La Junta, CO", lat: 37.9847, lng: -103.5441 } },
      { order: 16, from: { name: "La Junta, CO", lat: 37.9847, lng: -103.5441 }, to: { name: "Trinidad, CO", lat: 37.1695, lng: -104.5005 } },
      { order: 17, from: { name: "Trinidad, CO", lat: 37.1695, lng: -104.5005 }, to: { name: "Raton, NM", lat: 36.9033, lng: -104.4391 } },
      { order: 18, from: { name: "Raton, NM", lat: 36.9033, lng: -104.4391 }, to: { name: "Las Vegas, NM", lat: 35.5939, lng: -105.2239 } },
      { order: 19, from: { name: "Las Vegas, NM", lat: 35.5939, lng: -105.2239 }, to: { name: "Lamy, NM", lat: 35.4850, lng: -105.8814 } },
      { order: 20, from: { name: "Lamy, NM", lat: 35.4850, lng: -105.8814 }, to: { name: "Albuquerque, NM", lat: 35.0844, lng: -106.6504 } },
      { order: 21, from: { name: "Albuquerque, NM", lat: 35.0844, lng: -106.6504 }, to: { name: "Gallup, NM", lat: 35.5281, lng: -108.7426 } },
      { order: 22, from: { name: "Gallup, NM", lat: 35.5281, lng: -108.7426 }, to: { name: "Winslow, AZ", lat: 35.0242, lng: -110.6974 } },
      { order: 23, from: { name: "Winslow, AZ", lat: 35.0242, lng: -110.6974 }, to: { name: "Flagstaff, AZ", lat: 35.1983, lng: -111.6513 } },
      { order: 24, from: { name: "Flagstaff, AZ", lat: 35.1983, lng: -111.6513 }, to: { name: "Kingman, AZ", lat: 35.1894, lng: -114.0530 } },
      { order: 25, from: { name: "Kingman, AZ", lat: 35.1894, lng: -114.0530 }, to: { name: "Needles, CA", lat: 34.8481, lng: -114.6141 } },
      { order: 26, from: { name: "Needles, CA", lat: 34.8481, lng: -114.6141 }, to: { name: "Barstow, CA", lat: 34.8958, lng: -117.0228 } },
      { order: 27, from: { name: "Barstow, CA", lat: 34.8958, lng: -117.0228 }, to: { name: "Victorville, CA", lat: 34.5362, lng: -117.2928 } },
      { order: 28, from: { name: "Victorville, CA", lat: 34.5362, lng: -117.2928 }, to: { name: "San Bernardino, CA", lat: 34.1083, lng: -117.2898 } },
      { order: 29, from: { name: "San Bernardino, CA", lat: 34.1083, lng: -117.2898 }, to: { name: "Riverside, CA", lat: 33.9533, lng: -117.3962 } },
      { order: 30, from: { name: "Riverside, CA", lat: 33.9533, lng: -117.3962 }, to: { name: "Fullerton, CA", lat: 33.8703, lng: -117.9253 } },
      { order: 31, from: { name: "Fullerton, CA", lat: 33.8703, lng: -117.9253 }, to: { name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 } }
    ]
  },

  // ============================================================================
  // TEXAS EAGLE (September 2020)
  // ============================================================================
  "texas-eagle-2020-09": {
    journeyId: "texas-eagle-2020-09",
    segments: [
      { order: 1, from: { name: "Chicago, IL", lat: 41.8781, lng: -87.6298 }, to: { name: "Joliet, IL", lat: 41.5250, lng: -88.0817 } },
      { order: 2, from: { name: "Joliet, IL", lat: 41.5250, lng: -88.0817 }, to: { name: "Pontiac, IL", lat: 40.8808, lng: -88.6298 } },
      { order: 3, from: { name: "Pontiac, IL", lat: 40.8808, lng: -88.6298 }, to: { name: "Bloomington-Normal, IL", lat: 40.4842, lng: -88.9937 } },
      { order: 4, from: { name: "Bloomington-Normal, IL", lat: 40.4842, lng: -88.9937 }, to: { name: "Lincoln, IL", lat: 40.1481, lng: -89.3648 } },
      { order: 5, from: { name: "Lincoln, IL", lat: 40.1481, lng: -89.3648 }, to: { name: "Springfield, IL", lat: 39.7817, lng: -89.6501 } },
      { order: 6, from: { name: "Springfield, IL", lat: 39.7817, lng: -89.6501 }, to: { name: "Carlinville, IL", lat: 39.2797, lng: -89.8817 } },
      { order: 7, from: { name: "Carlinville, IL", lat: 39.2797, lng: -89.8817 }, to: { name: "Alton, IL", lat: 38.8906, lng: -90.1843 } },
      { order: 8, from: { name: "Alton, IL", lat: 38.8906, lng: -90.1843 }, to: { name: "St. Louis, MO", lat: 38.6270, lng: -90.1994 } },
      { order: 9, from: { name: "St. Louis, MO", lat: 38.6270, lng: -90.1994 }, to: { name: "Arcadia, MO", lat: 37.5850, lng: -90.6262 } },
      { order: 10, from: { name: "Arcadia, MO", lat: 37.5850, lng: -90.6262 }, to: { name: "Poplar Bluff, MO", lat: 36.7570, lng: -90.3929 } },
      { order: 11, from: { name: "Poplar Bluff, MO", lat: 36.7570, lng: -90.3929 }, to: { name: "Walnut Ridge, AR", lat: 36.0687, lng: -90.9593 } },
      { order: 12, from: { name: "Walnut Ridge, AR", lat: 36.0687, lng: -90.9593 }, to: { name: "Little Rock, AR", lat: 34.7465, lng: -92.2896 } },
      { order: 13, from: { name: "Little Rock, AR", lat: 34.7465, lng: -92.2896 }, to: { name: "Malvern, AR", lat: 34.3623, lng: -92.8132 } },
      { order: 14, from: { name: "Malvern, AR", lat: 34.3623, lng: -92.8132 }, to: { name: "Arkadelphia, AR", lat: 34.1209, lng: -93.0538 } },
      { order: 15, from: { name: "Arkadelphia, AR", lat: 34.1209, lng: -93.0538 }, to: { name: "Hope, AR", lat: 33.6670, lng: -93.5916 } },
      { order: 16, from: { name: "Hope, AR", lat: 33.6670, lng: -93.5916 }, to: { name: "Texarkana, AR/TX", lat: 33.4418, lng: -94.0377 } },
      { order: 17, from: { name: "Texarkana, AR/TX", lat: 33.4418, lng: -94.0377 }, to: { name: "Marshall, TX", lat: 32.5448, lng: -94.3677 } },
      { order: 18, from: { name: "Marshall, TX", lat: 32.5448, lng: -94.3677 }, to: { name: "Longview, TX", lat: 32.5007, lng: -94.7404 } },
      { order: 19, from: { name: "Longview, TX", lat: 32.5007, lng: -94.7404 }, to: { name: "Mineola, TX", lat: 32.6632, lng: -95.4883 } },
      { order: 20, from: { name: "Mineola, TX", lat: 32.6632, lng: -95.4883 }, to: { name: "Dallas, TX", lat: 32.7767, lng: -96.7970 } },
      { order: 21, from: { name: "Dallas, TX", lat: 32.7767, lng: -96.7970 }, to: { name: "Fort Worth, TX", lat: 32.7555, lng: -97.3308 } },
      { order: 22, from: { name: "Fort Worth, TX", lat: 32.7555, lng: -97.3308 }, to: { name: "Cleburne, TX", lat: 32.3476, lng: -97.3867 } },
      { order: 23, from: { name: "Cleburne, TX", lat: 32.3476, lng: -97.3867 }, to: { name: "McGregor, TX", lat: 31.4443, lng: -97.4092 } },
      { order: 24, from: { name: "McGregor, TX", lat: 31.4443, lng: -97.4092 }, to: { name: "Temple, TX", lat: 31.0982, lng: -97.3428 } },
      { order: 25, from: { name: "Temple, TX", lat: 31.0982, lng: -97.3428 }, to: { name: "Taylor, TX", lat: 30.5705, lng: -97.4092 } },
      { order: 26, from: { name: "Taylor, TX", lat: 30.5705, lng: -97.4092 }, to: { name: "Austin, TX", lat: 30.2672, lng: -97.7431 } },
      { order: 27, from: { name: "Austin, TX", lat: 30.2672, lng: -97.7431 }, to: { name: "San Marcos, TX", lat: 29.8833, lng: -97.9414 } },
      { order: 28, from: { name: "San Marcos, TX", lat: 29.8833, lng: -97.9414 }, to: { name: "San Antonio, TX", lat: 29.4241, lng: -98.4936 } }
    ]
  },

  // ============================================================================
  // CRESCENT (August 2020)
  // ============================================================================
  "crescent-2020-08": {
    journeyId: "crescent-2020-08",
    segments: [
      { order: 1, from: { name: "New York, NY", lat: 40.7128, lng: -74.0060 }, to: { name: "Newark, NJ", lat: 40.7357, lng: -74.1724 } },
      { order: 2, from: { name: "Newark, NJ", lat: 40.7357, lng: -74.1724 }, to: { name: "Metropark, NJ", lat: 40.5662, lng: -74.3218 } },
      { order: 3, from: { name: "Metropark, NJ", lat: 40.5662, lng: -74.3218 }, to: { name: "Trenton, NJ", lat: 40.2206, lng: -74.7597 } },
      { order: 4, from: { name: "Trenton, NJ", lat: 40.2206, lng: -74.7597 }, to: { name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 } },
      { order: 5, from: { name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 }, to: { name: "Wilmington, DE", lat: 39.7391, lng: -75.5398 } },
      { order: 6, from: { name: "Wilmington, DE", lat: 39.7391, lng: -75.5398 }, to: { name: "Baltimore, MD", lat: 39.2904, lng: -76.6122 } },
      { order: 7, from: { name: "Baltimore, MD", lat: 39.2904, lng: -76.6122 }, to: { name: "Washington, DC", lat: 38.9072, lng: -77.0369 } },
      { order: 8, from: { name: "Washington, DC", lat: 38.9072, lng: -77.0369 }, to: { name: "Alexandria, VA", lat: 38.8048, lng: -77.0469 } },
      { order: 9, from: { name: "Alexandria, VA", lat: 38.8048, lng: -77.0469 }, to: { name: "Manassas, VA", lat: 38.7509, lng: -77.4753 } },
      { order: 10, from: { name: "Manassas, VA", lat: 38.7509, lng: -77.4753 }, to: { name: "Culpeper, VA", lat: 38.4732, lng: -77.9966 } },
      { order: 11, from: { name: "Culpeper, VA", lat: 38.4732, lng: -77.9966 }, to: { name: "Charlottesville, VA", lat: 38.0293, lng: -78.4767 } },
      { order: 12, from: { name: "Charlottesville, VA", lat: 38.0293, lng: -78.4767 }, to: { name: "Lynchburg, VA", lat: 37.4138, lng: -79.1422 } },
      { order: 13, from: { name: "Lynchburg, VA", lat: 37.4138, lng: -79.1422 }, to: { name: "Danville, VA", lat: 36.5860, lng: -79.3950 } },
      { order: 14, from: { name: "Danville, VA", lat: 36.5860, lng: -79.3950 }, to: { name: "Greensboro, NC", lat: 36.0726, lng: -79.7920 } },
      { order: 15, from: { name: "Greensboro, NC", lat: 36.0726, lng: -79.7920 }, to: { name: "High Point, NC", lat: 35.9557, lng: -80.0053 } },
      { order: 16, from: { name: "High Point, NC", lat: 35.9557, lng: -80.0053 }, to: { name: "Salisbury, NC", lat: 35.6704, lng: -80.4742 } },
      { order: 17, from: { name: "Salisbury, NC", lat: 35.6704, lng: -80.4742 }, to: { name: "Charlotte, NC", lat: 35.2271, lng: -80.8431 } },
      { order: 18, from: { name: "Charlotte, NC", lat: 35.2271, lng: -80.8431 }, to: { name: "Gastonia, NC", lat: 35.2621, lng: -81.1873 } },
      { order: 19, from: { name: "Gastonia, NC", lat: 35.2621, lng: -81.1873 }, to: { name: "Spartanburg, SC", lat: 34.9496, lng: -81.9320 } },
      { order: 20, from: { name: "Spartanburg, SC", lat: 34.9496, lng: -81.9320 }, to: { name: "Greenville, SC", lat: 34.8526, lng: -82.3940 } },
      { order: 21, from: { name: "Greenville, SC", lat: 34.8526, lng: -82.3940 }, to: { name: "Clemson, SC", lat: 34.6834, lng: -82.8374 } },
      { order: 22, from: { name: "Clemson, SC", lat: 34.6834, lng: -82.8374 }, to: { name: "Toccoa, GA", lat: 34.5773, lng: -83.3321 } },
      { order: 23, from: { name: "Toccoa, GA", lat: 34.5773, lng: -83.3321 }, to: { name: "Gainesville, GA", lat: 34.2979, lng: -83.8241 } },
      { order: 24, from: { name: "Gainesville, GA", lat: 34.2979, lng: -83.8241 }, to: { name: "Atlanta, GA", lat: 33.7490, lng: -84.3880 } }
    ]
  },

  // ============================================================================
  // SILVER METEOR (August 2020)
  // ============================================================================
  "silver-meteor-2020-08": {
    journeyId: "silver-meteor-2020-08",
    segments: [
      { order: 1, from: { name: "New York, NY", lat: 40.7128, lng: -74.0060 }, to: { name: "Newark, NJ", lat: 40.7357, lng: -74.1724 } },
      { order: 2, from: { name: "Newark, NJ", lat: 40.7357, lng: -74.1724 }, to: { name: "Trenton, NJ", lat: 40.2206, lng: -74.7597 } },
      { order: 3, from: { name: "Trenton, NJ", lat: 40.2206, lng: -74.7597 }, to: { name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 } },
      { order: 4, from: { name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 }, to: { name: "Wilmington, DE", lat: 39.7391, lng: -75.5398 } },
      { order: 5, from: { name: "Wilmington, DE", lat: 39.7391, lng: -75.5398 }, to: { name: "Baltimore, MD", lat: 39.2904, lng: -76.6122 } },
      { order: 6, from: { name: "Baltimore, MD", lat: 39.2904, lng: -76.6122 }, to: { name: "Washington, DC", lat: 38.9072, lng: -77.0369 } },
      { order: 7, from: { name: "Washington, DC", lat: 38.9072, lng: -77.0369 }, to: { name: "Alexandria, VA", lat: 38.8048, lng: -77.0469 } },
      { order: 8, from: { name: "Alexandria, VA", lat: 38.8048, lng: -77.0469 }, to: { name: "Fredericksburg, VA", lat: 38.3032, lng: -77.4605 } },
      { order: 9, from: { name: "Fredericksburg, VA", lat: 38.3032, lng: -77.4605 }, to: { name: "Richmond, VA", lat: 37.5407, lng: -77.4360 } },
      { order: 10, from: { name: "Richmond, VA", lat: 37.5407, lng: -77.4360 }, to: { name: "Petersburg, VA", lat: 37.2279, lng: -77.4019 } },
      { order: 11, from: { name: "Petersburg, VA", lat: 37.2279, lng: -77.4019 }, to: { name: "Rocky Mount, NC", lat: 35.9382, lng: -77.7905 } },
      { order: 12, from: { name: "Rocky Mount, NC", lat: 35.9382, lng: -77.7905 }, to: { name: "Fayetteville, NC", lat: 35.0527, lng: -78.8784 } },
      { order: 13, from: { name: "Fayetteville, NC", lat: 35.0527, lng: -78.8784 }, to: { name: "Florence, SC", lat: 34.1954, lng: -79.7626 } },
      { order: 14, from: { name: "Florence, SC", lat: 34.1954, lng: -79.7626 }, to: { name: "Kingstree, SC", lat: 33.6679, lng: -79.8309 } },
      { order: 15, from: { name: "Kingstree, SC", lat: 33.6679, lng: -79.8309 }, to: { name: "Charleston, SC", lat: 32.7765, lng: -79.9311 } },
      { order: 16, from: { name: "Charleston, SC", lat: 32.7765, lng: -79.9311 }, to: { name: "Yemassee, SC", lat: 32.6938, lng: -80.8509 } },
      { order: 17, from: { name: "Yemassee, SC", lat: 32.6938, lng: -80.8509 }, to: { name: "Savannah, GA", lat: 32.0809, lng: -81.0912 } },
      { order: 18, from: { name: "Savannah, GA", lat: 32.0809, lng: -81.0912 }, to: { name: "Jesup, GA", lat: 31.6074, lng: -81.8854 } },
      { order: 19, from: { name: "Jesup, GA", lat: 31.6074, lng: -81.8854 }, to: { name: "Jacksonville, FL", lat: 30.3322, lng: -81.6557 } },
      { order: 20, from: { name: "Jacksonville, FL", lat: 30.3322, lng: -81.6557 }, to: { name: "Palatka, FL", lat: 29.6486, lng: -81.6373 } },
      { order: 21, from: { name: "Palatka, FL", lat: 29.6486, lng: -81.6373 }, to: { name: "DeLand, FL", lat: 29.0283, lng: -81.3034 } },
      { order: 22, from: { name: "DeLand, FL", lat: 29.0283, lng: -81.3034 }, to: { name: "Winter Park, FL", lat: 28.6000, lng: -81.3392 } },
      { order: 23, from: { name: "Winter Park, FL", lat: 28.6000, lng: -81.3392 }, to: { name: "Orlando, FL", lat: 28.5383, lng: -81.3792 } },
      { order: 24, from: { name: "Orlando, FL", lat: 28.5383, lng: -81.3792 }, to: { name: "Kissimmee, FL", lat: 28.2920, lng: -81.4076 } },
      { order: 25, from: { name: "Kissimmee, FL", lat: 28.2920, lng: -81.4076 }, to: { name: "Winter Haven, FL", lat: 28.0222, lng: -81.7328 } },
      { order: 26, from: { name: "Winter Haven, FL", lat: 28.0222, lng: -81.7328 }, to: { name: "Sebring, FL", lat: 27.4956, lng: -81.4409 } },
      { order: 27, from: { name: "Sebring, FL", lat: 27.4956, lng: -81.4409 }, to: { name: "West Palm Beach, FL", lat: 26.7153, lng: -80.0534 } },
      { order: 28, from: { name: "West Palm Beach, FL", lat: 26.7153, lng: -80.0534 }, to: { name: "Delray Beach, FL", lat: 26.4615, lng: -80.0728 } },
      { order: 29, from: { name: "Delray Beach, FL", lat: 26.4615, lng: -80.0728 }, to: { name: "Deerfield Beach, FL", lat: 26.3184, lng: -80.0998 } },
      { order: 30, from: { name: "Deerfield Beach, FL", lat: 26.3184, lng: -80.0998 }, to: { name: "Fort Lauderdale, FL", lat: 26.1224, lng: -80.1373 } },
      { order: 31, from: { name: "Fort Lauderdale, FL", lat: 26.1224, lng: -80.1373 }, to: { name: "Hollywood, FL", lat: 26.0112, lng: -80.1495 } },
      { order: 32, from: { name: "Hollywood, FL", lat: 26.0112, lng: -80.1495 }, to: { name: "Miami, FL", lat: 25.7617, lng: -80.1918 } }
    ]
  },

  // ============================================================================
  // LAKE SHORE LIMITED (August 2020)
  // ============================================================================
  "lake-shore-limited-2020-08": {
    journeyId: "lake-shore-limited-2020-08",
    segments: [
      { order: 1, from: { name: "New York, NY", lat: 40.7128, lng: -74.0060 }, to: { name: "Croton-Harmon, NY", lat: 41.1898, lng: -73.8823 } },
      { order: 2, from: { name: "Croton-Harmon, NY", lat: 41.1898, lng: -73.8823 }, to: { name: "Poughkeepsie, NY", lat: 41.7062, lng: -73.9379 } },
      { order: 3, from: { name: "Poughkeepsie, NY", lat: 41.7062, lng: -73.9379 }, to: { name: "Rhinecliff, NY", lat: 41.9271, lng: -73.9457 } },
      { order: 4, from: { name: "Rhinecliff, NY", lat: 41.9271, lng: -73.9457 }, to: { name: "Albany-Rensselaer, NY", lat: 42.6526, lng: -73.7562 } },
      { order: 5, from: { name: "Albany-Rensselaer, NY", lat: 42.6526, lng: -73.7562 }, to: { name: "Schenectady, NY", lat: 42.8142, lng: -73.9396 } },
      { order: 6, from: { name: "Schenectady, NY", lat: 42.8142, lng: -73.9396 }, to: { name: "Utica, NY", lat: 43.1009, lng: -75.2327 } },
      { order: 7, from: { name: "Utica, NY", lat: 43.1009, lng: -75.2327 }, to: { name: "Syracuse, NY", lat: 43.0481, lng: -76.1474 } },
      { order: 8, from: { name: "Syracuse, NY", lat: 43.0481, lng: -76.1474 }, to: { name: "Rochester, NY", lat: 43.1566, lng: -77.6088 } },
      { order: 9, from: { name: "Rochester, NY", lat: 43.1566, lng: -77.6088 }, to: { name: "Buffalo, NY", lat: 42.8864, lng: -78.8784 } },
      { order: 10, from: { name: "Buffalo, NY", lat: 42.8864, lng: -78.8784 }, to: { name: "Erie, PA", lat: 42.1292, lng: -80.0851 } },
      { order: 11, from: { name: "Erie, PA", lat: 42.1292, lng: -80.0851 }, to: { name: "Cleveland, OH", lat: 41.4993, lng: -81.6944 } },
      { order: 12, from: { name: "Cleveland, OH", lat: 41.4993, lng: -81.6944 }, to: { name: "Elyria, OH", lat: 41.3683, lng: -82.1077 } },
      { order: 13, from: { name: "Elyria, OH", lat: 41.3683, lng: -82.1077 }, to: { name: "Sandusky, OH", lat: 41.4489, lng: -82.7079 } },
      { order: 14, from: { name: "Sandusky, OH", lat: 41.4489, lng: -82.7079 }, to: { name: "Toledo, OH", lat: 41.6528, lng: -83.5379 } },
      { order: 15, from: { name: "Toledo, OH", lat: 41.6528, lng: -83.5379 }, to: { name: "Bryan, OH", lat: 41.4745, lng: -84.5522 } },
      { order: 16, from: { name: "Bryan, OH", lat: 41.4745, lng: -84.5522 }, to: { name: "Waterloo, IN", lat: 41.4297, lng: -85.0225 } },
      { order: 17, from: { name: "Waterloo, IN", lat: 41.4297, lng: -85.0225 }, to: { name: "Elkhart, IN", lat: 41.6819, lng: -85.9767 } },
      { order: 18, from: { name: "Elkhart, IN", lat: 41.6819, lng: -85.9767 }, to: { name: "South Bend, IN", lat: 41.6764, lng: -86.2520 } },
      { order: 19, from: { name: "South Bend, IN", lat: 41.6764, lng: -86.2520 }, to: { name: "Chicago, IL", lat: 41.8781, lng: -87.6298 } }
    ]
  },

  // ============================================================================
  // CAPITOL LIMITED (August 2020)
  // ============================================================================
  "capitol-limited-2020-08": {
    journeyId: "capitol-limited-2020-08",
    segments: [
      { order: 1, from: { name: "Washington, DC", lat: 38.9072, lng: -77.0369 }, to: { name: "Rockville, MD", lat: 39.0840, lng: -77.1528 } },
      { order: 2, from: { name: "Rockville, MD", lat: 39.0840, lng: -77.1528 }, to: { name: "Harpers Ferry, WV", lat: 39.3254, lng: -77.7386 } },
      { order: 3, from: { name: "Harpers Ferry, WV", lat: 39.3254, lng: -77.7386 }, to: { name: "Martinsburg, WV", lat: 39.4562, lng: -77.9639 } },
      { order: 4, from: { name: "Martinsburg, WV", lat: 39.4562, lng: -77.9639 }, to: { name: "Cumberland, MD", lat: 39.6528, lng: -78.7625 } },
      { order: 5, from: { name: "Cumberland, MD", lat: 39.6528, lng: -78.7625 }, to: { name: "Connellsville, PA", lat: 40.0173, lng: -79.5895 } },
      { order: 6, from: { name: "Connellsville, PA", lat: 40.0173, lng: -79.5895 }, to: { name: "Pittsburgh, PA", lat: 40.4406, lng: -79.9959 } },
      { order: 7, from: { name: "Pittsburgh, PA", lat: 40.4406, lng: -79.9959 }, to: { name: "Alliance, OH", lat: 40.9153, lng: -81.1059 } },
      { order: 8, from: { name: "Alliance, OH", lat: 40.9153, lng: -81.1059 }, to: { name: "Cleveland, OH", lat: 41.4993, lng: -81.6944 } },
      { order: 9, from: { name: "Cleveland, OH", lat: 41.4993, lng: -81.6944 }, to: { name: "Elyria, OH", lat: 41.3683, lng: -82.1077 } },
      { order: 10, from: { name: "Elyria, OH", lat: 41.3683, lng: -82.1077 }, to: { name: "Sandusky, OH", lat: 41.4489, lng: -82.7079 } },
      { order: 11, from: { name: "Sandusky, OH", lat: 41.4489, lng: -82.7079 }, to: { name: "Toledo, OH", lat: 41.6528, lng: -83.5379 } },
      { order: 12, from: { name: "Toledo, OH", lat: 41.6528, lng: -83.5379 }, to: { name: "Waterloo, IN", lat: 41.4297, lng: -85.0225 } },
      { order: 13, from: { name: "Waterloo, IN", lat: 41.4297, lng: -85.0225 }, to: { name: "Elkhart, IN", lat: 41.6819, lng: -85.9767 } },
      { order: 14, from: { name: "Elkhart, IN", lat: 41.6819, lng: -85.9767 }, to: { name: "South Bend, IN", lat: 41.6764, lng: -86.2520 } },
      { order: 15, from: { name: "South Bend, IN", lat: 41.6764, lng: -86.2520 }, to: { name: "Chicago, IL", lat: 41.8781, lng: -87.6298 } }
    ]
  },

  // ============================================================================
  // VERMONTER (August 2020)
  // ============================================================================
  "vermonter-2020-08": {
    journeyId: "vermonter-2020-08",
    segments: [
      { order: 1, from: { name: "New York, NY", lat: 40.7128, lng: -74.0060 }, to: { name: "Stamford, CT", lat: 41.0468, lng: -73.5387 } },
      { order: 2, from: { name: "Stamford, CT", lat: 41.0468, lng: -73.5387 }, to: { name: "Bridgeport, CT", lat: 41.1792, lng: -73.1894 } },
      { order: 3, from: { name: "Bridgeport, CT", lat: 41.1792, lng: -73.1894 }, to: { name: "New Haven, CT", lat: 41.2982, lng: -72.9253 } },
      { order: 4, from: { name: "New Haven, CT", lat: 41.2982, lng: -72.9253 }, to: { name: "Meriden, CT", lat: 41.5382, lng: -72.8070 } },
      { order: 5, from: { name: "Meriden, CT", lat: 41.5382, lng: -72.8070 }, to: { name: "Hartford, CT", lat: 41.7658, lng: -72.6734 } },
      { order: 6, from: { name: "Hartford, CT", lat: 41.7658, lng: -72.6734 }, to: { name: "Windsor Locks, CT", lat: 41.9293, lng: -72.6273 } },
      { order: 7, from: { name: "Windsor Locks, CT", lat: 41.9293, lng: -72.6273 }, to: { name: "Springfield, MA", lat: 42.1015, lng: -72.5898 } },
      { order: 8, from: { name: "Springfield, MA", lat: 42.1015, lng: -72.5898 }, to: { name: "Holyoke, MA", lat: 42.2043, lng: -72.6162 } },
      { order: 9, from: { name: "Holyoke, MA", lat: 42.2043, lng: -72.6162 }, to: { name: "Northampton, MA", lat: 42.3195, lng: -72.6295 } },
      { order: 10, from: { name: "Northampton, MA", lat: 42.3195, lng: -72.6295 }, to: { name: "Greenfield, MA", lat: 42.5876, lng: -72.5995 } },
      { order: 11, from: { name: "Greenfield, MA", lat: 42.5876, lng: -72.5995 }, to: { name: "Brattleboro, VT", lat: 42.8509, lng: -72.5579 } },
      { order: 12, from: { name: "Brattleboro, VT", lat: 42.8509, lng: -72.5579 }, to: { name: "Bellows Falls, VT", lat: 43.1328, lng: -72.4440 } },
      { order: 13, from: { name: "Bellows Falls, VT", lat: 43.1328, lng: -72.4440 }, to: { name: "Claremont, NH", lat: 43.3767, lng: -72.3468 } },
      { order: 14, from: { name: "Claremont, NH", lat: 43.3767, lng: -72.3468 }, to: { name: "Windsor-Mt. Ascutney, VT", lat: 43.4786, lng: -72.3851 } },
      { order: 15, from: { name: "Windsor-Mt. Ascutney, VT", lat: 43.4786, lng: -72.3851 }, to: { name: "White River Junction, VT", lat: 43.6489, lng: -72.3195 } },
      { order: 16, from: { name: "White River Junction, VT", lat: 43.6489, lng: -72.3195 }, to: { name: "Randolph, VT", lat: 43.9256, lng: -72.6623 } },
      { order: 17, from: { name: "Randolph, VT", lat: 43.9256, lng: -72.6623 }, to: { name: "Montpelier-Berlin, VT", lat: 44.2601, lng: -72.5754 } },
      { order: 18, from: { name: "Montpelier-Berlin, VT", lat: 44.2601, lng: -72.5754 }, to: { name: "Waterbury-Stowe, VT", lat: 44.3370, lng: -72.7551 } },
      { order: 19, from: { name: "Waterbury-Stowe, VT", lat: 44.3370, lng: -72.7551 }, to: { name: "Essex Junction, VT", lat: 44.4906, lng: -73.1115 } },
      { order: 20, from: { name: "Essex Junction, VT", lat: 44.4906, lng: -73.1115 }, to: { name: "St. Albans, VT", lat: 44.8109, lng: -73.0818 } }
    ]
  },

  // ============================================================================
  // CITY OF NEW ORLEANS (September 2020)
  // ============================================================================
  "city-of-new-orleans-2020-09": {
    journeyId: "city-of-new-orleans-2020-09",
    segments: [
      { order: 1, from: { name: "Chicago, IL", lat: 41.8781, lng: -87.6298 }, to: { name: "Homewood, IL", lat: 41.5572, lng: -87.6656 } },
      { order: 2, from: { name: "Homewood, IL", lat: 41.5572, lng: -87.6656 }, to: { name: "Kankakee, IL", lat: 41.1200, lng: -87.8612 } },
      { order: 3, from: { name: "Kankakee, IL", lat: 41.1200, lng: -87.8612 }, to: { name: "Champaign-Urbana, IL", lat: 40.1164, lng: -88.2434 } },
      { order: 4, from: { name: "Champaign-Urbana, IL", lat: 40.1164, lng: -88.2434 }, to: { name: "Mattoon, IL", lat: 39.4831, lng: -88.3729 } },
      { order: 5, from: { name: "Mattoon, IL", lat: 39.4831, lng: -88.3729 }, to: { name: "Effingham, IL", lat: 39.1200, lng: -88.5434 } },
      { order: 6, from: { name: "Effingham, IL", lat: 39.1200, lng: -88.5434 }, to: { name: "Centralia, IL", lat: 38.5250, lng: -89.1334 } },
      { order: 7, from: { name: "Centralia, IL", lat: 38.5250, lng: -89.1334 }, to: { name: "Carbondale, IL", lat: 37.7273, lng: -89.2167 } },
      { order: 8, from: { name: "Carbondale, IL", lat: 37.7273, lng: -89.2167 }, to: { name: "Fulton, KY", lat: 36.5045, lng: -88.8742 } },
      { order: 9, from: { name: "Fulton, KY", lat: 36.5045, lng: -88.8742 }, to: { name: "Newbern-Dyersburg, TN", lat: 36.1134, lng: -89.2623 } },
      { order: 10, from: { name: "Newbern-Dyersburg, TN", lat: 36.1134, lng: -89.2623 }, to: { name: "Memphis, TN", lat: 35.1495, lng: -90.0490 } },
      { order: 11, from: { name: "Memphis, TN", lat: 35.1495, lng: -90.0490 }, to: { name: "Marks, MS", lat: 34.2565, lng: -90.2723 } },
      { order: 12, from: { name: "Marks, MS", lat: 34.2565, lng: -90.2723 }, to: { name: "Greenwood, MS", lat: 33.5162, lng: -90.1798 } },
      { order: 13, from: { name: "Greenwood, MS", lat: 33.5162, lng: -90.1798 }, to: { name: "Yazoo City, MS", lat: 32.8551, lng: -90.4056 } },
      { order: 14, from: { name: "Yazoo City, MS", lat: 32.8551, lng: -90.4056 }, to: { name: "Jackson, MS", lat: 32.2988, lng: -90.1848 } },
      { order: 15, from: { name: "Jackson, MS", lat: 32.2988, lng: -90.1848 }, to: { name: "Hazlehurst, MS", lat: 31.8693, lng: -90.3967 } },
      { order: 16, from: { name: "Hazlehurst, MS", lat: 31.8693, lng: -90.3967 }, to: { name: "Brookhaven, MS", lat: 31.5793, lng: -90.4407 } },
      { order: 17, from: { name: "Brookhaven, MS", lat: 31.5793, lng: -90.4407 }, to: { name: "McComb, MS", lat: 31.2438, lng: -90.4531 } },
      { order: 18, from: { name: "McComb, MS", lat: 31.2438, lng: -90.4531 }, to: { name: "Hammond, LA", lat: 30.5047, lng: -90.4612 } },
      { order: 19, from: { name: "Hammond, LA", lat: 30.5047, lng: -90.4612 }, to: { name: "New Orleans, LA", lat: 29.9511, lng: -90.0715 } }
    ]
  },

  // ============================================================================
  // PENNSYLVANIAN (August 2020)
  // ============================================================================
  "pennsylvanian-2020-08": {
    journeyId: "pennsylvanian-2020-08",
    segments: [
      { order: 1, from: { name: "New York, NY", lat: 40.7128, lng: -74.0060 }, to: { name: "Newark, NJ", lat: 40.7357, lng: -74.1724 } },
      { order: 2, from: { name: "Newark, NJ", lat: 40.7357, lng: -74.1724 }, to: { name: "Trenton, NJ", lat: 40.2206, lng: -74.7597 } },
      { order: 3, from: { name: "Trenton, NJ", lat: 40.2206, lng: -74.7597 }, to: { name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 } },
      { order: 4, from: { name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 }, to: { name: "Ardmore, PA", lat: 40.0073, lng: -75.2882 } },
      { order: 5, from: { name: "Ardmore, PA", lat: 40.0073, lng: -75.2882 }, to: { name: "Paoli, PA", lat: 40.0426, lng: -75.4854 } },
      { order: 6, from: { name: "Paoli, PA", lat: 40.0426, lng: -75.4854 }, to: { name: "Exton, PA", lat: 40.0290, lng: -75.6207 } },
      { order: 7, from: { name: "Exton, PA", lat: 40.0290, lng: -75.6207 }, to: { name: "Lancaster, PA", lat: 40.0379, lng: -76.3055 } },
      { order: 8, from: { name: "Lancaster, PA", lat: 40.0379, lng: -76.3055 }, to: { name: "Elizabethtown, PA", lat: 40.1526, lng: -76.6027 } },
      { order: 9, from: { name: "Elizabethtown, PA", lat: 40.1526, lng: -76.6027 }, to: { name: "Harrisburg, PA", lat: 40.2732, lng: -76.8867 } },
      { order: 10, from: { name: "Harrisburg, PA", lat: 40.2732, lng: -76.8867 }, to: { name: "Lewistown, PA", lat: 40.5992, lng: -77.5714 } },
      { order: 11, from: { name: "Lewistown, PA", lat: 40.5992, lng: -77.5714 }, to: { name: "Huntingdon, PA", lat: 40.4848, lng: -78.0103 } },
      { order: 12, from: { name: "Huntingdon, PA", lat: 40.4848, lng: -78.0103 }, to: { name: "Tyrone, PA", lat: 40.6706, lng: -78.2392 } },
      { order: 13, from: { name: "Tyrone, PA", lat: 40.6706, lng: -78.2392 }, to: { name: "Altoona, PA", lat: 40.5187, lng: -78.3947 } },
      { order: 14, from: { name: "Altoona, PA", lat: 40.5187, lng: -78.3947 }, to: { name: "Johnstown, PA", lat: 40.3267, lng: -78.9220 } },
      { order: 15, from: { name: "Johnstown, PA", lat: 40.3267, lng: -78.9220 }, to: { name: "Latrobe, PA", lat: 40.3209, lng: -79.3795 } },
      { order: 16, from: { name: "Latrobe, PA", lat: 40.3209, lng: -79.3795 }, to: { name: "Greensburg, PA", lat: 40.3012, lng: -79.5389 } },
      { order: 17, from: { name: "Greensburg, PA", lat: 40.3012, lng: -79.5389 }, to: { name: "Pittsburgh, PA", lat: 40.4406, lng: -79.9959 } }
    ]
  },

  // ============================================================================
  // ETHAN ALLEN EXPRESS (August 2020)
  // ============================================================================
  "ethan-allen-express-2020-08": {
    journeyId: "ethan-allen-express-2020-08",
    segments: [
      { order: 1, from: { name: "Rutland, VT", lat: 43.6106, lng: -72.9726 }, to: { name: "Castleton, VT", lat: 43.6106, lng: -73.1773 } },
      { order: 2, from: { name: "Castleton, VT", lat: 43.6106, lng: -73.1773 }, to: { name: "Fort Edward, NY", lat: 43.2670, lng: -73.5851 } },
      { order: 3, from: { name: "Fort Edward, NY", lat: 43.2670, lng: -73.5851 }, to: { name: "Saratoga Springs, NY", lat: 43.0831, lng: -73.7846 } },
      { order: 4, from: { name: "Saratoga Springs, NY", lat: 43.0831, lng: -73.7846 }, to: { name: "Schenectady, NY", lat: 42.8142, lng: -73.9396 } },
      { order: 5, from: { name: "Schenectady, NY", lat: 42.8142, lng: -73.9396 }, to: { name: "Albany-Rensselaer, NY", lat: 42.6526, lng: -73.7562 } },
      { order: 6, from: { name: "Albany-Rensselaer, NY", lat: 42.6526, lng: -73.7562 }, to: { name: "Hudson, NY", lat: 42.2526, lng: -73.7909 } },
      { order: 7, from: { name: "Hudson, NY", lat: 42.2526, lng: -73.7909 }, to: { name: "Rhinecliff, NY", lat: 41.9271, lng: -73.9457 } },
      { order: 8, from: { name: "Rhinecliff, NY", lat: 41.9271, lng: -73.9457 }, to: { name: "Poughkeepsie, NY", lat: 41.7062, lng: -73.9379 } },
      { order: 9, from: { name: "Poughkeepsie, NY", lat: 41.7062, lng: -73.9379 }, to: { name: "Croton-Harmon, NY", lat: 41.1898, lng: -73.8823 } },
      { order: 10, from: { name: "Croton-Harmon, NY", lat: 41.1898, lng: -73.8823 }, to: { name: "Yonkers, NY", lat: 40.9312, lng: -73.8987 } },
      { order: 11, from: { name: "Yonkers, NY", lat: 40.9312, lng: -73.8987 }, to: { name: "New York, NY", lat: 40.7128, lng: -74.0060 } }
    ]
  }
}

// Helper function to get route by journey ID
export function getRouteByJourneyId(journeyId) {
  return routes[journeyId] || null
}

// Helper function to get route coordinates for map visualization
export function getRouteCoordinates(journeyId) {
  const route = routes[journeyId]
  if (!route || !route.segments) return []

  // Build path from segments
  const coordinates = []
  route.segments.forEach((segment, index) => {
    if (index === 0) {
      coordinates.push([segment.from.lat, segment.from.lng])
    }
    coordinates.push([segment.to.lat, segment.to.lng])
  })

  return coordinates
}
