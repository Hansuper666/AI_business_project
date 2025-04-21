// OAuth 2.0 Client Initialization for Dialogflow
const CLIENT_ID = '229410992558-td9cbs91d4eh0g6aai4mb0570g5tv1pa.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/dialogflow';

// Initialize the OAuth client
function initClient() {
  console.log('Initializing OAuth client...');
  
  // Check if gapi is loaded
  if (typeof gapi !== 'undefined') {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
        plugin_name: 'CMU Library Chatbot'
      }).then(() => {
        console.log('OAuth client initialized successfully');
        // Check if user is signed in
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
          console.log('User not signed in, attempting to sign in silently...');
          return gapi.auth2.getAuthInstance().signIn();
        }
      }).catch(error => {
        console.error('Error initializing OAuth client:', error);
      });
    });
  } else {
    console.warn('Google API client library not loaded');
  }
}

// Handle authentication for Dialogflow
window.addEventListener('load', function() {
  // Load the Google API client library
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.onload = initClient;
  document.head.appendChild(script);
  
  // Listen for auth errors from df-messenger
  const dfMessenger = document.querySelector('df-messenger');
  if (dfMessenger) {
    dfMessenger.addEventListener('df-messenger-error', (event) => {
      if (event.detail.error.includes('Authentication') || 
          event.detail.error.includes('authorization') ||
          event.detail.error.includes('Failed to fetch')) {
        console.log('Authentication error detected, attempting to re-authenticate...');
        initClient();
      }
    });
  }
}); 