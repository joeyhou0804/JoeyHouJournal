// Centralized translations for the website
// Edit this file to customize translations for English and Chinese

export const translations = {
  en: {
    // Section Headings
    mapView: 'Map View',
    listOfPlaces: 'List of Places',
    listOfJourneys: 'List of Journeys',

    // Instructional Text
    clickToViewDetails: 'Click the cards below to view the details!',

    // Map View Hints
    mapHint1: {
      title: 'Check out the map',
      description1: 'Click on the markers to see the place name.',
      description2: 'You can also view more details with the button.',
    },
    mapHint2: {
      title: 'As for golden markers...',
      description1: 'Golden markers indicate cities with multiple visits.',
      description2: 'Use the side buttons to navigate through them.',
    },

    // Error Messages
    stationNotFound: 'Station Not Found',
    journeyNotFound: 'Journey Not Found',
    backToDestinations: 'Back to Destinations',
    backToJourneys: 'Back to Journeys',

    // Loading States
    loadingMap: 'Loading map...',

    // Pagination
    pageOfPages: (current: number, total: number) => `Page ${current} of ${total}`,

    // Sort Options
    latestFirst: 'Latest First',
    earliestFirst: 'Earliest First',

    // Button Labels & Alt Text
    previous: 'Previous',
    next: 'Next',
    previousJourney: 'Previous Journey',
    nextJourney: 'Next Journey',
    viewDetails: 'View Details',
    journeyDetails: 'Journey Details',

    // US States
    states: {
      'New York': 'New York',
      'Pennsylvania': 'Pennsylvania',
      'Ohio': 'Ohio',
      'Indiana': 'Indiana',
      'Illinois': 'Illinois',
      'Wisconsin': 'Wisconsin',
      'Minnesota': 'Minnesota',
      'North Dakota': 'North Dakota',
      'Montana': 'Montana',
      'Idaho': 'Idaho',
      'Washington': 'Washington',
      'Oregon': 'Oregon',
      'California': 'California',
      'Nevada': 'Nevada',
      'Utah': 'Utah',
      'Colorado': 'Colorado',
      'Nebraska': 'Nebraska',
      'Iowa': 'Iowa',
      'Missouri': 'Missouri',
      'Kansas': 'Kansas',
      'Oklahoma': 'Oklahoma',
      'Texas': 'Texas',
      'New Mexico': 'New Mexico',
      'Arizona': 'Arizona',
      'Wyoming': 'Wyoming',
      'South Dakota': 'South Dakota',
      'Maryland': 'Maryland',
      'District of Columbia': 'District of Columbia',
      'Virginia': 'Virginia',
      'West Virginia': 'West Virginia',
      'Kentucky': 'Kentucky',
      'Tennessee': 'Tennessee',
      'North Carolina': 'North Carolina',
      'South Carolina': 'South Carolina',
      'Georgia': 'Georgia',
      'Alabama': 'Alabama',
      'Mississippi': 'Mississippi',
      'Louisiana': 'Louisiana',
      'Arkansas': 'Arkansas',
      'Vermont': 'Vermont',
      'New Hampshire': 'New Hampshire',
      'Massachusetts': 'Massachusetts',
      'Rhode Island': 'Rhode Island',
      'Connecticut': 'Connecticut',
      'New Jersey': 'New Jersey',
      'Delaware': 'Delaware',
      'Florida': 'Florida',
      'Michigan': 'Michigan',
      'Maine': 'Maine',
    } as Record<string, string>,

    // Duration
    journeyDetail: {
      day: 'day',
      days: 'days',
      night: 'night',
      nights: 'nights',
    },
  },
  zh: {
    // Section Headings
    mapView: '地图视图',
    listOfPlaces: '足迹列表',
    listOfJourneys: '旅程列表',

    // Instructional Text
    clickToViewDetails: '点击下方卡片查看详情！',

    // Map View Hints
    mapHint1: {
      title: '地图的查看方法',
      description1: '点击地图上的橙色标记，查看地点名称。',
      description2: '之后也可以通过点击按钮了解更多细节。',
    },
    mapHint2: {
      title: '金黄色的标记是...',
      description1: '金黄色标记表示去过多次的地点。',
      description2: '使用侧边的按钮，就可以看到每次旅游的信息了。',
    },

    // Error Messages
    stationNotFound: '未找到站点',
    journeyNotFound: '未找到旅程',
    backToDestinations: '返回目的地',
    backToJourneys: '返回旅程',

    // Loading States
    loadingMap: '加载地图中...',

    // Pagination
    pageOfPages: (current: number, total: number) => `第 ${current} 页，共 ${total} 页`,

    // Sort Options
    latestFirst: '最新优先',
    earliestFirst: '最早优先',

    // Button Labels & Alt Text
    previous: '上一页',
    next: '下一页',
    previousJourney: '上一个旅程',
    nextJourney: '下一个旅程',
    viewDetails: '了解更多',
    journeyDetails: '旅程详情',

    // US States
    states: {
      'New York': '纽约州',
      'Pennsylvania': '宾夕法尼亚州',
      'Ohio': '俄亥俄州',
      'Indiana': '印第安纳州',
      'Illinois': '伊利诺伊州',
      'Wisconsin': '威斯康星州',
      'Minnesota': '明尼苏达州',
      'North Dakota': '北达科他州',
      'Montana': '蒙大拿州',
      'Idaho': '爱达荷州',
      'Washington': '华盛顿州',
      'Oregon': '俄勒冈州',
      'California': '加利福尼亚州',
      'Nevada': '内华达州',
      'Utah': '犹他州',
      'Colorado': '科罗拉多州',
      'Nebraska': '内布拉斯加州',
      'Iowa': '爱荷华州',
      'Missouri': '密苏里州',
      'Kansas': '堪萨斯州',
      'Oklahoma': '俄克拉荷马州',
      'Texas': '德克萨斯州',
      'New Mexico': '新墨西哥州',
      'Arizona': '亚利桑那州',
      'Wyoming': '怀俄明州',
      'South Dakota': '南达科他州',
      'Maryland': '马里兰州',
      'District of Columbia': '哥伦比亚特区',
      'Virginia': '弗吉尼亚州',
      'West Virginia': '西弗吉尼亚州',
      'Kentucky': '肯塔基州',
      'Tennessee': '田纳西州',
      'North Carolina': '北卡罗来纳州',
      'South Carolina': '南卡罗来纳州',
      'Georgia': '佐治亚州',
      'Alabama': '阿拉巴马州',
      'Mississippi': '密西西比州',
      'Louisiana': '路易斯安那州',
      'Arkansas': '阿肯色州',
      'Vermont': '佛蒙特州',
      'New Hampshire': '新罕布什尔州',
      'Massachusetts': '马萨诸塞州',
      'Rhode Island': '罗得岛州',
      'Connecticut': '康涅狄格州',
      'New Jersey': '新泽西州',
      'Delaware': '特拉华州',
      'Florida': '佛罗里达州',
      'Michigan': '密歇根州',
      'Maine': '缅因州',
    } as Record<string, string>,

    // Duration
    journeyDetail: {
      day: '天',
      days: '天',
      night: '晚',
      nights: '晚',
    },
  },
} as const

export type Locale = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
