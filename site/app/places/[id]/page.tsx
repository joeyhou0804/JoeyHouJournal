import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Train, Camera, Navigation } from 'lucide-react'
import PlaceDetailClient from './PlaceDetailClient'

// All places data - must match the places page exactly
const placesData = [

  {
    id: "rutland-vt",
    name: "Rutland, VT",
    state: "VT",
    date: "2021/10/10",
    route: "Ethan Allen Express",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/dg0nvi0i1ksqfcssbmty.jpg",
    images: [
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/dg0nvi0i1ksqfcssbmty.jpg", caption: "Rutland, VT - Photo 1" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/q1r0dec2depz4kd5eiol.jpg", caption: "Rutland, VT - Photo 2" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/dczrvg1ydp5lj5k97zho.jpg", caption: "Rutland, VT - Photo 3" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/v7kjnnhll0l1ohhjtiho.jpg", caption: "Rutland, VT - Photo 4" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/safswx53oz2u2a45tzi9.jpg", caption: "Rutland, VT - Photo 5" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/rr1o9woze8fjetycwkdy.jpg", caption: "Rutland, VT - Photo 6" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/tsiofaffm3qloaulaqqk.jpg", caption: "Rutland, VT - Photo 7" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341623/joeyhouhomepage/gmiblb0hjsmksylz9f76.jpg", caption: "Rutland, VT - Photo 8" },
      { url: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341624/joeyhouhomepage/reyfzwmcwskokclgosyp.jpg", caption: "Rutland, VT - Photo 9" }
    ],
    description: "1234"
  },
  {
    id: "killington-peak-vermont",
    name: "Killington Peak, Vermont",
    state: "Vermont",
    date: "2021/10/10",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341561/joeyhouhomepage/xhw0ymvtmnf9wa7mip4m.jpg",
    description: "1234"
  },
  {
    id: "st-albans-vt-1",
    name: "St. Albans, VT",
    state: "VT",
    date: "2021/10/09",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341344/joeyhouhomepage/coe9icr36uqck0chc6oy.jpg",
    description: "1234"
  },
  {
    id: "killington-vt",
    name: "Killington, VT",
    state: "VT",
    date: "2021/10/09",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341495/joeyhouhomepage/u2od1rlmspqwghnmnw11.jpg",
    description: "1234"
  },
  {
    id: "burlington-vt",
    name: "Burlington, VT",
    state: "VT",
    date: "2021/10/09",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341446/joeyhouhomepage/xxd8o70gzve0zafdv7aa.jpg",
    description: "1234"
  },
  {
    id: "essex-junction-vt",
    name: "Essex Junction, VT",
    state: "VT",
    date: "2021/10/09",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341394/joeyhouhomepage/nlwwxmab4uc1avr6pgnv.jpg",
    description: "1234"
  },
  {
    id: "white-river-junction-vt",
    name: "White River Junction, VT",
    state: "VT",
    date: "2021/10/08",
    route: "56 Vermonter",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341174/joeyhouhomepage/l5rphkl6jgcp4kueyzev.jpg",
    description: "1234"
  },
  {
    id: "springfield-massachusetts",
    name: "Springfield, Massachusetts",
    state: "Massachusetts",
    date: "2021/10/08",
    route: "56 Vermonter",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341055/joeyhouhomepage/sgu93bazoxkjfvg0b4ns.jpg",
    description: "1234"
  },
  {
    id: "new-york-ny-1",
    name: "New York, NY",
    state: "NY",
    date: "2021/10/08",
    route: "56 Vermonter",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636267839/joeyhouhomepage/fcxxmzzszhwapdylbq89.jpg",
    description: "从只有树梢一点黄的纽约开始 Start from NYC with just a bit of yellow on the treetops"
  },
  {
    id: "st-albans-vt",
    name: "St/ Albans, VT",
    state: "VT",
    date: "2021/10/08",
    route: "56 Vermonter",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341284/joeyhouhomepage/vbfv117ma9pkfqitqvij.jpg",
    description: "1234"
  },
  {
    id: "montpelier-vt",
    name: "Montpelier, VT",
    state: "VT",
    date: "2021/10/08",
    route: "56 Vermonter",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341227/joeyhouhomepage/l8btsheih2jrscvwly0i.jpg",
    description: "1234"
  },
  {
    id: "brattleboro-vt",
    name: "Brattleboro, VT",
    state: "VT",
    date: "2021/10/08",
    route: "56 Vermonter",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636341115/joeyhouhomepage/c8dtuoxl4q4iaoye2tg1.jpg",
    description: "1234"
  },
  {
    id: "linden-nj",
    name: "Linden, NJ",
    state: "NJ",
    date: "2021/09/10",
    route: "NJ Transit",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636404672/joeyhouhomepage/bztsvzm3k5vznnqzwdbt.jpg",
    description: "1234"
  },
  {
    id: "buffalo-ny",
    name: "Buffalo, NY",
    state: "NY",
    date: "2021/08/23",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858573/joeyhouhomepage/byq2tz6aaauvvyxzmwyz.jpg",
    description: "1-6"
  },
  {
    id: "little-havana-miami",
    name: "Little Havana, Miami",
    state: "Miami",
    date: "2021/08/21",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636586227/joeyhouhomepage/iohepuzdslll5hyvwrqb.jpg",
    description: "15"
  },
  {
    id: "miami-beach-fl",
    name: "Miami Beach, FL",
    state: "FL",
    date: "2021/08/20",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636586133/joeyhouhomepage/a5kiqs25q6jvkm9xzsx4.jpg",
    description: "14"
  },
  {
    id: "west-palm-beach-fl",
    name: "West Palm Beach, FL",
    state: "FL",
    date: "2021/08/19",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585913/joeyhouhomepage/ykbc6mbacai8yrh8x4fi.jpg",
    description: "13-4"
  },
  {
    id: "jacksonville-fl",
    name: "Jacksonville, FL",
    state: "FL",
    date: "2021/08/19",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585736/joeyhouhomepage/hvedzbtufbwtycejky6f.jpg",
    description: "13-2"
  },
  {
    id: "miami-fl",
    name: "Miami, FL",
    state: "FL",
    date: "2021/08/19",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585994/joeyhouhomepage/yb1juo5njw0cpfpq9xlv.jpg",
    description: "13-5"
  },
  {
    id: "orlando-fl",
    name: "Orlando, FL",
    state: "FL",
    date: "2021/08/19",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585841/joeyhouhomepage/mb8wvlntchf5gxz4o6t8.jpg",
    description: "13-3"
  },
  {
    id: "fayetteville-nc",
    name: "Fayetteville, NC",
    state: "NC",
    date: "2021/08/19",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585609/joeyhouhomepage/mho5aqxrhkmzpb8a4tph.jpg",
    description: "12-4"
  },
  {
    id: "savannah-ga",
    name: "Savannah, GA",
    state: "GA",
    date: "2021/08/19",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585688/joeyhouhomepage/d1spw4ecewnczmyxkyfd.jpg",
    description: "13-1"
  },
  {
    id: "richmond-va",
    name: "Richmond, VA",
    state: "VA",
    date: "2021/08/18",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585534/joeyhouhomepage/qvrr4hvckhxsdhtcunlu.jpg",
    description: "12-3"
  },
  {
    id: "baltimore-md",
    name: "Baltimore, MD",
    state: "MD",
    date: "2021/08/18",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585495/joeyhouhomepage/wlnvnfj8jq9lexngxjc5.jpg",
    description: "12-2"
  },
  {
    id: "newark-nj",
    name: "Newark, NJ",
    state: "NJ",
    date: "2021/08/18",
    route: "Silver Meteor",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636585435/joeyhouhomepage/roqu43k8iznacfbc1nxl.jpg",
    description: "12-1"
  },
  {
    id: "34th-street-new-york-ny",
    name: "34th Street, New York, NY",
    state: "NY",
    date: "2021/08/18",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421841/joeyhouhomepage/wcj0hussgiis1duwmakb.jpg",
    description: "11-5"
  },
  {
    id: "lynchburg-va",
    name: "Lynchburg, VA",
    state: "VA",
    date: "2021/08/17",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421643/joeyhouhomepage/e0ve9bz9w5weegvbdkzz.jpg",
    description: "11-2"
  },
  {
    id: "charlottesville-va",
    name: "Charlottesville, VA",
    state: "VA",
    date: "2021/08/17",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421713/joeyhouhomepage/z1snuxxu3zhfg1w2jinx.jpg",
    description: "11-3"
  },
  {
    id: "greensboro-nc",
    name: "Greensboro, NC",
    state: "NC",
    date: "2021/08/17",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421574/joeyhouhomepage/qhdicgnp3yrq1ifjffjd.jpg",
    description: "11-1"
  },
  {
    id: "washington-dc",
    name: "Washington D.C.",
    state: "Unknown",
    date: "2021/08/17",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421767/joeyhouhomepage/vrah1stf4emxgxix3yc5.jpg",
    description: "11-4"
  },
  {
    id: "tuscaloosa-al",
    name: "Tuscaloosa, AL",
    state: "AL",
    date: "2021/08/16",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421379/joeyhouhomepage/pcdsyk5aawbp3rwix7sm.jpg",
    description: "10-4"
  },
  {
    id: "union-station-new-orleans",
    name: "Union Station, New Orleans",
    state: "New Orleans",
    date: "2021/08/16",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421063/joeyhouhomepage/cjllqcxkbeirbxeytwbn.jpg",
    description: "9-5"
  },
  {
    id: "hattiesburg-ms",
    name: "Hattiesburg, MS",
    state: "MS",
    date: "2021/08/16",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421263/joeyhouhomepage/n0owhqftyhfrh5toyguo.jpg",
    description: "10-2"
  },
  {
    id: "atlanta-ga",
    name: "Atlanta, GA",
    state: "GA",
    date: "2021/08/16",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421502/joeyhouhomepage/nwdxhdp30plr9i1d4lkp.jpg",
    description: "10-6"
  },
  {
    id: "meridian-ms",
    name: "Meridian, MS",
    state: "MS",
    date: "2021/08/16",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421321/joeyhouhomepage/tp62smmjvyhzuzwqt1vr.jpg",
    description: "10-3"
  },
  {
    id: "new-orleans-french-quarter",
    name: "New Orleans French Quarter",
    state: "Unknown",
    date: "2021/08/16",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421161/joeyhouhomepage/ls0tqdrrcqfqmpmfqgs2.jpg",
    description: "10-1"
  },
  {
    id: "birmingham-al",
    name: "Birmingham, AL",
    state: "AL",
    date: "2021/08/16",
    route: "Crescent",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636421455/joeyhouhomepage/mi4sxhegvbdurzpto8jx.jpg",
    description: "10-5"
  },
  {
    id: "memphis-tn",
    name: "Memphis, TN",
    state: "TN",
    date: "2021/08/15",
    route: "City of New Orleans",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420795/joeyhouhomepage/ovstyvwo9kkaaipn0ogv.jpg",
    description: "9-1"
  },
  {
    id: "jackson-ms",
    name: "Jackson, MS",
    state: "MS",
    date: "2021/08/15",
    route: "City of New Orleans",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420853/joeyhouhomepage/m1ov67guowa0fpdvx7dl.jpg",
    description: "9-2"
  },
  {
    id: "mccomb-ms",
    name: "McComb, MS",
    state: "MS",
    date: "2021/08/15",
    route: "City of New Orleans",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420916/joeyhouhomepage/foucfithel97hltymllx.jpg",
    description: "9-3"
  },
  {
    id: "new-orleans-la",
    name: "New Orleans, LA",
    state: "LA",
    date: "2021/08/15",
    route: "City of New Orleans",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420986/joeyhouhomepage/ijdldrzevfqa9bchazrn.jpg",
    description: "9-4"
  },
  {
    id: "columbus-wi",
    name: "Columbus, WI",
    state: "WI",
    date: "2021/08/14",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420435/joeyhouhomepage/i3rxpsityrtddazdmyiq.jpg",
    description: "8-3"
  },
  {
    id: "minneapolis-mn",
    name: "Minneapolis, MN",
    state: "MN",
    date: "2021/08/14",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420313/joeyhouhomepage/jxaxgxzipzakkt4tshtr.jpg",
    description: "8-1"
  },
  {
    id: "asia-on-argyle-chicago",
    name: "Asia on Argyle, Chicago",
    state: "Chicago",
    date: "2021/08/14",
    route: "City of New Orleans",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420668/joeyhouhomepage/giqlubl2rt6l0qvf7nc6.jpg",
    description: "8-6"
  },
  {
    id: "milwaukee-wi",
    name: "Milwaukee, WI",
    state: "WI",
    date: "2021/08/14",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420516/joeyhouhomepage/n3igzxrwutd75jeeo4c8.jpg",
    description: "8-4"
  },
  {
    id: "chinatown-chicago",
    name: "Chinatown, Chicago",
    state: "Chicago",
    date: "2021/08/14",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420578/joeyhouhomepage/rnqdwyzq5n6uais5i0fj.jpg",
    description: "8-5"
  },
  {
    id: "winona-mn",
    name: "Winona, MN",
    state: "MN",
    date: "2021/08/14",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420369/joeyhouhomepage/ak0oa1u4qpahgrhbjifo.jpg",
    description: "8-2"
  },
  {
    id: "havre-mt",
    name: "Havre, MT",
    state: "MT",
    date: "2021/08/13",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420019/joeyhouhomepage/vg3uxopys6sndniaptuy.jpg",
    description: "7-3"
  },
  {
    id: "minot-nd",
    name: "Minot, ND",
    state: "ND",
    date: "2021/08/13",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420230/joeyhouhomepage/ezdwukpnxanmf7tgozmv.jpg",
    description: "7-6"
  },
  {
    id: "sandpoint-id",
    name: "Sandpoint, ID",
    state: "ID",
    date: "2021/08/13",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636419851/joeyhouhomepage/webmceqdqn5ddzcaafnf.jpg",
    description: "5-5"
  },
  {
    id: "wolf-point-mt",
    name: "Wolf Point, MT",
    state: "MT",
    date: "2021/08/13",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420096/joeyhouhomepage/ec5krupgaayfhedt5jnf.jpg",
    description: "7-4"
  },
  {
    id: "williston-nd",
    name: "Williston, ND",
    state: "ND",
    date: "2021/08/13",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636420155/joeyhouhomepage/lwoavwgbxdvukjvdedku.jpg",
    description: "7-5"
  },
  {
    id: "shelby-mt",
    name: "Shelby, MT",
    state: "MT",
    date: "2021/08/13",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636419960/joeyhouhomepage/rvwm4hwaqa7ndwfn3c22.jpg",
    description: "7-2"
  },
  {
    id: "whitefish-mt",
    name: "Whitefish, MT",
    state: "MT",
    date: "2021/08/13",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636419898/joeyhouhomepage/vtdupn5jgf8nqljqdviq.jpg",
    description: "6-1"
  },
  {
    id: "pasco-wa",
    name: "Pasco, WA",
    state: "WA",
    date: "2021/08/12",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636419752/joeyhouhomepage/dv3woeqoahll88qlsk8b.jpg",
    description: "5-3"
  },
  {
    id: "chinatown-portland-or",
    name: "Chinatown, Portland, OR",
    state: "OR",
    date: "2021/08/12",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636419626/joeyhouhomepage/cxbrt8imegehgz2cgclc.jpg",
    description: "6-1"
  },
  {
    id: "wishram-wa",
    name: "Wishram, WA",
    state: "WA",
    date: "2021/08/12",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636419687/joeyhouhomepage/gag4ymulslop2otnsylv.jpg",
    description: "6-2"
  },
  {
    id: "spokane-wa",
    name: "Spokane, WA",
    state: "WA",
    date: "2021/08/12",
    route: "Empire Builder",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636419805/joeyhouhomepage/zjyjguw8vl612gvfqdtd.jpg",
    description: "5-4"
  },
  {
    id: "portland-or",
    name: "Portland, OR",
    state: "OR",
    date: "2021/08/11",
    route: "Airplane",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411774/joeyhouhomepage/nwcc0kryk7sva2fhsef6.jpg",
    description: "5-3"
  },
  {
    id: "univercity-of-california-berkeley",
    name: "Univercity of California Berkeley",
    state: "Unknown",
    date: "2021/08/11",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411498/joeyhouhomepage/jpqfkzfxvy6m4e2racjw.jpg",
    description: "5-1"
  },
  {
    id: "chinatown-san-francisco",
    name: "Chinatown, San Francisco",
    state: "San Francisco",
    date: "2021/08/11",
    route: "Airplane",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411698/joeyhouhomepage/siin6z6h3bhzdz7v3ig1.jpg",
    description: "5-2"
  },
  {
    id: "fishermans-wharf-san-francisco",
    name: "Fisherman's Wharf, San Francisco",
    state: "San Francisco",
    date: "2021/08/10",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411421/joeyhouhomepage/jnptep3cirzoswqmyapy.jpg",
    description: "4-5"
  },
  {
    id: "colfax-ca",
    name: "Colfax, CA",
    state: "CA",
    date: "2021/08/10",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411208/joeyhouhomepage/nyvxcm3l46kn8pyy7vyk.jpg",
    description: "4-2"
  },
  {
    id: "emeryville-ca",
    name: "Emeryville, CA",
    state: "CA",
    date: "2021/08/10",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411337/joeyhouhomepage/n7uuzdjoybv5oocykqfk.jpg",
    description: "4-4"
  },
  {
    id: "reno-nv",
    name: "Reno, NV",
    state: "NV",
    date: "2021/08/10",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411159/joeyhouhomepage/qvafz1ovrju8prbvvphe.jpg",
    description: "4-1"
  },
  {
    id: "sacramento-ca",
    name: "Sacramento, CA",
    state: "CA",
    date: "2021/08/10",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411267/joeyhouhomepage/tudlsvept8cic8h4unou.jpg",
    description: "4-3"
  },
  {
    id: "grand-junction-co",
    name: "Grand Junction, CO",
    state: "CO",
    date: "2021/08/09",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410975/joeyhouhomepage/ukstlvrb7pufegwvq2ka.jpg",
    description: "3-4"
  },
  {
    id: "helper-ut",
    name: "Helper, UT",
    state: "UT",
    date: "2021/08/09",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411035/joeyhouhomepage/yekewijbfz8x1ap1yfdh.jpg",
    description: "3-5"
  },
  {
    id: "salt-lake-city-ut",
    name: "Salt Lake City, UT",
    state: "UT",
    date: "2021/08/09",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411107/joeyhouhomepage/pxtasfnaemhdrxwzz3j5.jpg",
    description: "3-6"
  },
  {
    id: "granby-colorado",
    name: "Granby, Colorado",
    state: "Colorado",
    date: "2021/08/09",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410777/joeyhouhomepage/manx1yjyxeeljrwedgfp.jpg",
    description: "3-2"
  },
  {
    id: "denver-co",
    name: "Denver, CO",
    state: "CO",
    date: "2021/08/09",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410658/joeyhouhomepage/apjryalysi4xaxrvgocr.jpg",
    description: "3-1"
  },
  {
    id: "glenwood-springs-co",
    name: "Glenwood Springs, CO",
    state: "CO",
    date: "2021/08/09",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410868/joeyhouhomepage/jmd9y8aahgqnpay0rsql.jpg",
    description: "3-3"
  },
  {
    id: "lincoln-ne",
    name: "Lincoln, NE",
    state: "NE",
    date: "2021/08/08",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410573/joeyhouhomepage/dfpsl2qzltd2xnlkzx6d.jpg",
    description: "2-8"
  },
  {
    id: "galesburg-il",
    name: "Galesburg, IL",
    state: "IL",
    date: "2021/08/08",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410310/joeyhouhomepage/cyot5y742oh0aagq5r4k.jpg",
    description: "2-4"
  },
  {
    id: "naperville-il",
    name: "Naperville, IL",
    state: "IL",
    date: "2021/08/08",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410249/joeyhouhomepage/wep0pogca5xdfagb1v0g.jpg",
    description: "2-3"
  },
  {
    id: "toledo-oh",
    name: "Toledo, OH",
    state: "OH",
    date: "2021/08/08",
    route: "Capital Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410120/joeyhouhomepage/wdivuxf3i1ngn5yklmhj.jpg",
    description: "2-1"
  },
  {
    id: "chicago-il-1",
    name: "Chicago, IL",
    state: "IL",
    date: "2021/08/08",
    route: "Capital Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410190/joeyhouhomepage/nnk376sy1lzuhnxw3lhv.jpg",
    description: "2-2"
  },
  {
    id: "mount-pleasant-ia",
    name: "Mount Pleasant, IA",
    state: "IA",
    date: "2021/08/08",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410381/joeyhouhomepage/pg4jj5uhsby2bvjcbmcb.jpg",
    description: "2-5"
  },
  {
    id: "omaha-ne",
    name: "Omaha, NE",
    state: "NE",
    date: "2021/08/08",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410507/joeyhouhomepage/j1skrd4tlyxualvidqxp.jpg",
    description: "2-7"
  },
  {
    id: "osceola-ia",
    name: "Osceola, IA",
    state: "IA",
    date: "2021/08/08",
    route: "California Zephyr",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410453/joeyhouhomepage/uth6xmqqg4dxdl42ycxc.jpg",
    description: "2-6"
  },
  {
    id: "new-york-ny",
    name: "New York, NY",
    state: "NY",
    date: "2021/08/07",
    route: "Pennsylvanian",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636409580/joeyhouhomepage/op3bglnuuaqwfkr9hh2o.jpg",
    description: "1-1"
  },
  {
    id: "altoona-pa",
    name: "Altoona, PA",
    state: "PA",
    date: "2021/08/07",
    route: "Pennsylvanian",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636409710/joeyhouhomepage/xxc8uhapdsow4y89toko.jpg",
    description: "1-3"
  },
  {
    id: "harrisburg-pa",
    name: "Harrisburg, PA",
    state: "PA",
    date: "2021/08/07",
    route: "Pennsylvanian",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636409655/joeyhouhomepage/j6pbmidrhaqi2rztlytt.jpg",
    description: "1-2"
  },
  {
    id: "cmu-pittsburgh-pa",
    name: "CMU, Pittsburgh, PA",
    state: "PA",
    date: "2021/08/07",
    route: "Capital Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410035/joeyhouhomepage/bhvwzddtidunwxcjeqth.jpg",
    description: "1-5"
  },
  {
    id: "pittsburgh-pa",
    name: "Pittsburgh, PA",
    state: "PA",
    date: "2021/08/07",
    route: "Pennsylvanian",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636409975/joeyhouhomepage/fhfmucnslcx6cijeeydk.jpg",
    description: "1-4"
  },
  {
    id: "new-london-ct",
    name: "New London, CT",
    state: "CT",
    date: "2021/07/29",
    route: "Amtrak",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606262/joeyhouhomepage/loeycuwkb3eoaq6fm495.png",
    description: "US Coast Guard"
  },
  {
    id: "portland-maine",
    name: "Portland, Maine",
    state: "Maine",
    date: "2021/07/28",
    route: "Amtrak",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636605116/joeyhouhomepage/njjnejpmroku5ewv9gim.png",
    description: "Maine"
  },
  {
    id: "lavender-by-the-bay-new-york",
    name: "Lavender By the Bay, New York",
    state: "New York",
    date: "2021/07/15",
    route: "Long Island Railroad",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606324/joeyhouhomepage/ryf5poulvzzzbssxfaad.png",
    description: "Greenport"
  },
  {
    id: "new-rochelle-ny",
    name: "New Rochelle, NY",
    state: "NY",
    date: "2021/07/09",
    route: "Metro-North",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606406/joeyhouhomepage/knfxwvjpfn2xs63bbdlw.png",
    description: "Firefly"
  },
  {
    id: "wilmington-de",
    name: "Wilmington, DE",
    state: "DE",
    date: "2021/06/17",
    route: "Amtrak",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606465/joeyhouhomepage/oyqkzavow9yso0owsagl.png",
    description: "Longwood Gardens"
  },
  {
    id: "norfolk-va",
    name: "Norfolk, VA",
    state: "VA",
    date: "2021/05/31",
    route: "Amtrak",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606522/joeyhouhomepage/vsm04oj6vjtrz4oq2tj8.png",
    description: "Virginia"
  },
  {
    id: "capitol-harrisburg-pa",
    name: "Capitol, Harrisburg, PA",
    state: "PA",
    date: "2021/05/13",
    route: "Amtrak",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606590/joeyhouhomepage/uya5z2ophbnsid1oercl.png",
    description: "Harrisburg"
  },
  {
    id: "atlantic-city-nj",
    name: "Atlantic City, NJ",
    state: "NJ",
    date: "2021/05/02",
    route: "NJ Transit",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606628/joeyhouhomepage/spzirofbvfwlco6riju6.png",
    description: "Atlantic City"
  },
  {
    id: "port-jervis-nj",
    name: "Port Jervis, NJ",
    state: "NJ",
    date: "2021/05/01",
    route: "Metro-North",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636606678/joeyhouhomepage/kdyiterlqgemprzy7tz5.png",
    description: "Tri-States"
  },
  {
    id: "capitol-albany-ny",
    name: "Capitol, Albany, NY",
    state: "NY",
    date: "2021/04/16",
    route: "Amtrak",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636699746/joeyhouhomepage/ibza87qgviae0mukrbge.png",
    description: "1"
  },
  {
    id: "hartford-ct",
    name: "Hartford, CT",
    state: "CT",
    date: "2021/04/08",
    route: "Amtrak",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636699777/joeyhouhomepage/yakwcpnpkjxfudldrtjw.png",
    description: "1"
  },
  {
    id: "great-neck-ny",
    name: "Great Neck, NY",
    state: "NY",
    date: "2021/03/31",
    route: "Long Island Railroad",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636699813/joeyhouhomepage/kwc396cmvbjbyw1ri528.png",
    description: "1"
  },
  {
    id: "orchard-beach-bronx-ny",
    name: "Orchard Beach, Bronx, NY",
    state: "NY",
    date: "2021/03/11",
    route: "NYC",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636699853/joeyhouhomepage/bgtkpf9d8mgtydpobxnb.png",
    description: "1"
  },
  {
    id: "edgewater-nj",
    name: "Edgewater, NJ",
    state: "NJ",
    date: "2021/03/04",
    route: "NJ Transit",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636699889/joeyhouhomepage/v7oulqi6fx6szlvn5ord.png",
    description: "1"
  },
  {
    id: "fort-lee-nj",
    name: "Fort Lee, NJ",
    state: "NJ",
    date: "2021/02/05",
    route: "NJ Transit",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636699925/joeyhouhomepage/ojrwvhb9t84rl0lfwxh9.png",
    description: "1"
  },
  {
    id: "exchange-place-jersey-city-nj",
    name: "Exchange Place, Jersey City, NJ",
    state: "NJ",
    date: "2021/01/28",
    route: "PATH",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636699967/joeyhouhomepage/juiuakdxkdl3l9w2813i.png",
    description: "1"
  },
  {
    id: "rockaway-beach-new-york-ny",
    name: "Rockaway Beach, New York, NY",
    state: "NY",
    date: "2020/12/13",
    route: "NYC",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636700029/joeyhouhomepage/gh552hlws0nqoo2tnzb4.png",
    description: "1"
  },
  {
    id: "long-beach-ny",
    name: "Long Beach, NY",
    state: "NY",
    date: "2020/09/14",
    route: "Long Island Railroad",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636700100/joeyhouhomepage/fomjbxane7fipwurfijy.png",
    description: "1"
  },
  {
    id: "harpers-ferry-wv",
    name: "Harpers Ferry, WV",
    state: "WV",
    date: "2020/08/30",
    route: "Capitol Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636861087/joeyhouhomepage/hcjje0wq8en6bwpgpius.jpg",
    description: "9-2"
  },
  {
    id: "washington-dc-union-station",
    name: "Washington D.C. Union Station",
    state: "Unknown",
    date: "2020/08/30",
    route: "Capitol Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636861142/joeyhouhomepage/hwr0ibnqj22bnngmagll.jpg",
    description: "9-3"
  },
  {
    id: "white-house-washington-dc",
    name: "White House, Washington D.C.",
    state: "Washington D.C.",
    date: "2020/08/30",
    route: "Northeast Regional",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636861204/joeyhouhomepage/qxk7foz9iatbmxsdgfnv.jpg",
    description: "9-4"
  },
  {
    id: "cumberland-md",
    name: "Cumberland, MD",
    state: "MD",
    date: "2020/08/30",
    route: "Capitol Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636861038/joeyhouhomepage/yym3wppwyiialgeq8xir.jpg",
    description: "9-1"
  },
  {
    id: "chicago-union-station",
    name: "Chicago Union Station",
    state: "Unknown",
    date: "2020/08/29",
    route: "Capitol Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860808/joeyhouhomepage/fwpeen3uphwi7py33xme.jpg",
    description: "8-3"
  },
  {
    id: "chicago-il",
    name: "Chicago, IL",
    state: "IL",
    date: "2020/08/29",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860738/joeyhouhomepage/cbhyfmphtyfeourrfwde.jpg",
    description: "8-2"
  },
  {
    id: "amtrak-toledo-oh",
    name: "Amtrak, Toledo, OH",
    state: "OH",
    date: "2020/08/29",
    route: "Capitol Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860974/joeyhouhomepage/njeuhxh8uwnbejwxjkg0.jpg",
    description: "8-5"
  },
  {
    id: "st-louis-mo",
    name: "St. Louis, MO",
    state: "MO",
    date: "2020/08/29",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860654/joeyhouhomepage/thzwjpe0u0aftibrxlex.jpg",
    description: "8-1"
  },
  {
    id: "south-bend-in",
    name: "South Bend, IN",
    state: "IN",
    date: "2020/08/29",
    route: "Capitol Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860854/joeyhouhomepage/vtzlxjjmx3hkjxbaerej.jpg",
    description: "8-4"
  },
  {
    id: "fort-worth-tx",
    name: "Fort Worth, TX",
    state: "TX",
    date: "2020/08/28",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860499/joeyhouhomepage/htrqkgawxzuqilrzyqf0.jpg",
    description: "7-3"
  },
  {
    id: "little-rock-ar",
    name: "Little Rock, AR",
    state: "AR",
    date: "2020/08/28",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860602/joeyhouhomepage/yggz0vaeszcrv9g12ue1.jpg",
    description: "7-5"
  },
  {
    id: "san-antonio-tx",
    name: "San Antonio, TX",
    state: "TX",
    date: "2020/08/28",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860389/joeyhouhomepage/pp8bq4xpeecrokudprpk.jpg",
    description: "7-1"
  },
  {
    id: "austin-tx",
    name: "Austin, TX",
    state: "TX",
    date: "2020/08/28",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860445/joeyhouhomepage/oqi5oxenkjyt5yvchgqh.jpg",
    description: "7-2"
  },
  {
    id: "texarkana-tx",
    name: "Texarkana, TX",
    state: "TX",
    date: "2020/08/28",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860556/joeyhouhomepage/a4krqowglrvbmnvjkqpy.jpg",
    description: "7-4"
  },
  {
    id: "alpine-tx",
    name: "Alpine, TX",
    state: "TX",
    date: "2020/08/27",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860321/joeyhouhomepage/vi4opcwbepxzspau1bnp.jpg",
    description: "6-3"
  },
  {
    id: "tucson-az",
    name: "Tucson, AZ",
    state: "AZ",
    date: "2020/08/27",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860139/joeyhouhomepage/uxmutnpqud2mhdrm0yy6.jpg",
    description: "6-1"
  },
  {
    id: "el-paso-tx",
    name: "El Paso, TX",
    state: "TX",
    date: "2020/08/27",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860189/joeyhouhomepage/ofjez1xzqbj3snllro0v.jpg",
    description: "6-2"
  },
  {
    id: "ciudad-juarez-mexico",
    name: "Ciudad Juarez, Mexico",
    state: "Mexico",
    date: "2020/08/27",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860274/joeyhouhomepage/xkqsc8pbk0w7waenqmdf.jpg",
    description: "6-2"
  },
  {
    id: "chinatown-los-angeles",
    name: "Chinatown, Los Angeles",
    state: "Los Angeles",
    date: "2020/08/26",
    route: "Texas Eagle",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860087/joeyhouhomepage/gxu2hm2q8qszf4cgvbkg.jpg",
    description: "5-2"
  },
  {
    id: "san-diego-ca",
    name: "San Diego, CA",
    state: "CA",
    date: "2020/08/26",
    route: "Pacific Surfliner",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636860016/joeyhouhomepage/y1iva0ohp77edaklyr3v.jpg",
    description: "5-1"
  },
  {
    id: "san-diego-santa-fe-depot",
    name: "San Diego Santa Fe Depot",
    state: "Unknown",
    date: "2020/08/25",
    route: "Pacific Surfliner",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859791/joeyhouhomepage/ycuol2e3k1vij7k03esv.jpg",
    description: "4-3"
  },
  {
    id: "san-ysidro-ca",
    name: "San Ysidro, CA",
    state: "CA",
    date: "2020/08/25",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859861/joeyhouhomepage/uwjnlhbdkefuafs4fcrr.jpg",
    description: "4-4"
  },
  {
    id: "los-angeles-ca",
    name: "Los Angeles, CA",
    state: "CA",
    date: "2020/08/25",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859664/joeyhouhomepage/ymfetrtjwmkhplol5u6h.jpg",
    description: "4-1"
  },
  {
    id: "union-station-los-angeles",
    name: "Union Station, Los Angeles",
    state: "Los Angeles",
    date: "2020/08/25",
    route: "Pacific Surfliner",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859727/joeyhouhomepage/yfptzxxlpy0fcmy2lkrx.jpg",
    description: "4-2"
  },
  {
    id: "tijuana-mexico",
    name: "Tijuana, Mexico",
    state: "Mexico",
    date: "2020/08/25",
    route: "Ground Transportation",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859931/joeyhouhomepage/h1itr99iiu12fpsopacb.jpg",
    description: "4-4"
  },
  {
    id: "flagstaff-az",
    name: "Flagstaff, AZ",
    state: "AZ",
    date: "2020/08/24",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859615/joeyhouhomepage/lvrydvrqwfunmq2lh4l8.jpg",
    description: "3-6"
  },
  {
    id: "las-vegas-new-mexico",
    name: "Las Vegas, New Mexico",
    state: "New Mexico",
    date: "2020/08/24",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859420/joeyhouhomepage/lvq93bddeym1spztaikk.jpg",
    description: "3-3"
  },
  {
    id: "la-junta-co",
    name: "La Junta, CO",
    state: "CO",
    date: "2020/08/24",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859280/joeyhouhomepage/qiyhdhk3mhbgzmztilcj.jpg",
    description: "3-1"
  },
  {
    id: "albuquerque-nm",
    name: "Albuquerque, NM",
    state: "NM",
    date: "2020/08/24",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859495/joeyhouhomepage/ndufgj0sinwuvmh0rp77.jpg",
    description: "3-4"
  },
  {
    id: "topeka-kansas",
    name: "Topeka, Kansas",
    state: "Kansas",
    date: "2020/08/24",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859185/joeyhouhomepage/hmpbf6a2drpoqhetjd5b.jpg",
    description: "2-8"
  },
  {
    id: "gallup-nm",
    name: "Gallup, NM",
    state: "NM",
    date: "2020/08/24",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859551/joeyhouhomepage/xqbgk7lyl1ifif38syyc.jpg",
    description: "3-5"
  },
  {
    id: "raton-nm",
    name: "Raton, NM",
    state: "NM",
    date: "2020/08/24",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859357/joeyhouhomepage/xsvefm1nbi019cwlmzcq.jpg",
    description: "3-2"
  },
  {
    id: "mendota-il",
    name: "Mendota, IL",
    state: "IL",
    date: "2020/08/23",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858826/joeyhouhomepage/zvkzretv13ez5wiluah5.jpg",
    description: "2-5"
  },
  {
    id: "fort-madison-ia",
    name: "Fort Madison, IA",
    state: "IA",
    date: "2020/08/23",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858939/joeyhouhomepage/g2ydovgg3bbdmnfmnz57.jpg",
    description: "2-6"
  },
  {
    id: "kansas-city-ks",
    name: "Kansas City, KS",
    state: "KS",
    date: "2020/08/23",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636859033/joeyhouhomepage/aeegi2na3jyp85keg6jw.jpg",
    description: "2-7"
  },
  {
    id: "elkhart-in",
    name: "Elkhart, IN",
    state: "IN",
    date: "2020/08/23",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858648/joeyhouhomepage/uo6xpxpkcpupuh2lteej.jpg",
    description: "2-1"
  },
  {
    id: "chicago-union-station-1",
    name: "Chicago Union Station",
    state: "Unknown",
    date: "2020/08/23",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858712/joeyhouhomepage/lxv4zdux1syvd7w5qkl6.jpg",
    description: "2-3"
  },
  {
    id: "the-chicago-loop",
    name: "The Chicago Loop",
    state: "Unknown",
    date: "2020/08/23",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858779/joeyhouhomepage/e2bfm72tqwlrzw1xgriu.jpg",
    description: "2-4"
  },
  {
    id: "kansas-city-mo",
    name: "Kansas City, MO",
    state: "MO",
    date: "2020/08/23",
    route: "Southwest Chief",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858990/joeyhouhomepage/huo6kg94fxwnp9sf64y1.jpg",
    description: "2-7"
  },
  {
    id: "syracuse-ny",
    name: "Syracuse, NY",
    state: "NY",
    date: "2020/08/22",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858472/joeyhouhomepage/btkjmpthwkyicfog0mei.jpg",
    description: "1-4"
  },
  {
    id: "poughkeepsie-ny",
    name: "Poughkeepsie, NY",
    state: "NY",
    date: "2020/08/22",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858305/joeyhouhomepage/s1fzydpax4i9f8vpfbom.jpg",
    description: "1-2"
  },
  {
    id: "penn-station-new-york",
    name: "Penn Station, New York",
    state: "New York",
    date: "2020/08/22",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858212/joeyhouhomepage/rnetojfl4loer19tgng4.jpg",
    description: "1-1"
  },
  {
    id: "rochester-ny",
    name: "Rochester, NY",
    state: "NY",
    date: "2020/08/22",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858518/joeyhouhomepage/qcaell6y6yhbthkpwr3t.jpg",
    description: "1-5"
  },
  {
    id: "amtrak-albany-ny",
    name: "Amtrak, Albany, NY",
    state: "NY",
    date: "2020/08/22",
    route: "Lake Shore Limited",
    imageUrl: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636858414/joeyhouhomepage/lhasmud6inzzm5xrhsg1.jpg",
    description: "1-3"
  }
]

// Required for static export
export function generateStaticParams() {
  return placesData.map((place) => ({
    id: place.id
  }))
}

// Get place data by ID
function getPlaceData(id: string) {
  const place = placesData.find(p => p.id === id)
  if (!place) {
    // Return a default place if not found
    return placesData[0]
  }

  return {
    ...place,
    coordinates: [-104.9903, 39.7392], // Default coordinates
    images: place.images || [
      {
        url: place.imageUrl,
        caption: `${place.name} station and surroundings`
      }
    ],
    transportation: {
      type: "Train",
      service: place.route,
      direction: "Various",
      nextStop: "Next destination",
      previousStop: "Previous destination"
    }
  }
}

export default function PlaceDetailPage({ params }: { params: { id: string } }) {
  const place = getPlaceData(params.id)

  return <PlaceDetailClient place={place} />
}