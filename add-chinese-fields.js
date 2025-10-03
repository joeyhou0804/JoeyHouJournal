const fs = require('fs');

// US State translations
const stateTranslations = {
  'AL': '阿拉巴马州',
  'AZ': '亚利桑那州',
  'AR': '阿肯色州',
  'CA': '加利福尼亚州',
  'CO': '科罗拉多州',
  'CT': '康涅狄格州',
  'DE': '特拉华州',
  'DC': '华盛顿特区',
  'FL': '佛罗里达州',
  'GA': '佐治亚州',
  'ID': '爱达荷州',
  'IL': '伊利诺伊州',
  'IN': '印第安纳州',
  'IA': '艾奥瓦州',
  'KS': '堪萨斯州',
  'LA': '路易斯安那州',
  'ME': '缅因州',
  'MD': '马里兰州',
  'MA': '马萨诸塞州',
  'MS': '密西西比州',
  'MO': '密苏里州',
  'MT': '蒙大拿州',
  'NE': '内布拉斯加州',
  'NV': '内华达州',
  'NJ': '新泽西州',
  'NM': '新墨西哥州',
  'NY': '纽约州',
  'NC': '北卡罗来纳州',
  'ND': '北达科他州',
  'OH': '俄亥俄州',
  'OR': '俄勒冈州',
  'PA': '宾夕法尼亚州',
  'TN': '田纳西州',
  'TX': '德克萨斯州',
  'UT': '犹他州',
  'VT': '佛蒙特州',
  'VA': '弗吉尼亚州',
  'WA': '华盛顿州',
  'WV': '西弗吉尼亚州',
  'WI': '威斯康星州',
};

// City name translations
const cityTranslations = {
  'New York': '纽约',
  'Los Angeles': '洛杉矶',
  'Chicago': '芝加哥',
  'San Francisco': '旧金山',
  'San Diego': '圣迭戈',
  'San Antonio': '圣安东尼奥',
  'Washington': '华盛顿',
  'Miami': '迈阿密',
  'Philadelphia': '费城',
  'Atlanta': '亚特兰大',
  'Boston': '波士顿',
  'Phoenix': '凤凰城',
  'Seattle': '西雅图',
  'Denver': '丹佛',
  'Las Vegas': '拉斯维加斯',
  'Portland': '波特兰',
  'Orlando': '奥兰多',
  'Austin': '奥斯汀',
  'Baltimore': '巴尔的摩',
  'Milwaukee': '密尔沃基',
  'Albuquerque': '阿尔伯克基',
  'Tucson': '图森',
  'Sacramento': '萨克拉门托',
  'Kansas City': '堪萨斯城',
  'Memphis': '孟菲斯',
  'Pittsburgh': '匹兹堡',
  'Buffalo': '布法罗',
  'Newark': '纽瓦克',
  'Jersey City': '泽西城',
  'St. Louis': '圣路易斯',
  'New Orleans': '新奥尔良',
  'Miami Beach': '迈阿密海滩',
  'West Palm Beach': '西棕榈滩',
  'Fort Worth': '沃斯堡',
  'El Paso': '埃尔帕索',
  'Minneapolis': '明尼阿波利斯',
  'Salt Lake City': '盐湖城',
  'Reno': '里诺',
  'Long Beach': '长滩',
  'Atlantic City': '大西洋城',
  'Hartford': '哈特福德',
  'Richmond': '里士满',
  'Norfolk': '诺福克',
  'Jacksonville': '杰克逊维尔',
  'Savannah': '萨凡纳',
  'Charlottesville': '夏洛茨维尔',
  'Burlington': '伯灵顿',
  'Poughkeepsie': '波基普西',
  'Rochester': '罗彻斯特',
  'Syracuse': '锡拉丘兹',
  'Albany': '奥尔巴尼',
  'Springfield': '斯普林菲尔德',
  'New London': '新伦敦',
  'Wilmington': '威尔明顿',
  'Harrisburg': '哈里斯堡',
  'Altoona': '阿尔图纳',
  'Toledo': '托莱多',
  'South Bend': '南本德',
  'Elkhart': '埃尔克哈特',
  'Naperville': '内珀维尔',
  'Galesburg': '盖尔斯堡',
  'Mendota': '门多塔',
  'Omaha': '奥马哈',
  'Lincoln': '林肯',
  'Fort Madison': '麦迪逊堡',
  'Mount Pleasant': '芒特普莱森特',
  'Osceola': '奥西奥拉',
  'Columbus': '哥伦布',
  'Winona': '威诺纳',
  'Topeka': '托皮卡',
  'La Junta': '拉洪塔',
  'Raton': '拉顿',
  'Gallup': '盖洛普',
  'Flagstaff': '弗拉格斯塔夫',
  'Glenwood Springs': '格伦伍德斯普林斯',
  'Grand Junction': '大章克申',
  'Helper': '赫尔珀',
  'Emeryville': '埃默里维尔',
  'Berkeley': '伯克利',
  'Colfax': '科尔法克斯',
  'Granby': '格兰比',
  'Spokane': '斯波坎',
  'Sandpoint': '桑德波因特',
  'Whitefish': '怀特菲什',
  'Havre': '哈弗',
  'Shelby': '谢尔比',
  'Minot': '迈诺特',
  'Williston': '威利斯顿',
  'Wolf Point': '沃尔夫波因特',
  'Pasco': '帕斯科',
  'Wishram': '威什拉姆',
  'Brattleboro': '布拉特尔伯勒',
  'White River Junction': '白河章克申',
  'Montpelier': '蒙彼利埃',
  'Waterbury': '沃特伯里',
  'Essex Junction': '埃塞克斯章克申',
  'St. Albans': '圣奥尔本斯',
  'Rutland': '拉特兰',
  'Killington': '基灵顿',
  'Great Neck': '大颈',
  'New Rochelle': '新罗谢尔',
  'Linden': '林登',
  'Edgewater': '埃奇沃特',
  'Fort Lee': '李堡',
  'Port Jervis': '杰维斯港',
  'Exchange Place': '交易广场',
  'Little Rock': '小石城',
  'Texarkana': '特克萨卡纳',
  'Jackson': '杰克逊',
  'Hattiesburg': '哈蒂斯堡',
  'McComb': '麦库姆',
  'Meridian': '梅里迪恩',
  'Birmingham': '伯明翰',
  'Tuscaloosa': '塔斯卡卢萨',
  'Fayetteville': '费耶特维尔',
  'Greensboro': '格林斯伯勒',
  'Lynchburg': '林奇堡',
  'Harpers Ferry': '哈珀斯费里',
  'Cumberland': '坎伯兰',
  'Alpine': '阿尔派恩',
  'Ciudad Juarez': '华雷斯城',
  'Tijuana': '蒂华纳',
  'San Ysidro': '圣伊西德罗',
  'Capitol': '国会大厦',
  'CMU': '卡内基梅隆大学',
  'Amtrak': '美铁站',
  'Orchard Beach': '果园海滩',
  'Bronx': '布朗克斯',
  'Killington Peak': '基灵顿峰',
};

function translatePlaceName(name) {
  // Handle special cases first
  if (name.includes('Capitol,')) {
    const parts = name.split(',').map(s => s.trim());
    const cityState = parts[1];
    const [city, state] = cityState.split(',').map(s => s.trim());
    const stateCN = stateTranslations[state] || state;
    const cityCN = cityTranslations[city] || city;
    return `${stateCN}·${cityCN}国会大厦`;
  }

  if (name.includes('CMU,')) {
    const parts = name.split(',').map(s => s.trim());
    const cityState = parts[1];
    const [city, state] = cityState.split(',').map(s => s.trim());
    const stateCN = stateTranslations[state] || state;
    return `${stateCN}·卡内基梅隆大学`;
  }

  if (name.includes('Amtrak,')) {
    const parts = name.split(',').map(s => s.trim());
    const city = parts[1];
    const state = parts[2];
    const stateCN = stateTranslations[state] || state;
    const cityCN = cityTranslations[city] || city;
    return `${stateCN}·${cityCN}`;
  }

  // Handle Mexico
  if (name.includes('Mexico')) {
    const city = name.split(',')[0].trim();
    const cityCN = cityTranslations[city] || city;
    return `墨西哥·${cityCN}`;
  }

  // Handle Orchard Beach, Bronx, NY
  if (name.includes('Bronx')) {
    return '纽约州·布朗克斯果园海滩';
  }

  // Handle Killington Peak
  if (name.includes('Peak')) {
    const stateCN = stateTranslations['VT'];
    return `${stateCN}·基灵顿峰`;
  }

  // Standard format: "City, State"
  const parts = name.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const city = parts[0];
    const state = parts[1];

    const stateCN = stateTranslations[state] || state;
    const cityCN = cityTranslations[city] || city;

    return `${stateCN}·${cityCN}`;
  }

  return name;
}

// Read the current data
const data = JSON.parse(fs.readFileSync('/Users/joeyhou/Desktop/JoeyHouJournal/src/data/stations.json', 'utf8'));

// Add Chinese fields to each station
const updatedData = data.map(station => {
  return {
    ...station,
    nameCN: translatePlaceName(station.name),
    routeCN: station.route, // Copy English route for now
    descriptionCN: station.description // Copy English description for now
  };
});

// Write the updated data
fs.writeFileSync(
  '/Users/joeyhou/Desktop/JoeyHouJournal/src/data/stations.json',
  JSON.stringify(updatedData, null, 2),
  'utf8'
);

console.log('✓ Added Chinese fields to all stations');
console.log(`✓ Updated ${updatedData.length} stations`);

// Show a few examples
console.log('\nExamples:');
updatedData.slice(0, 5).forEach(station => {
  console.log(`${station.name} -> ${station.nameCN}`);
});
