export const en = {
  // Navigation & Menu
  nav: {
    home: 'Home',
    journeys: 'Journeys',
    destinations: 'Destinations',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
  },

  // Homepage
  homepage: {
    title: "Joey Hou's Journal | United States",
    description: "Welcome to my travel journal site! Enjoy the pictures I take in the US on trains...and more!",
    slogan: "Exploring America by Rail",
    carouselText: "Pictures from my travels across America",
    journeysTitle: 'Featured Journeys',
    journeysSubtitle: 'Explore my most memorable train adventures',
    destinationsTitle: 'Recent Destinations',
    destinationText: 'Discover the places that shaped my rail journey across America',
    exploreButton: 'Explore',
    viewDetails: 'View Details',
  },

  // Journeys Page
  journeys: {
    pageTitle: 'Journeys',
    mapView: 'Map View',
    listView: 'List of Journeys',
    clickCards: 'Click the cards below to view the details!',
    mapHint1Title: 'Check out the map',
    mapHint1Route: 'Click on the markers to see the place name.',
    mapHint1Date: 'You can also view more details with the button.',
    mapHint2Title: 'As for golden markers...',
    mapHint2Route: 'Golden markers indicate cities with multiple visits.',
    mapHint2Date: 'Use the side buttons to navigate through them.',
    duration: 'Duration',
    places: 'places',
    noResults: 'Oh no...',
    noMatchingResult: 'There is no matching result.',
  },

  // Destinations Page
  destinations: {
    pageTitle: 'Destinations',
    mapView: 'Map View',
    listView: 'List of Places',
    clickCards: 'Click the cards below to view the details!',
    mapHint1Title: 'Check out the map',
    mapHint1Route: 'Click on the markers to see the place name.',
    mapHint1Date: 'You can also view more details with the button.',
    mapHint2Title: 'As for golden markers...',
    mapHint2Route: 'Golden markers indicate cities with multiple visits.',
    mapHint2Date: 'Use the side buttons to navigate through them.',
    location: 'Location',
    route: 'Route',
    date: 'Date',
    noResults: 'Oh no...',
    noMatchingResult: 'There is no matching result.',
  },

  // Buttons & Actions
  buttons: {
    explore: 'Explore',
    viewDetails: 'View Details',
    previous: 'Previous',
    next: 'Next',
    latestFirst: 'Latest First',
    earliestFirst: 'Earliest First',
    backToList: 'Back to List',
  },

  // Pagination
  pagination: {
    page: 'Page',
    of: 'of',
  },

  // Footer
  footer: {
    copyright: 'Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025',
  },

  // Map
  map: {
    loading: 'Loading map...',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  },

  // Journey Detail
  journeyDetail: {
    overview: 'Overview',
    route: 'Route',
    duration: 'Duration',
    totalPlaces: 'Total Places',
    description: 'Description',
    placesVisited: 'Places Visited',
    days: 'days',
    day: 'day',
    nights: 'nights',
    night: 'night',
  },

  // Destination Detail
  destinationDetail: {
    location: 'Location',
    route: 'Route',
    visitDate: 'Visit Date',
    gallery: 'Photo Gallery',
    state: 'State',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    notFound: 'Not Found',
  },

  // Error Page
  errorPage: {
    title: 'Oh no...',
    notFound: 'This page could not be found.',
  },

  // Email Subscription
  emailSubscription: {
    title: 'Email Subscription',
    description: 'Subscribe to get updates about my travels!',
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    languageLabel: 'Preferred Language',
    cancelButton: 'Cancel',
    confirmButton: 'Subscribe',
    invalidEmailError: 'Please enter a valid email address',
    successTitle: 'Subscription Successful!',
    successMessage: 'Thank you for subscribing! You will receive updates about my travels.',
    alreadySubscribedTitle: 'Already Subscribed',
    alreadySubscribedMessage: 'This email is already subscribed to receive updates.',
    okButton: 'OK',
  },

  // Fun Facts
  funFacts: {
    title: 'Fun Facts',
    description: 'I have visited {count} US states (and Washington DC).',
  },
}

export type Translations = typeof en
