"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations = {
  en: {
    heroTitle: "Vani Setu",
    heroSubtitle: "Connecting Every Voice to the Right Service",
    getStarted: "Get Started",
    howItWorks: "How it Works",
    howItWorksSub:
      "Accessing government services is now as simple as having a conversation.",
    step1Title: "Speak Naturally",
    step1Desc:
      "Just tap the microphone and explain what you need in your local language or dialect.",
    step2Title: "AI Analysis",
    step2Desc:
      "Our advanced AI identifies the exact government service and eligibility criteria for you.",
    step3Title: "Direct Action",
    step3Desc:
      "Get an instant guide, audio assistance, or a direct link to the application portal.",
    voiceTitle: "Voice Assistant",
    voicePlaceholder: "Status: Ready to listen...",
    voiceListening: "Listening...",
    voiceAnalyzing: "Analyzing your request...",
    back: "Back",
    home: "Home",
    learn: "Learn",
    services: "Services",
    scan: "Scan",
    rationCard: "Ration Card",
    agriculture: "Agriculture Support",
    healthcare: "Healthcare Service",
    education: "Education Help",
    socialWelfare: "Social Welfare",
    pmKisan: "PM-Kisan Nidhi",
    ayushmanBharat: "Ayushman Bharat",
    details: "Details",
    scanning: "Scanning Document...",
    save: "Save to Database",
    nextGenVoice: "Next Generation Voice Access",
    hllrbTitle: "HLLRB – Voice Access",
    forRuralIndia: "for Rural India",
    platformDesc:
      "An AI-powered platform that understands local dialects and connects citizens directly to government services.",
    startSpeaking: "Start Speaking",
    viewServices: "View Services",
    digitalEmpowerment: "Digital Empowerment",
    knowledgePower: "Knowledge is Power",
    forEveryCitizen: "for Every Citizen",
    learnDesc:
      "We don't just help you apply; we help you understand your rights. Learn about government schemes in your own language with our voice-guided educational hub.",
    openKnowledgeHub: "Open Knowledge Hub",
    govtSchemes: "Govt Schemes",
    simplifiedEligibility: "Simplified eligibility.",
    audioHelp: "Audio Help",
    listenDontRead: "Listen, don't read.",
    citizenRights: "Citizen Rights",
    knowYourLaw: "Know your law.",
    digitalSkills: "Digital Skills",
    learnToUseTech: "Learn to use tech.",
    dialectsTitle: "50+ Dialects",
    dialectsDesc: "Support for local languages from across India.",
    voiceGuidedTitle: "Voice Guided",
    voiceGuidedDesc: "No complex forms, just speak your needs.",
    directConnectTitle: "Direct Connect",
    directConnectDesc: "Seamlessly links to government portals.",
    goBack: "Go Back",
    readyToListen: "Ready to Listen",
    describeService:
      "Please describe the service you need in your local language.",
    tapMic: "Tap the microphone and tell me what you need.",
    detecting: "Detecting",
    languagesList: "Hindi / English / Regional",
    trySaying: 'Try saying: "I want to apply for a Ration Card"',
    govtServices: "Government Services",
    showingResultsFor: "Showing results for:",
    recommendedLabel: "Recommended",
    applyNow: "Apply Now",
    noServicesFound: "No services found",
    trySearchingElse: "Try searching for something else or browse categories.",
    voiceSearch: "Voice Search",
    catAll: "All",
    catFood: "Food",
    catIdentity: "Identity",
    catWelfare: "Welfare",
    catHealth: "Health",
    catAgriculture: "Agriculture",
    catHousing: "Housing",
    catEducation: "Education",
    serviceRationName: "NFSA Ration Card",
    serviceRationDesc:
      "Apply for new ration card or update existing one for subsidized grains.",
    serviceAadharName: "Aadhaar Services",
    serviceAadharDesc:
      "Update your address, name or link mobile number with your identity card.",
    servicePMKisanName: "PM-Kisan Nidhi",
    servicePMKisanDesc:
      "Financial assistance of Rs. 6000 directly to farmer bank accounts.",
    serviceAyushmanName: "Ayushman Bharat",
    serviceAyushmanDesc:
      "Health cover of Rs. 5 Lakh per family per year for secondary care.",
    serviceAwasName: "PM Awas Yojana",
    serviceAwasDesc:
      "Financial assistance for constructing a pucka house for eligible families.",
    servicePensionName: "Old Age Pension",
    servicePensionDesc:
      "Monthly financial assistance for senior citizens above 60 years.",
    learnEmpower: "Learn & Empower",
    learnSubtitle:
      "Simplified guides for government schemes and digital skills. Voice-enabled for your convenience.",
    hearGuide: "Hear Guide",
    viewDetails: "View Details",
    needMoreHelp: "Need more help?",
    helpDesc:
      'Our AI assistants are available in 50+ dialects to talk you through any government process. Just say "Help me understand".',
    startVoiceAssistant: "Start Voice Assistant",
    serviceDigitalName: "Digital Literacy",
    serviceDigitalDesc:
      "New to smartphones? Learn how to safely use UPI, WhatsApp, and Government apps.",
    serviceDigitalFull:
      "Digital literacy helps you use the internet safely. Never share your OTP with anyone. Use official apps like BHIM or Google Pay for money transfers.",
    serviceUjjwalaName: "Ujjwala Yojana",
    serviceUjjwalaDesc:
      "Clean cooking fuel for a smoke-free life. Apply for a free LPG connection for your household today.",
    serviceUjjwalaFull:
      "Ujjwala Yojana provides free LPG connections to women from BPL households. It aims to protect the health of women and children.",
    keyFeatures: "Key Features",
    featureAiTitle: "AI Voice Assistant",
    featureAiDesc: "Understandings your needs through natural conversation.",
    featureMultilingualTitle: "Multilingual Support",
    featureMultilingualDesc:
      "Available in Hindi, English, and 50+ local dialects.",
    featureScanTitle: "Smart Document Scan",
    featureScanDesc: "Analyze and verify your documents instantly using AI.",
    featureEligibilityTitle: "Direct Eligibility",
    featureEligibilityDesc:
      "Check your scheme eligibility in seconds, not hours.",
    featureSecurityTitle: "Secure & Private",
    featureSecurityDesc: "Your data is encrypted and handled with utmost care.",
    featureSpeedTitle: "Instant Results",
    featureSpeedDesc: "Get the information you need without any waiting time.",
    featureBandwidthTitle: "Low-Bandwidth Ready",
    featureBandwidthDesc:
      "Optimized for 2G/3G speeds to work in the remotest areas.",
    footerAbout:
      "Building bridges between citizens and government services through technology.",
    footerLinks: "Quick Links",
    footerLegal: "Legal",
    footerContact: "Contact",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    backToTop: "Back to Top",
    trackingIdLabel: "Tracking ID",
    estimatedTime: "Estimated Completion",
    timeValue: "3-5 Working Days",
    nextStepLabel: "What happens next?",
    nextStepDesc:
      "Our department experts will verify your documents. You'll receive an update once the process is complete.",
    goHome: "Go to Home",
    applyAnother: "Apply for Another Service",
    successVoiceMsg:
      "Your application has been submitted successfully. Your tracking ID is shown on the screen. Please keep it for your records.",
    myApplications: "My Applications",
    trackStatus: "Track Status",
    noApplications: "No applications found.",
    applicationDate: "Applied on",
    statusPending: "In Review",
    statusApproved: "Approved",
    statusRejected: "Action Required",
    viewReceipt: "View Receipt",
    trackTitle: "Application Tracker",
    trackSubtitle: "Real-time updates on your government service requests.",
    submissionSuccess: "Submission Successful!",
    referenceNumber: "Your Reference Number:",
    finish: "Finish",
    thankYou:
      "The government office has received your documents. You will be notified of the next steps via SMS.",
  },
  hi: {
    heroTitle: "वाणी सेतु",
    heroSubtitle: "हर आवाज को सही सेवा से जोड़ना",
    getStarted: "शुरू करें",
    howItWorks: "यह कैसे काम करता है",
    howItWorksSub: "सरकारी सेवाओं तक पहुँचना अब बातचीत करने जितना आसान है।",
    step1Title: "स्वाभाविक रूप से बोलें",
    step1Desc:
      "बस माइक्रोफ़ोन पर टैप करें और अपनी स्थानीय भाषा या बोली में बताएं कि आपको क्या चाहिए।",
    step2Title: "एआई विश्लेषण",
    step2Desc:
      "हमारा उन्नत एआई आपके लिए सटीक सरकारी सेवा और पात्रता मानदंडों की पहचान करता है।",
    step3Title: "सीधी कार्रवाई",
    step3Desc:
      "त्वरित मार्गदर्शिका, ऑडियो सहायता, या आवेदन पोर्टल का सीधा लिंक प्राप्त करें।",
    voiceTitle: "आवाज सहायक",
    voicePlaceholder: "स्थिति: सुनने के लिए तैयार...",
    voiceListening: "सुन रहे हैं...",
    voiceAnalyzing: "आपके अनुरोध का विश्लेषण किया जा रहा है...",
    back: "पीछे",
    home: "होम",
    learn: "शिक्षण",
    services: "सेवाएं",
    scan: "स्कैन करें",
    rationCard: "राशन कार्ड",
    agriculture: "कृषि सहायता",
    healthcare: "स्वास्थ्य सेवा",
    education: "शिक्षा सहायता",
    socialWelfare: "समाज कल्याण",
    pmKisan: "पीएम-किसान निधि",
    ayushmanBharat: "आयुष्मान भारत",
    details: "विवरण",
    scanning: "दस्तावेज़ स्कैन किया जा रहा है...",
    save: "डेटाबेस में सहेजें",
    nextGenVoice: "अगली पीढ़ी की वॉयस एक्सेस",
    hllrbTitle: "HLLRB – वॉयस एक्सेस",
    forRuralIndia: "ग्रामीण भारत के लिए",
    platformDesc:
      "एक एआई-संचालित प्लेटफॉर्म जो स्थानीय बोलियों को समझता है और नागरिकों को सीधे सरकारी सेवाओं से जोड़ता है।",
    startSpeaking: "बोलना शुरू करें",
    viewServices: "सेवाएं देखें",
    digitalEmpowerment: "डिजिटल सशक्तिकरण",
    knowledgePower: "ज्ञान ही शक्ति है",
    forEveryCitizen: "हर नागरिक के लिए",
    learnDesc:
      "हम केवल आपको आवेदन करने में मदद नहीं करते हैं; हम आपको आपके अधिकारों को समझने में मदद करते हैं। हमारे वॉयस-गाइडेड शैक्षिक केंद्र के साथ अपनी भाषा में सरकारी योजनाओं के बारे में जानें।",
    openKnowledgeHub: "नॉलेज हब खोलें",
    govtSchemes: "सरकारी योजनाएं",
    simplifiedEligibility: "सरल पात्रता।",
    audioHelp: "ऑडियो सहायता",
    listenDontRead: "सुनें, पढ़ें नहीं।",
    citizenRights: "नागरिक अधिकार",
    knowYourLaw: "अपने कानून को जानें।",
    digitalSkills: "डिजिटल कौशल",
    learnToUseTech: "तकनीक का उपयोग करना सीखें।",
    dialectsTitle: "50+ बोलियां",
    dialectsDesc: "पूरे भारत की स्थानीय भाषाओं के लिए समर्थन।",
    voiceGuidedTitle: "वॉयस गाइडेड",
    voiceGuidedDesc: "कोई जटिल फॉर्म नहीं, बस अपनी ज़रूरतें बताएं।",
    directConnectTitle: "सीधा संपर्क",
    directConnectDesc: "सरकारी पोर्टल्स के साथ सहजता से जुड़ता है।",
    goBack: "पीछे जाएं",
    readyToListen: "सुनने के लिए तैयार",
    describeService: "कृपया अपनी स्थानीय भाषा में अपनी ज़रूरत की सेवा बताएं।",
    tapMic: "माइक्रोफोन पर टैप करें और मुझे बताएं कि आपको क्या चाहिए।",
    detecting: "पता लगाया जा रहा है",
    languagesList: "हिंदी / अंग्रेजी / क्षेत्रीय",
    trySaying:
      'कहने की कोशिश करें: "मैं राशन कार्ड के लिए आवेदन करना चाहता हूं"',
    govtServices: "सरकारी सेवाएं",
    showingResultsFor: "इसके परिणाम दिखाए जा रहे हैं:",
    recommendedLabel: "अनुशंसित",
    applyNow: "अभी आवेदन करें",
    noServicesFound: "कोई सेवा नहीं मिली",
    trySearchingElse:
      "कुछ और खोजने की कोशिश करें या श्रेणियों को ब्राउज़ करें।",
    voiceSearch: "वॉयस सर्च",
    catAll: "सभी",
    catFood: "खाद्य",
    catIdentity: "पहचान",
    catWelfare: "कल्याण",
    catHealth: "स्वास्थ्य",
    catAgriculture: "कृषि",
    catHousing: "आवास",
    catEducation: "शिक्षा",
    serviceRationName: "NFSA राशन कार्ड",
    serviceRationDesc:
      "सब्सिडी वाले अनाज के लिए नए राशन कार्ड के लिए आवेदन करें या मौजूदा को अपडेट करें।",
    serviceAadharName: "आधार सेवाएं",
    serviceAadharDesc:
      "अपने पहचान पत्र के साथ अपना पता, नाम अपडेट करें या मोबाइल नंबर लिंक करें।",
    servicePMKisanName: "पीएम-किसान निधि",
    servicePMKisanDesc:
      "किसानों के बैंक खातों में सीधे 6000 रुपये की वित्तीय सहायता।",
    serviceAyushmanName: "आयुष्मान भारत",
    serviceAyushmanDesc:
      "माध्यमिक देखभाल के लिए प्रति परिवार प्रति वर्ष 5 लाख रुपये का स्वास्थ्य कवर।",
    serviceAwasName: "पीएम आवास योजना",
    serviceAwasDesc:
      "पात्र परिवारों के लिए पक्का घर बनाने के लिए वित्तीय सहायता।",
    servicePensionName: "वृद्धावस्था पेंशन",
    servicePensionDesc:
      "60 वर्ष से अधिक आयु के वरिष्ठ नागरिकों के लिए मासिक वित्तीय सहायता।",
    learnEmpower: "सीखें और सशक्त बनें",
    learnSubtitle:
      "सरकारी योजनाओं और डिजिटल कौशल के लिए सरल गाइड। आपकी सुविधा के लिए वॉयस-सक्षम।",
    hearGuide: "गाइड सुनें",
    viewDetails: "विवरण देखें",
    needMoreHelp: "क्या आपको अधिक सहायता चाहिए?",
    helpDesc:
      'हमारे एआई सहायक किसी भी सरकारी प्रक्रिया को समझाने के लिए 50+ बोलियों में उपलब्ध हैं। बस कहें "मुझे समझने में मदद करें"।',
    startVoiceAssistant: "वॉयस असिस्टेंट शुरू करें",
    serviceDigitalName: "डिजिटल साक्षरता",
    serviceDigitalDesc:
      "स्मार्टफोन के लिए नए हैं? सुरक्षित रूप से UPI और WhatsApp का उपयोग करना सीखें।",
    serviceDigitalFull:
      "डिजिटल साक्षरता आपको इंटरनेट का सुरक्षित रूप से उपयोग करने में मदद करती है। अपना OTP कभी किसी के साथ साझा न करें।",
    serviceUjjwalaName: "उज्ज्वला योजना",
    serviceUjjwalaDesc:
      "धुआं मुक्त जीवन के लिए स्वच्छ खाना पकाने का ईंधन। आज ही मुफ्त LPG कनेक्शन के लिए आवेदन करें।",
    serviceUjjwalaFull:
      "उज्ज्वला योजना गरीब परिवारों की महिलाओं को मुफ्त LPG कनेक्शन प्रदान करती है।",
    keyFeatures: "मुख्य विशेषताएं",
    featureAiTitle: "एआई वॉयस असिस्टेंट",
    featureAiDesc: "स्वाभाविक बातचीत के माध्यम से आपकी आवश्यकताओं को समझना।",
    featureMultilingualTitle: "बहुभाषी समर्थन",
    featureMultilingualDesc:
      "हिंदी, अंग्रेजी और 50+ स्थानीय बोलियों में उपलब्ध है।",
    featureScanTitle: "स्मार्ट दस्तावेज़ स्कैन",
    featureScanDesc:
      "एआई का उपयोग करके अपने दस्तावेज़ों का तुरंत विश्लेषण और सत्यापन करें।",
    featureEligibilityTitle: "सीधी पात्रता",
    featureEligibilityDesc:
      "अपनी योजना की पात्रता सेकंडों में जांचें, घंटों में नहीं।",
    featureSecurityTitle: "सुरक्षित और निजी",
    featureSecurityDesc:
      "आपका डेटा एन्क्रिप्टेड है और अत्यधिक सावधानी के साथ प्रबंधित किया जाता है।",
    featureSpeedTitle: "त्वरित परिणाम",
    featureSpeedDesc:
      "बिना किसी प्रतीक्षा के अपनी आवश्यक जानकारी प्राप्त करें।",
    featureBandwidthTitle: "लो-बैंडविड्थ रेडी",
    featureBandwidthDesc:
      "दूरस्थ क्षेत्रों में काम करने के लिए 2G/3G गति हेतु अनुकूलित।",
    footerAbout:
      "तकनीक के माध्यम से नागरिकों और सरकारी सेवाओं के बीच सेतु का निर्माण।",
    footerLinks: "त्वरित लिंक",
    footerLegal: "कानूनी",
    footerContact: "संपर्क",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    aboutUs: "हमारे बारे में",
    backToTop: "ऊपर जाएं",
    trackingIdLabel: "ट्रैकिंग आईडी",
    estimatedTime: "अनुमानित समय",
    timeValue: "3-5 कार्य दिवस",
    nextStepLabel: "आगे क्या होगा?",
    nextStepDesc:
      "हमारे विभाग के विशेषज्ञ आपके दस्तावेजों का सत्यापन करेंगे। प्रक्रिया पूरी होने के बाद आपको अपडेट मिल जाएगा।",
    goHome: "होम पर जाएं",
    applyAnother: "दूसरी सेवा के लिए आवेदन करें",
    successVoiceMsg:
      "आपका आवेदन सफलतापूर्वक जमा कर दिया गया है। आपकी ट्रैकिंग आईडी स्क्रीन पर दिखाई गई है। कृपया इसे अपने रिकॉर्ड के लिए सुरक्षित रखें।",
    myApplications: "मेरे आवेदन",
    trackStatus: "स्थिति ट्रैक करें",
    noApplications: "कोई आवेदन नहीं मिला।",
    applicationDate: "आवेदन की तिथि",
    statusPending: "समीक्षा के अधीन",
    statusApproved: "स्वीकृत",
    statusRejected: "कार्रवाई की आवश्यकता",
    viewReceipt: "रसीद देखें",
    trackTitle: "आवेदन ट्रैकर",
    trackSubtitle: "आपके सरकारी सेवा अनुरोधों पर वास्तविक समय अपडेट।",
    submissionSuccess: "सफलतापूर्वक जमा किया गया!",
    referenceNumber: "आपकी संदर्भ संख्या:",
    finish: "पूरा करें",
    thankYou:
      "सरकारी कार्यालय को आपके दस्तावेज़ मिल गए हैं। आपको अगले चरणों के बारे में एसएमएस के माध्यम से सूचित किया जाएगा।",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
