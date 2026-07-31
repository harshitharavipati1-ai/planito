import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  navHome: string;
  navDashboard: string;
  navPlantVision: string;
  navWeather: string;
  navPlanner: string;
  navWhatIf: string;
  navUrbanTrees: string;
  navAdminPanel: string;
  farmerLogin: string;
  farmerAuthSecurity: string;
  exportPdf: string;
  welcomeBack: string;
  activeLanguage: string;
  languageNote: string;
  scanPhoto: string;
  ecoSavings: string;
  aiAssistant: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'GreenGrow AI',
    appTagline: 'AI Crop Protection & Climate Resilience',
    navHome: 'Home',
    navDashboard: 'Dashboard',
    navPlantVision: 'Plant Vision AI',
    navWeather: 'Weather',
    navPlanner: 'Care Planner',
    navWhatIf: 'What-If AI',
    navUrbanTrees: 'Urban Trees',
    navAdminPanel: 'Admin Panel',
    farmerLogin: 'Farmer Login',
    farmerAuthSecurity: 'Farmer Auth & Security',
    exportPdf: 'Export PDF',
    welcomeBack: 'Welcome back',
    activeLanguage: 'Language Preference',
    languageNote: 'Language set at login',
    scanPhoto: 'Scan Photo',
    ecoSavings: 'Eco Savings',
    aiAssistant: 'AI Assistant',
  },
  te: {
    appName: 'గ్రీన్‌గ్రో AI',
    appTagline: 'AI పంట రక్షణ & వాతావరణ సమర్థత',
    navHome: 'హోమ్',
    navDashboard: 'డాష్‌బోర్డ్',
    navPlantVision: 'ప్లాంట్ విజన్ AI',
    navWeather: 'వాతావరణం',
    navPlanner: 'సంరక్షణ ప్రణాళిక',
    navWhatIf: 'వాట్-ఇఫ్ AI',
    navUrbanTrees: 'పట్టణ చెట్లు',
    navAdminPanel: 'అడ్మిన్ ప్యానెల్',
    farmerLogin: 'రైతు లాగిన్',
    farmerAuthSecurity: 'రైతు భద్రత & లాగిన్',
    exportPdf: 'PDF డౌన్‌లోడ్',
    welcomeBack: 'స్వాగతం',
    activeLanguage: 'ఎంచుకున్న భాష',
    languageNote: 'లాగిన్‌లో ఎంచుకున్న భాష',
    scanPhoto: 'ఫోటో స్కాన్',
    ecoSavings: 'పర్యావరణ ఆదా',
    aiAssistant: 'AI సహాయకుడు',
  },
  hi: {
    appName: 'ग्रीनग्रो AI',
    appTagline: 'एआई फसल सुरक्षा और जलवायु अनुकूलन',
    navHome: 'होम',
    navDashboard: 'डैशबोर्ड',
    navPlantVision: 'प्लांट विज़न AI',
    navWeather: 'मौसम',
    navPlanner: 'देखभाल योजना',
    navWhatIf: 'व्हॉट-इफ AI',
    navUrbanTrees: 'शहरी पेड़',
    navAdminPanel: 'एडमिन पैनल',
    farmerLogin: 'किसान लॉगिन',
    farmerAuthSecurity: 'किसान सुरक्षा और लॉगिन',
    exportPdf: 'पीडीएफ डाउनलोड',
    welcomeBack: 'स्वागत है',
    activeLanguage: 'चुनी गई भाषा',
    languageNote: 'लॉगिन से निर्धारित भाषा',
    scanPhoto: 'फोटो स्कैन',
    ecoSavings: 'पर्यावरण बचत',
    aiAssistant: 'AI सहायक',
  },
  ta: {
    appName: 'கிரீன்குரோ AI',
    appTagline: 'AI பயிர் பாதுகாப்பு & காலநிலை பின்னடைவு',
    navHome: 'முகப்பு',
    navDashboard: 'டாஷ்போர்டு',
    navPlantVision: 'பிளான்ட் விஷன் AI',
    navWeather: 'வானிலை',
    navPlanner: 'பராமரிப்பு திட்டம்',
    navWhatIf: 'வாட்-இஃப் AI',
    navUrbanTrees: 'நகர மரங்கள்',
    navAdminPanel: 'நிர்வாக குழு',
    farmerLogin: 'விவசாயி உள்நுழைவு',
    farmerAuthSecurity: 'விவசாயி பாதுகாப்பு & உள்நுழைவு',
    exportPdf: 'PDF பதிவிறக்கம்',
    welcomeBack: 'வரவேற்கிறோம்',
    activeLanguage: 'தேர்ந்தெடுக்கப்பட்ட மொழி',
    languageNote: 'உள்நுழைவில் அமைக்கப்பட்ட மொழி',
    scanPhoto: 'புகைப்படம் ஸ்கேன்',
    ecoSavings: 'சுற்றுச்சூழல் சேமிப்பு',
    aiAssistant: 'AI உதவியாளர்',
  },
  kn: {
    appName: 'ಗ್ರೀನ್‌ಗ್ರೋ AI',
    appTagline: 'AI ಬೆಳೆ ರಕ್ಷಣೆ ಮತ್ತು ಹವಾಮಾನ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ',
    navHome: 'ಮುಖಪುಟ',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navPlantVision: 'ಪ್ಲಾಂಟ್ ವಿಷನ್ AI',
    navWeather: 'ಹವಾಮಾನ',
    navPlanner: 'ಆರೈಕೆ ಯೋಜನೆ',
    navWhatIf: 'ವಾಟ್-ಇಫ್ AI',
    navUrbanTrees: 'ನಗರದ ಮರಗಳು',
    navAdminPanel: 'ಆಡಳಿತ ಸಮಿತಿ',
    farmerLogin: 'ರೈತ ಲಾಗಿನ್',
    farmerAuthSecurity: 'ರೈತ ಭದ್ರತೆ & ಲಾಗಿನ್',
    exportPdf: 'PDF ಡೌನ್‌ಲೋಡ್',
    welcomeBack: 'ಸ್ವಾಗತ',
    activeLanguage: 'ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆ',
    languageNote: 'ಲಾಗಿನ್‌ನಲ್ಲಿ ಹೊಂದಿಸಲಾದ ಭಾಷೆ',
    scanPhoto: 'ಫೋಟೋ ಸ್ಕ್ಯಾನ್',
    ecoSavings: 'ಪರಿಸರ ಉಳಿತಾಯ',
    aiAssistant: 'AI ಸಹಾಯಕ',
  },
  mr: {
    appName: 'ग्रीनग्रो AI',
    appTagline: 'एआय पीक संरक्षण आणि हवामान अनुकूलता',
    navHome: 'मुख्यपृष्ठ',
    navDashboard: 'डॅशबोर्ड',
    navPlantVision: 'प्लांट व्हिजन AI',
    navWeather: 'हवामान',
    navPlanner: 'काळजी योजना',
    navWhatIf: 'व्हॉट-इफ AI',
    navUrbanTrees: 'शहरी झाडे',
    navAdminPanel: 'अॅडमिन पॅनेल',
    farmerLogin: 'शेतकरी लॉगिन',
    farmerAuthSecurity: 'शेतकरी सुरक्षा आणि लॉगिन',
    exportPdf: 'PDF डाउनलोड',
    welcomeBack: 'स्वागत आहे',
    activeLanguage: 'निवडलेली भाषा',
    languageNote: 'लॉगिनच्या वेळी निवडलेली भाषा',
    scanPhoto: 'फोटो स्कॅन',
    ecoSavings: 'पर्यावरण बचत',
    aiAssistant: 'AI सहाय्यक',
  },
};

export function t(key: keyof TranslationDictionary, lang: Language = 'en'): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dictionary[key] || TRANSLATIONS.en[key];
}

export function getLanguageName(lang: Language): string {
  switch (lang) {
    case 'te':
      return 'తెలుగు (Telugu)';
    case 'hi':
      return 'हिन्दी (Hindi)';
    case 'ta':
      return 'தமிழ் (Tamil)';
    case 'kn':
      return 'ಕನ್ನಡ (Kannada)';
    case 'mr':
      return 'मराठी (Marathi)';
    case 'en':
    default:
      return 'English';
  }
}

export const SUPPORTED_LANGUAGES: Array<{ code: Language; label: string; nativeName: string }> = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
];
