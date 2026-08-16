export type Language = 'en' | 'bn';

export type PageTab = 'home' | 'matcher' | 'auditor' | 'updates' | 'resources' | 'about';

export interface UserProfileInput {
  targetDestination: string;
  purpose: string;
  highestEducation: string;
  fieldOfStudy: string;
  coreSkills: string;
  workExperienceYears: string;
  availableBudgetBDT: string;
  sourceOfFunds: string;
  criminalRecord: string;
}

export interface PathwayResult {
  matchStatus: 'High Match' | 'Moderate Match' | 'Low Match';
  destinationCountry: string;
  successProbability: number;
  summaryText: string;
  profileAnalysis: string;
  bestPath: string;
  strategicSuggestions: string[];
  verifiedPathwayMap: {
    title: string;
    type: string;
    officialChannel: string;
    timeline: string;
    costBDT: string;
  }[];
  estimatedCostBreakdown: {
    feeItem: string;
    officialCostBDT: string;
    notes: string;
  }[];
  requiredDocumentsChecklist: string[];
  stepByStepRoadmap: {
    stepNumber: number;
    stepTitle: string;
    detail: string;
    officialPortal?: string;
  }[];
  financialRealityCheck: string;
  backgroundImpact: string;
  mentorAdvice: string[];
  mentorWarnings: string[];

  // Extended Detailed Analysis Fields
  skillCompetencyRequirements?: {
    tradeCertificationNeeded: string;
    languageProficiencyRequired: string;
    practicalSkillsAssessment: string;
    minimumExperienceStandard: string;
  };
  bankStatementAndFundsDetails?: {
    requiredBalanceProof: string;
    seasonedPeriodMonths: string;
    acceptableSourceOfFunds: string;
    taxClearanceRequirements: string;
    sponsorAffidavitGuidelines: string;
  };
  destinationRealityCheck?: {
    netSalaryExpectation: string;
    estimatedMonthlyLivingCost: string;
    housingAndAccommodationReality: string;
    workCultureAndClimateReality: string;
    jobSecurityAndProbationRules: string;
  };
  laborLawsAndLegalRights?: {
    minimumWageEnforcement: string;
    overtimeCompensationRules: string;
    passportRetentionLaw: string;
    jobTransferAndEmployerChangeRights: string;
    disputeRedressalPortal: string;
  };
  futureOpportunitiesAndCareer?: {
    permanentResidencyPathway: string;
    familySponsorshipEligibility: string;
    skillUpgradingOptions: string;
    legalRemittanceChannels: string;
  };
  masterActionChecklist?: {
    preDeparturePreparation: string[];
    embassyInterviewTips: string[];
    postArrivalMandatorySteps: string[];
  };
  searchQueries?: string[];
}

export interface RiskFlag {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  clauseSnippet?: string;
  recommendation: string;
}

export interface DocumentClassification {
  documentType: string;
  documentTitle: string;
  issuingBody: string;
  whatIsThisPaper: string;
  whatDoesItMean: string;
  whatIsItFor: string;
}

export interface ExtractedDocumentElements {
  employerOrCompany: string;
  candidateOrRecipient: string;
  jobTitleOrDesignation: string;
  salaryAndFinancials: string;
  demandedFeesOrCosts: string;
  licenseOrReferenceNumber: string;
  contactDetails: string;
  issueOrValidityDate: string;
}

export interface AuthenticityAnalysis {
  verdict: 'VERIFIED REAL' | 'PROBABLY LEGITIMATE' | 'SUSPICIOUS / UNVERIFIED' | 'HIGH RISK FAKE';
  authenticityScore: number;
  realVsFakeExplanation: string;
  fakeIndicatorsDetected: string[];
  genuineIndicatorsDetected: string[];
}

export interface RealTimeVerificationCheck {
  companySearchSummary: string;
  registryVerificationStatus: 'FOUND & VALID' | 'UNREGISTERED / NOT FOUND' | 'WARNING / BLACKLISTED' | 'NEEDS MANUAL CHECK';
  officialVerificationLinks: {
    portalName: string;
    url: string;
    verificationInstruction: string;
  }[];
}

export interface AuditResult {
  auditSummary: string;
  overallRiskScore: number;
  riskLevel: 'CRITICAL' | 'MODERATE' | 'LOW';
  classification: DocumentClassification;
  elements: ExtractedDocumentElements;
  authenticity: AuthenticityAnalysis;
  verification: RealTimeVerificationCheck;
  flags: RiskFlag[];
  salaryCheck: {
    isRealistic: boolean;
    comment: string;
  };
  officialRegistryAdvice: string;
  recommendedActions: string[];
  searchQueries?: string[];
  // Compatibility fields
  overallSummary?: string;
  claimsAnalyzed?: {
    claim: string;
    status: 'FLAGGED' | 'CAUTION' | 'VERIFIED';
    explanation: string;
    officialLawCitation: string;
  }[];
  officialSourceLinks?: {
    name: string;
    url: string;
  }[];
}

export type NewsCategory = 
  | 'All' 
  | 'Jobs & Career' 
  | 'Study & Admissions' 
  | 'Business & Trade' 
  | 'Visa & Immigration' 
  | 'Government & Laws' 
  | 'Future & Planning';

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Jobs & Career' | 'Study & Admissions' | 'Business & Trade' | 'Visa & Immigration' | 'Government & Laws' | 'Future & Planning';
  country: string;
  region: 'Middle East' | 'UK & Europe' | 'North America' | 'Asia Pacific' | 'Global';
  publishDate: string;
  timeAgo: string;
  readTime: string;
  summary: string;
  fullContent: string;
  sourceName: string;
  sourceDomain: string;
  sourceType: 'Government Portal' | 'Official Gazette' | 'Verified News Outlet' | 'International Newsletter' | 'Embassy Advisory';
  officialLink: string;
  imageUrl: string;
  isVerified: boolean;
  likesCount: number;
  trendingTag?: string;
}

export interface VerifiedArticle {
  id: string;
  title: string;
  category: 'Policy Update' | 'Scam Warning' | 'Fee Regulation' | 'Jobs & Career' | 'Study & Admissions' | 'Business & Trade' | 'Visa & Immigration' | 'Government & Laws' | 'Future & Planning';
  publishDate: string;
  summary: string;
  fullContent: string;
  sourceMinistry: string;
  officialLink: string;
  isAiVerified: boolean;
  country?: string;
  imageUrl?: string;
  timeAgo?: string;
  readTime?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  description: string;
  officialUrl: string;
  domain: string;
  category: 'Visa & Status' | 'Labour & Contracts' | 'Government & Ministries' | 'Business & Trade' | 'Study & Education' | 'Home Country & Clearance';
}
