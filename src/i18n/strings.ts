import { Language } from '../types';

/**
 * Every user-facing string lives here so both languages stay in step. The
 * English object defines the shape; the Bengali object must satisfy it, so a
 * missing translation is a type error rather than an English string leaking
 * into a Bengali page.
 */
const en = {
  common: {
    retry: 'Try again',
    close: 'Close',
    cancel: 'Cancel',
    loading: 'Working…',
    copyLink: 'Copy link',
    copied: 'Copied',
    openPortal: 'Open official portal',
    sourceLink: 'Source link',
    showMore: 'Show details',
    showLess: 'Hide details',
    demoData: 'Demonstration data',
    demoDataNote: 'Example content for showing how VeriPath works. Not a real assessment.',
    notStated: 'Not stated',
    results: 'results',
    /** Opens the spoken announcement when a request settles. */
    resultReady: 'Result ready.',
  },

  evidence: {
    heading: 'Evidence',
    checked: 'Checked',
    source: 'Source',
    status: 'Status',
    asOf: 'As of',
    noSource: 'No official source retrieved',
    liveSearch: 'Live search of official portals',
    builtIn: 'Built-in reference list',
  },

  states: {
    backendUnavailableTitle: 'Backend unavailable',
    backendUnavailableBody:
      'VeriPath could not reach the analysis service, so there is no assessment to show. Nothing here has been checked. Try again in a moment.',
    insufficientTitle: 'Insufficient evidence',
    insufficientBody:
      'VeriPath could not retrieve an official source for this. Treat it as unchecked and confirm with the issuing authority.',
    unsupportedTitle: 'Unsupported destination',
    unsupportedBody:
      'VeriPath does not hold reference information for this destination yet, so it cannot assess a pathway. Choose one of the listed destinations.',
    emptyTitle: 'Nothing to show yet',
  },

  disclaimer: {
    short: 'Preliminary AI assessment. Not a government decision.',
    long:
      'VeriPath produces preliminary AI assessments to help you ask better questions. It does not make government decisions, and it cannot confirm that a document is genuine. Always confirm with the issuing authority before you pay anyone.',
  },

  shell: {
    skipToContent: 'Skip to main content',
    mainLabel: 'Main content',
    primaryNav: 'Primary',
    homeLink: 'VeriPath AI — go to home',
    // The same words as the hero's primary action, because it is the same
    // action and the same destination. "Verify an opportunity" also borrowed a
    // verb the product is careful never to claim: VeriPath checks a document
    // and names who can confirm it — it does not verify anything itself.
    verifyCta: 'Check a document',
    settings: 'Settings and display',
    openSettings: 'Open settings and display options',
    menu: 'Menu',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    language: 'Language',
    textSize: 'Larger text',
    textSizeHint: 'Increase text size across the whole site',
    contrast: 'Higher contrast',
    contrastHint: 'Strengthen text and border contrast',
    on: 'On',
    off: 'Off',
  },

  footer: {
    tools: 'Tools',
    resources: 'Official resources',
    tagline:
      'Preliminary AI checks on migration paperwork, with links to the official portals that can confirm them.',
    rights: '© 2026 VeriPath AI',
  },

  home: {
    heroKicker: 'Before you pay',
    heroQuestion: 'A recruiter has made you an offer. Is any of it true?',
    heroTitleA: 'Verify Before',
    heroTitleB: 'You Pay.',
    heroBody:
      'Paste a job offer, a visa notice or an agency receipt. VeriPath compares what it claims against published rules and shows you which authority can confirm it — before money changes hands.',
    heroPrimary: 'Check a document',
    heroSecondary: 'See how it works',
    heroNote:
      'VeriPath produces preliminary AI assessments. It cannot approve a visa, confirm that a document is genuine, or replace a decision from a government office.',

    sampleLabel: 'Sample — demonstration data',
    sampleCaption:
      'An invented message, shown to demonstrate the interface. Nothing here was checked against a real source.',
    sampleTabOffer: 'The offer',
    sampleTabFindings: 'Findings',
    sampleTabNext: 'Next steps',
    sampleSender: 'Overseas Employment BD',
    sampleTime: 'Today · 10:47',
    sampleLine1: 'URGENT — security guard positions available now',
    sampleLine2: 'Guaranteed visa, no interview required',
    sampleLine3: 'Salary QAR 4,500 per month',
    sampleLine4: 'Processing fee QAR 3,500, pay today',
    sampleLine5: 'Only 8 places left, closes in 48 hours',
    sampleFooter: 'Send a passport copy to reserve your place.',
    sampleAnalyseCta: 'Check an offer like this',
    sampleFindingCount: '3 conflicts',
    sampleFindingTitle: 'Three claims conflict with published rules',
    sampleFindingBody:
      'Qatar labour rules place recruitment costs on the employer, so an upfront processing fee charged to the worker contradicts them. A recruiter cannot promise a guaranteed visa without an interview. A 48-hour deadline is a pressure tactic, not a legal requirement.',
    sampleChecked: 'Fee, visa guarantee and deadline against published recruitment rules',
    sampleSource: 'Demonstration data — no live source retrieved',
    sampleNextTitle: 'What to do before paying anything',
    sampleNext1: 'Ask for the employer name and licence number in writing.',
    sampleNext2: 'Check that licence yourself on the official registry.',
    sampleNext3: 'Do not send a passport copy or a fee to hold a place.',
    sampleAuditCta: 'Check your own document',

    demoKicker: 'A worked example',
    demoTitle: 'One offer, from arrival to next step.',
    demoBody:
      'Follow a single invented message through the auditor: what it claims, which claims conflict with published rules, and what to do before any money moves.',
    demoStep1Body: 'What arrived on the phone.',
    demoStep2Body: 'What VeriPath compared it against.',
    demoStep3Body: 'What to do before paying anyone.',

    lineTitle: 'What happens to an offer',
    lineCaption: 'Sample demonstration · Illustrative data. Nothing here has been verified.',
    lineOfferLabel: 'The offer',
    lineOfferFrom: 'Overseas Employment BD',
    lineOfferText: 'Guaranteed visa, no interview. Processing fee QAR 3,500 today. 8 places left.',
    lineStage: 'Check',
    lineOf: 'of',
    linePaused: 'Paused',
    linePauseHint: 'Moves on its own. Hovering or focusing a check pauses it.',
    lineTrackLabel: 'Five checks this offer passes through',
    lineGateLabel: 'The five checks',
    lineUnderExam: 'Under examination',
    lineNoAnchor: 'Nothing in the message answers this.',

    outcomeWarning: 'Potential warning',
    outcomeReview: 'Needs human review',
    outcomeInsufficient: 'Insufficient evidence',

    gate1Name: 'Fee',
    gate1Check: 'The fee demanded, against the rules this document itself cites',
    gate1Finding: 'It asks for QAR 3,500 up front while citing rules that place recruitment costs on the employer.',
    gate2Name: 'Guarantee',
    gate2Check: 'The visa guarantee, against what a recruiter is able to promise',
    gate2Finding: 'A guaranteed visa with no interview is not something a recruiter can promise.',
    gate3Name: 'Deadline',
    gate3Check: 'The 48-hour deadline, against published processing times',
    gate3Finding: 'A 48-hour deadline matches no published processing time for this route.',
    gate4Name: 'Employer',
    gate4Check: 'The employer name and licence number, against a public registry',
    gate4Finding: 'No licence number is given, so there is nothing to look up on a registry.',
    gate5Name: 'Source',
    gate5Check: 'Whether an official source could be retrieved for any of the above',
    gate5Finding: 'No official source was retrieved for this sample, so none of it is confirmed.',

    /* The scene that follows the hero. Names what the reader has just
       watched the five checks do — it makes no claim of its own. */
    findingsKicker: 'What the checks found',
    lineResultLabel: 'Where it ends up',
    lineResultTitle: 'Preliminary AI assessment',
    lineResultBody: 'Three claims conflict with the rules this document cites, and no official source was retrieved.',
    lineNextStepLabel: 'Next verification step',
    lineNextStepBody: 'Ask for the licence number in writing, then check it yourself on the official registry.',

    principlesKicker: 'How VeriPath works',
    principlesTitle: 'Every finding points to something you can check yourself.',
    principlesBody:
      'VeriPath does not decide whether an offer is genuine. It reads the document, compares the claims with published rules, and shows you which official body can confirm each one.',
    principle1Title: 'Traceable findings',
    principle1Body: 'Each finding names what was compared and where the rule came from.',
    principle2Title: 'Plain language',
    principle2Body: 'No legal jargon. If a claim conflicts with a rule, the interface says so in one sentence.',
    principle3Title: 'Bengali throughout',
    principle3Body: 'Every screen, finding and warning is written in both English and Bengali.',
    principle4Title: 'Used once, for your result',
    principle4Body: 'What you paste or upload is sent for analysis to produce your result, and is not published anywhere.',

    challengeKicker: 'The problem',
    challengeTitle: 'The information exists. It is just not where you are.',
    challengeBody:
      'Official requirements sit in scattered portals and technical language, while recruitment claims arrive on your phone, already urgent.',
    challenge1Title: 'Scattered rules',
    challenge1Body: 'Fees, quotas and requirements are spread across ministries, in several languages.',
    challenge2Title: 'Confident claims',
    challenge2Body: 'An offer that contradicts labour law looks exactly like one that follows it.',
    challenge3Title: 'Deadline pressure',
    challenge3Body: 'Money is demanded before there is time to check anything.',

    toolsKicker: 'Two tools',
    toolsTitle: 'Check a path, or check a paper.',
    tool1Role: 'Plan a route',
    tool1Name: 'Profile Matcher',
    tool1Body:
      'Describe your skills, budget and destination. Get a preliminary route with the official fees, the steps in order, and the portals that confirm each one.',
    tool1Cta: 'Open Profile Matcher',
    tool1PreviewRoute: 'Bangladesh → Qatar · construction',
    tool1PreviewTitle: 'Work visa, general labour',
    tool1PreviewFee: 'Official fee',
    tool1PreviewFeeValue: 'QAR 300',
    tool1PreviewTime: 'Stated processing time',
    tool1PreviewTimeValue: '2–4 weeks',
    tool2Role: 'Check a paper',
    tool2Name: 'Document Auditor',
    tool2Body:
      'Paste or upload an offer letter, visa notice, contract or receipt. See which claims conflict with published rules and who can confirm the rest.',
    tool2Cta: 'Open Document Auditor',
    tool2PreviewFile: 'Offer_Letter.pdf',
    tool2PreviewClaim: 'Claimed: "No medical test required"',
    tool2PreviewBody:
      'Published entry rules require a medical screening before the visa is issued. This claim conflicts with them.',

    processKicker: 'How it works',
    processTitle: 'Four steps',
    processBody: 'From an unverified claim to a named authority who can confirm it.',
    step1Title: 'Share the document or your situation',
    step1Body: 'Paste text, upload a file, or fill in the profile form.',
    step2Title: 'Claims are pulled out',
    step2Body: 'Salaries, fees, timelines, guarantees and licence numbers are separated from the rest of the text.',
    step3Title: 'Claims are compared',
    step3Body:
      'Each claim is checked against published rules and, when the service can reach them, a live search of official portals.',
    step4Title: 'You get findings and a way to confirm them',
    step4Body: 'Each finding names what was compared, its source, how far the check got, and when it ran.',

    resultsKicker: 'Reading a result',
    resultsTitle: 'What the labels mean',
    resultsBody:
      'Two things are labelled separately: what the document says, and how far VeriPath got in checking it.',
    findingsHeading: 'About the document',
    finding1Title: 'No conflicts found',
    finding1Body:
      'Nothing in this document contradicts the rules that were checked. That is not proof the document is genuine.',
    finding2Title: 'Needs care',
    finding2Body: 'Something conflicts with published rules, or key details are missing.',
    finding3Title: 'Serious conflict',
    finding3Body:
      'Claims contradict published rules, or match patterns associated with fraudulent recruitment. Do not pay.',
    statusHeading: 'About the check',
    legendPreliminary: 'A machine read the document. No person and no government office has reviewed it.',
    legendRequiresConfirmation: 'A source was found. Confirm it with the authority named before you act.',
    legendNeedsReview: 'The result is unclear or contradictory and needs a person to look at it.',
    legendInsufficient: 'No official source could be retrieved. Treat this as unchecked.',
    legendBackendUnavailable: 'The analysis service could not be reached, so nothing was checked.',
    legendUnsupportedDestination: 'VeriPath holds no reference information for this destination yet.',

    accessKicker: 'Access',
    accessTitle: 'Built for the phone in your pocket',
    accessBody: 'Try the controls below to see how a finding adapts.',
    access1: 'English and Bengali on every screen',
    access2: 'Larger text and higher contrast, kept between visits',
    access3: 'Works on small screens and slow connections',
    access4: 'Full keyboard and screen-reader support',
    accessDemoLabel: 'Preview a finding',
    accessModeStandard: 'Standard',
    accessModeBengali: 'Bengali',
    accessModeLarge: 'Larger text',
    accessDemoTitle: 'Needs care',
    accessDemoBody:
      'The salary in this offer is above the published range for this role. Confirm it in writing before you pay.',

    traceKicker: 'Traceability',
    traceTitle: 'Where each finding comes from',
    traceBody: 'Every finding in VeriPath carries the same four lines, in the same order.',
    trace1: 'What was compared',
    trace2: 'Which source it came from',
    trace3: 'How far the check got',
    trace4: 'When it ran',
    traceClaimLabel: 'Claim',
    traceClaim: '"The employer covers all visa costs."',
    traceResultTitle: 'Matches the rule that was checked',
    traceResultBody:
      'Published Qatar labour rules place recruitment and visa processing costs on the employer, not on the worker.',
    traceChecked: 'Cost responsibility clause against published labour rules',
    traceSource: 'Demonstration data — Ministry of Labour, Qatar',

    closingTitle: 'Verify Before You Pay.',
    closingBody:
      'A few minutes of checking gives you better questions to ask, and a record of who can answer them.',
    closingCta: 'Check a document',
  },

  matcher: {
    kicker: 'Profile Matcher',
    title: 'Plan a route before you commit money to one',
    intro:
      'Describe your situation. VeriPath drafts a preliminary route with the official fees, the steps in order, and the portal that can confirm each one. It cannot tell you whether you will be accepted.',

    formLegend1: 'Destination and purpose',
    formLegend2: 'Education and work',
    formLegend3: 'Money and record',

    destination: 'Destination country',
    destinationHint: 'VeriPath holds reference information for these destinations only.',
    destinationRequired: 'Choose a destination to continue.',
    destinationPlaceholder: 'Choose a destination',
    destinationNotListed: 'My destination is not on this list',
    purpose: 'Why you are going',
    purposePlaceholder: 'Choose a purpose',
    education: 'Highest education',
    educationPlaceholder: 'Choose a level',
    fieldOfStudy: 'Subject or trade',
    fieldOfStudyHint: 'For example: electrical, plumbing, nursing, IT',
    skills: 'Main skills and certificates',
    skillsHint: 'For example: electrical wiring, driving, welding',
    experience: 'Years of work experience',
    experiencePlaceholder: 'Choose a range',
    budget: 'Money available (BDT)',
    budgetHint: 'Numbers only, for example 800000',
    budgetInvalid: 'Enter the amount in numbers only.',
    funds: 'Where the money comes from',
    fundsPlaceholder: 'Choose a source',
    record: 'Police or legal record',
    recordPlaceholder: 'Choose an answer',
    optional: 'Optional',
    required: 'Required',

    reviewLabel: 'Review',
    reviewNote:
      'These are the answers VeriPath will compare against published requirements. The optional ones make the route more specific.',
    answered: 'answered',

    submit: 'Draft a preliminary route',
    submitting: 'Drafting your route…',
    loadingDetail: 'Comparing your details with published requirements for this destination.',

    emptyTitle: 'No route drafted yet',
    emptyBody: 'Fill in the form and VeriPath will draft a preliminary route you can take to an official portal.',

    resultKicker: 'Preliminary route',
    resultTitle: 'Route for',
    indicatorLabel: 'Match indicator',
    indicatorNote: 'A rough score from the AI. It is not an eligibility decision and no office has seen it.',
    matchLabel: 'Reported match',
    checkedProfile: 'Your stated profile against published requirements for this destination',

    warningsTitle: 'Read this before paying anyone',
    adviceTitle: 'Suggested next steps',

    groupRouteTitle: 'The route',
    groupRouteSummary: 'Profile reading, recommended path, and the official channels for it',
    groupCostTitle: 'Costs and money',
    groupCostSummary: 'Fee breakdown, budget check, and proof-of-funds requirements',
    groupStepsTitle: 'Documents and steps',
    groupStepsSummary: 'What to collect, in what order, and the portals for each step',
    groupRightsTitle: 'Rights and conditions',
    groupRightsSummary: 'Labour rules, pay, housing, and what your record affects',
    groupFutureTitle: 'Longer term',
    groupFutureSummary: 'Residency, family, skills and remittance',

    profileAnalysis: 'How VeriPath read your profile',
    bestPath: 'Suggested path',
    suggestions: 'Strategic suggestions',
    pathwayMap: 'Official channels',
    channel: 'Official channel',
    timeline: 'Stated timeline',
    feeCap: 'Stated fee range',
    costTable: 'Fee breakdown',
    costItem: 'Item',
    costAmount: 'Stated cost',
    costNote: 'Note',
    financialCheck: 'Budget check',
    fundsProof: 'Proof of funds',
    documents: 'Documents to collect',
    roadmap: 'Steps in order',
    officialPortal: 'Official portal',
    skills2: 'Skill and qualification standards',
    reality: 'What living there is reported to be like',
    laborLaws: 'Labour rules and worker rights',
    background: 'What your record affects',
    future: 'Longer-term options',
    checklist: 'Action checklist',
    checklistPhase1: 'Before you leave',
    checklistPhase2: 'At the embassy interview',
    checklistPhase3: 'After you arrive',

    /* The labels down the left of the result groups. These were written
       straight into the component and so stayed English on a Bengali page —
       the one part of the result the frontend owns and could translate. */
    detailRequiredBalance: 'Required balance',
    detailSeasonedPeriod: 'Seasoned period',
    detailSourceOfFunds: 'Source of funds',
    detailTaxClearance: 'Tax clearance',
    detailSponsorAffidavit: 'Sponsor affidavit',

    detailMinimumWage: 'Minimum wage',
    detailOvertime: 'Overtime',
    detailChangingEmployer: 'Changing employer',
    detailDisputePortal: 'Dispute portal',

    detailNetPay: 'Net monthly pay',
    detailLivingCost: 'Living cost',
    detailHousing: 'Housing',
    detailWorkAndClimate: 'Work and climate',
    detailProbation: 'Probation',

    detailTradeCertificate: 'Trade certificate',
    detailLanguage: 'Language',
    detailPracticalTest: 'Practical test',
    detailMinimumExperience: 'Minimum experience',

    detailResidency: 'Residency',
    detailFamilySponsorship: 'Family sponsorship',
    detailSkillUpgrading: 'Skill upgrading',
    detailRemittance: 'Sending money home',

    feeWarning:
      'Fees shown are what the AI reported, not a published tariff. Confirm every amount on the official portal before paying.',
  },

  auditor: {
    kicker: 'Document Auditor',
    title: 'Check what a document claims before you act on it',
    intro:
      'Paste or upload an offer letter, visa notice, contract or receipt. VeriPath separates the claims from the wording and compares them with published rules. It cannot tell you whether the paper is genuine.',

    inputTitle: 'The document',
    inputHint: 'Job offers, visa notices, permits, contracts, agency receipts or bank papers.',
    textLabel: 'Paste the text',
    textPlaceholder: 'Paste the message, letter or notice here…',
    uploadLabel: 'Or upload files',
    uploadHint: 'PDF, JPG, PNG, WEBP or TXT. Several files are analysed together.',
    uploadCta: 'Choose files',
    dropHint: 'Drag files here, or choose them from your device.',
    unsupportedFile: 'These files cannot be read and were not attached:',
    supportedFiles:
      'VeriPath can read PDF, JPG, PNG, WEBP and TXT. For a Word document, export it as PDF or paste its text above.',
    attached: 'Attached',
    removeFile: 'Remove',
    clearAll: 'Remove all',
    submit: 'Check this document',
    submitting: 'Checking…',
    loadingDetail: 'Separating the claims and comparing them with published rules.',

    emptyTitle: 'No document checked yet',
    emptyBody: 'Paste text or upload a file. Nothing is checked until you do.',

    assessmentLabel: 'Assessment',
    verdictNoConflicts: 'No conflicts found with the sources checked',
    verdictFewConflicts: 'No major conflicts found',
    verdictConflicts: 'Conflicts found — needs care',
    verdictSerious: 'Serious conflicts — matches known fraud patterns',
    verdictInsufficient: 'Not enough official evidence to assess this document',
    verdictNote:
      'This describes the claims in the document, not whether the paper itself is genuine. Only the issuing authority can confirm that.',
    verdictInsufficientNote:
      'No official source was retrieved, so nothing in this document has been compared against a published rule. Treat it as unchecked and confirm with the issuing authority.',

    riskIndicator: 'Risk indication',
    authenticityIndicator: 'AI confidence indicator',
    indicatorNote: 'Numbers reported by the AI. Neither is a ruling on the document.',
    checkedClaims: 'Claims in the document against published rules',

    fakeSignals: 'Signals the AI treated as suspicious',
    genuineSignals: 'Signals the AI treated as consistent',

    classificationTitle: 'What this document is',
    docType: 'Type',
    whatIsIt: 'What it is',
    whatItMeans: 'What it means',
    whatItIsFor: 'What it is for',
    issuingBody: 'Named issuer',

    elementsTitle: 'Details found in the document',
    employer: 'Employer or company',
    candidate: 'Named recipient',
    jobTitle: 'Role',
    salary: 'Pay stated',
    fees: 'Money demanded',
    licence: 'Licence or reference number',
    contact: 'Contact given',
    issueDate: 'Date or validity',

    verificationTitle: 'Registry check',
    registryMatched: 'Matched a registry record',
    registryNotFound: 'No registry record found',
    registryFlagged: 'Flagged on a registry',
    registryManual: 'Needs a manual check',
    registryNote:
      'A registry match means a record with this name was found. It does not confirm that this document came from them.',
    searchedWith: 'Searched with',
    portalsTitle: 'Where to confirm this yourself',

    flagsTitle: 'Where the claims conflict',
    severityHigh: 'Serious',
    severityMedium: 'Needs care',
    severityLow: 'Minor',
    quotedText: 'Quoted from the document',
    /* The two middle links of the finding chain: what the wording was read
       against, and what VeriPath concluded from the comparison. Stated
       separately so a reader can see that the conclusion has something behind
       it — or that it does not. */
    flagRule: 'Rule or pattern',
    flagFinding: 'VeriPath finding',
    whatToDo: 'What to do',

    actionsTitle: 'Recommended next steps',
    salaryCheck: 'Pay check',
    limitationsTitle: 'What this check cannot do',
  },

  news: {
    kicker: 'Updates',
    title: 'Policy and recruitment news, with the portal that published it',
    intro:
      'Summaries of migration, study and labour announcements. Every item links to the portal it came from — read the original before acting on it.',

    searchLabel: 'Search updates',
    searchPlaceholder: 'Search by topic, country or source…',
    regionLabel: 'Region',
    categoryLabel: 'Topic',
    trendingLabel: 'Common topics',
    clearSearch: 'Clear search',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    updated: 'Updated',
    lastUpdatedNever: 'Not fetched yet',

    demoBadge: 'Demonstration data',
    demoNotice:
      'These items ship with the app to demonstrate the feed. They are not live news and were not fetched from any source.',
    liveBadge: 'Fetched from the service',
    liveNotice:
      'Fetched summaries, written by the AI. Read the linked portal before acting — the summary may be wrong or out of date.',
    offlineNotice:
      'The updates service is unavailable, so nothing new was fetched. Only the demonstration items below are shown.',

    sourceLabel: 'Source',
    readTime: 'read',
    openOriginal: 'Read the original',
    save: 'Save',
    saved: 'Saved',
    like: 'Helpful',
    share: 'Copy link',
    articleLabel: 'Update',
    summaryLabel: 'Summary',

    emptyTitle: 'No updates match your filters',
    emptyBody: 'Clear the search or choose a different topic or region.',
    clearFilters: 'Clear all filters',

    catAll: 'All',
    catJobs: 'Jobs & career',
    catStudy: 'Study & admissions',
    catBusiness: 'Business & trade',
    catVisa: 'Visa & immigration',
    catGov: 'Government & laws',
    catFuture: 'Future & skills',
    catSaved: 'Saved',

    regionAll: 'All regions',
    regionEurope: 'UK & Europe',
    regionMiddleEast: 'Middle East',
    regionAmerica: 'North America',
    regionAsia: 'Asia Pacific',
  },

  portals: {
    kicker: 'Official portals',
    title: 'Go straight to the office that can confirm it',
    intro:
      'Direct links to government visa, labour and registry portals. VeriPath maintains this list; the pages themselves belong to the authorities named.',

    /* `{n}` placeholders are filled at render. Written as templates rather than
       concatenated in JSX because Bengali puts the count and its noun in the
       opposite order from English. */
    statPortals: '{n} official portals',
    statDestinations: '{n} destinations',

    searchLabel: 'Search portals',
    searchPlaceholder: 'Search by portal, country or domain…',

    countryLabel: 'Destination',
    allCountries: 'All destinations',
    homeCountry: 'Bangladesh clearance',

    categoryLabel: 'Purpose',
    allCategories: 'All purposes',

    directoryLabel: 'Official portal directory',
    groupCount: '{n} portals',
    groupCountOne: '{n} portal',
    resultSummary: 'Showing {shown} of {total} portals',
    clearSearch: 'Clear search',
    clearDestination: 'Clear destination',
    clearPurpose: 'Clear purpose',
    clearAll: 'Clear all filters',

    domainLabel: 'Domain',
    visit: 'Open portal',
    opensNewTab: 'opens in a new tab',
    copy: 'Copy link',
    copyOf: 'Copy link: {title}',
    copied: 'Copied',
    copiedOf: 'Link copied: {title}',
    copyFailed: 'Could not copy. Select the text above and copy it manually.',

    emptyTitle: 'No portals match your filters',
    emptyBody: 'Clear the search or choose a different destination or purpose.',
    emptyElsewhere: 'Matches in other destinations: {n}',
    emptyOtherPurpose: 'Matches under another purpose: {n}',
    reset: 'Reset filters',

    helplinesTitle: 'Urgent contacts',
    helplinesBody: 'For reporting fraudulent recruitment and contract disputes.',
    helplineNote: 'Numbers as published by each authority. Confirm on their portal before relying on them.',
    helplineCall: 'Call',
    helplineCopy: 'Copy number',
    helplineCopyOf: 'Copy number: {authority}',
    helplineCopiedOf: 'Number copied: {authority}',
    helplineMatches: 'Matches your destination',

    /* The four helplines. Authority acronyms stay in Latin in both languages,
       which is how they are printed on the authorities' own material and how
       someone would have to search for them. */
    helpline1Authority: 'BMET fraud reporting',
    helpline1Note: 'Toll-free',
    helpline2Authority: 'Probashi Kalyan helpline',
    helpline2Note: '24/7 call centre',
    helpline3Authority: 'Qatar MOL labour centre',
    helpline3Note: 'Worker rights line',
    helpline4Authority: 'Saudi MHRSD centre',
    helpline4Note: 'Qiwa and labour disputes',

    guidanceKicker: 'How to use this list',
    guidanceTitle: 'Using official sources',
    guide1Title: 'Check the address.',
    guide1Body:
      'Compare the website domain in your browser with the official source listed here before entering personal information or making a payment.',
    guide2Title: 'A source is not a verdict.',
    guide2Body:
      'Reaching an official portal does not by itself prove that a recruiter, offer, or document is genuine.',
    guide3Title: 'Confirm before you pay.',
    guide3Body:
      'If a fee, requirement, licence, or process is unclear, confirm it with the issuing authority or the official channel listed here before paying anyone.',

    closeTitle: 'Have a document or an offer in front of you?',
    closeBody:
      'VeriPath produces a preliminary check and points you back to the portal that can confirm it.',
    closeAction: 'Check a document',

    catVisa: 'Visa & status',
    catLabour: 'Labour & contracts',
    catGov: 'Government & ministries',
    catBusiness: 'Business & trade',
    catStudy: 'Study & education',
    catHome: 'Home country & clearance',
  },

  about: {
    kicker: 'About',
    title: 'What VeriPath does, and what it cannot do',
    intro:
      'VeriPath was built for people deciding whether to pay for a migration opportunity, usually under time pressure and usually without a way to check the claims in front of them.',

    /* The masthead's standing summary. Every value is composed from the
       claims already made further down this page — nothing here is new. */
    factsLabel: 'In brief',
    whatIsTerm: 'What this is',
    whatIsDef: 'A preliminary AI assessment of the claims in a document, compared with published rules.',
    whoForTerm: "Who it's for",
    whoForDef: 'People deciding whether to pay for a migration opportunity, usually under time pressure.',
    notTerm: 'What it is not',
    notDef: 'Not legal advice, and not a visa decision.',

    registerKicker: 'Capabilities and limits',

    doesTitle: 'What it does',
    does1Title: 'Reads the document',
    does1Body: 'Separates the claims — pay, fees, timelines, guarantees, licence numbers — from the wording around them.',
    does2Title: 'Compares them with published rules',
    does2Body: 'Checks each claim against published requirements and, when the service can reach them, official portals.',
    does3Title: 'Shows its working',
    does3Body: 'Every finding names what was compared, the source, how far the check got, and when it ran.',
    does4Title: 'Points you to the authority',
    does4Body: 'Links to the government portal that can actually confirm or deny the claim.',

    cannotTitle: 'What it cannot do',
    cannot1: 'It cannot confirm that a document is genuine. Only the authority that issued it can.',
    cannot2: 'It cannot approve, refuse or predict a visa decision.',
    cannot3: 'It cannot promise that a fee, quota or rule is current — published rules change.',
    cannot4: 'It cannot replace legal advice or an official government decision.',

    /* The four stages a finding passes through, as labels. The register above
       states what VeriPath does; this states the order it happens in. */
    chainKicker: 'The evidence chain',
    chainTitle: 'From claim to authority',
    chainStep: 'Step',
    chain1Label: 'The claim',
    chain1Body: 'A statement in the document — a wage, a fee, a deadline, a licence number.',
    chain2Label: 'The published rule',
    chain2Body: 'The published requirement the claim is measured against.',
    chain3Label: 'The finding',
    chain3Body: 'What was compared, against what, how far the check got, and when.',
    chain4Label: 'The authority',
    chain4Body: 'The government portal that can confirm or deny the claim.',

    howKicker: 'Method',
    howTitle: 'How the assessment is produced',
    howBody:
      'VeriPath sends what you provide to a large language model with instructions to compare the claims against published migration and labour rules, and to return its findings in a fixed structure. Language models can be wrong and can state wrong things confidently. That is why every result is labelled as a preliminary AI assessment, why sources are shown when there are any, and why the interface says plainly when there are none.',

    limitsTitle: 'Where the limits show',
    limitsBody:
      'When the service cannot reach a live source, results are labelled Insufficient evidence rather than presented as checked. When the service is unreachable, VeriPath shows Backend unavailable and no assessment at all — it does not fill the gap with a guess.',

    /* Four commitments, each a restatement of something already claimed on
       this page: the sources checked, the working shown, the gaps declared,
       and who the last word belongs to. */
    holdKicker: 'Commitments',
    holdTitle: 'What we hold to',
    hold1Title: 'Published sources',
    hold1Body:
      'Claims are compared with published requirements, and with official portals when the service can reach them.',
    hold2Title: 'Traceable findings',
    hold2Body:
      'Every finding names what was compared, the source, how far the check got, and when it ran.',
    hold3Title: 'Uncertainty shown',
    hold3Body:
      'When a live source cannot be reached, the result is labelled Insufficient evidence rather than presented as checked.',
    hold4Title: 'Authority decides',
    hold4Body:
      'Only the authority that issued a document can confirm it is genuine. VeriPath links to the portal that can.',

    dataKicker: 'Data',
    dataTitle: 'Your document',
    dataBody:
      'What you paste or upload is sent for analysis to produce your result. Saved articles and display preferences are stored in your own browser, not on a server.',

    ctaTitle: 'Verify Before You Pay.',
    ctaBody: 'Start with the document in front of you.',
    ctaButton: 'Check a document',
  },
} as const;

type Dictionary = {
  -readonly [Section in keyof typeof en]: {
    -readonly [Key in keyof (typeof en)[Section]]: string;
  };
};

const bn: Dictionary = {
  common: {
    retry: 'আবার চেষ্টা করুন',
    close: 'বন্ধ করুন',
    cancel: 'বাতিল',
    loading: 'কাজ চলছে…',
    copyLink: 'লিঙ্ক কপি করুন',
    copied: 'কপি হয়েছে',
    openPortal: 'সরকারি পোর্টাল খুলুন',
    sourceLink: 'সোর্স লিঙ্ক',
    showMore: 'বিস্তারিত দেখুন',
    showLess: 'বিস্তারিত লুকান',
    demoData: 'প্রদর্শনী তথ্য',
    demoDataNote: 'ভেরিপাথ কীভাবে কাজ করে তা দেখানোর উদাহরণ। এটি প্রকৃত মূল্যায়ন নয়।',
    notStated: 'উল্লেখ নেই',
    results: 'টি ফলাফল',
    resultReady: 'ফলাফল প্রস্তুত।',
  },

  evidence: {
    heading: 'প্রমাণ',
    checked: 'যা যাচাই করা হয়েছে',
    source: 'উৎস',
    status: 'অবস্থা',
    asOf: 'সময়',
    noSource: 'কোনো সরকারি উৎস পাওয়া যায়নি',
    liveSearch: 'সরকারি পোর্টালে সরাসরি অনুসন্ধান',
    builtIn: 'অন্তর্ভুক্ত রেফারেন্স তালিকা',
  },

  states: {
    backendUnavailableTitle: 'ব্যাকএন্ড উপলব্ধ নয়',
    backendUnavailableBody:
      'ভেরিপাথ বিশ্লেষণ সেবার সাথে যুক্ত হতে পারেনি, তাই দেখানোর মতো কোনো মূল্যায়ন নেই। এখানে কিছুই যাচাই করা হয়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।',
    insufficientTitle: 'পর্যাপ্ত প্রমাণ নেই',
    insufficientBody:
      'ভেরিপাথ এর জন্য কোনো সরকারি উৎস আনতে পারেনি। এটিকে অযাচাইকৃত ধরুন এবং সংশ্লিষ্ট কর্তৃপক্ষের কাছে নিশ্চিত করুন।',
    unsupportedTitle: 'এই গন্তব্য সমর্থিত নয়',
    unsupportedBody:
      'এই গন্তব্যের জন্য ভেরিপাথের কাছে এখনো রেফারেন্স তথ্য নেই, তাই পথ মূল্যায়ন করা সম্ভব নয়। তালিকাভুক্ত গন্তব্যগুলো থেকে একটি বেছে নিন।',
    emptyTitle: 'এখনো দেখানোর কিছু নেই',
  },

  disclaimer: {
    short: 'প্রাথমিক এআই মূল্যায়ন। এটি সরকারি সিদ্ধান্ত নয়।',
    long:
      'ভেরিপাথ প্রাথমিক এআই মূল্যায়ন দেয় যাতে আপনি সঠিক প্রশ্ন করতে পারেন। এটি সরকারি সিদ্ধান্ত নেয় না এবং কোনো কাগজ আসল কিনা তা নিশ্চিত করতে পারে না। কাউকে টাকা দেওয়ার আগে সবসময় সংশ্লিষ্ট কর্তৃপক্ষের কাছে যাচাই করুন।',
  },

  shell: {
    skipToContent: 'মূল অংশে যান',
    mainLabel: 'মূল অংশ',
    primaryNav: 'প্রধান মেনু',
    homeLink: 'ভেরিপাথ এআই — হোমে যান',
    verifyCta: 'একটি কাগজ যাচাই করুন',
    settings: 'সেটিংস ও প্রদর্শন',
    openSettings: 'সেটিংস ও প্রদর্শন অপশন খুলুন',
    menu: 'মেনু',
    openMenu: 'নেভিগেশন মেনু খুলুন',
    closeMenu: 'নেভিগেশন মেনু বন্ধ করুন',
    language: 'ভাষা',
    textSize: 'বড় লেখা',
    textSizeHint: 'পুরো সাইটে লেখার আকার বাড়ান',
    contrast: 'বেশি কনট্রাস্ট',
    contrastHint: 'লেখা ও বর্ডারের স্পষ্টতা বাড়ান',
    on: 'চালু',
    off: 'বন্ধ',
  },

  footer: {
    tools: 'টুলস',
    resources: 'সরকারি রিসোর্স',
    tagline:
      'অভিবাসনের কাগজপত্রে প্রাথমিক এআই যাচাই, সাথে সেগুলো নিশ্চিত করার সরকারি পোর্টালের লিঙ্ক।',
    rights: '© ২০২৬ ভেরিপাথ এআই',
  },

  home: {
    heroKicker: 'টাকা দেওয়ার আগে',
    heroQuestion: 'একজন এজেন্ট আপনাকে একটি অফার দিয়েছে। এর কোনটি সত্যি?',
    heroTitleA: 'টাকা দেওয়ার আগে',
    heroTitleB: 'যাচাই করুন।',
    heroBody:
      'চাকরির অফার, ভিসা নোটিশ বা রসিদ দিন। ভেরিপাথ দাবিগুলো প্রকাশিত নিয়মের সাথে মেলায় এবং কে তা নিশ্চিত করতে পারে দেখায় — টাকা দেওয়ার আগেই।',
    heroPrimary: 'একটি কাগজ যাচাই করুন',
    heroSecondary: 'কীভাবে কাজ করে দেখুন',
    heroNote:
      'ভেরিপাথ প্রাথমিক এআই মূল্যায়ন দেয়। এটি ভিসা অনুমোদন করে না, কাগজ আসল কিনা নিশ্চিত করে না, সরকারি সিদ্ধান্তের বিকল্পও নয়।',

    sampleLabel: 'নমুনা — প্রদর্শনী তথ্য',
    sampleCaption:
      'ইন্টারফেস দেখানোর জন্য তৈরি একটি কাল্পনিক বার্তা। এখানে কিছুই প্রকৃত উৎসের সাথে যাচাই করা হয়নি।',
    sampleTabOffer: 'অফারটি',
    sampleTabFindings: 'পর্যবেক্ষণ',
    sampleTabNext: 'পরবর্তী পদক্ষেপ',
    sampleSender: 'ওভারসিজ এমপ্লয়মেন্ট বিডি',
    sampleTime: 'আজ · ১০:৪৭',
    sampleLine1: 'জরুরি — সিকিউরিটি গার্ড পদ এখনই খালি',
    sampleLine2: 'ভিসা নিশ্চিত, কোনো ইন্টারভিউ লাগবে না',
    sampleLine3: 'বেতন মাসে ৪,৫০০ কাতারি রিয়াল',
    sampleLine4: 'প্রসেসিং ফি ৩,৫০০ কাতারি রিয়াল, আজই দিন',
    sampleLine5: 'মাত্র ৮টি পদ বাকি, ৪৮ ঘণ্টায় শেষ',
    sampleFooter: 'জায়গা রাখতে পাসপোর্টের কপি পাঠান।',
    sampleAnalyseCta: 'এমন একটি অফার যাচাই করুন',
    sampleFindingCount: '৩টি অসঙ্গতি',
    sampleFindingTitle: 'তিনটি দাবি প্রকাশিত নিয়মের সাথে সাংঘর্ষিক',
    sampleFindingBody:
      'কাতারের শ্রম নিয়ম অনুযায়ী নিয়োগের খরচ নিয়োগকর্তার, তাই কর্মীর কাছ থেকে আগাম প্রসেসিং ফি নেওয়া নিয়মের বিরুদ্ধে। কোনো এজেন্ট ইন্টারভিউ ছাড়া ভিসা নিশ্চিত করার প্রতিশ্রুতি দিতে পারে না। ৪৮ ঘণ্টার সময়সীমা একটি চাপ সৃষ্টির কৌশল, আইনি শর্ত নয়।',
    sampleChecked: 'ফি, ভিসার নিশ্চয়তা ও সময়সীমা — প্রকাশিত নিয়োগ নিয়মের সাথে',
    sampleSource: 'প্রদর্শনী তথ্য — কোনো সরাসরি উৎস আনা হয়নি',
    sampleNextTitle: 'টাকা দেওয়ার আগে যা করবেন',
    sampleNext1: 'নিয়োগকর্তার নাম ও লাইসেন্স নম্বর লিখিতভাবে চান।',
    sampleNext2: 'সেই লাইসেন্স নিজে সরকারি রেজিস্ট্রিতে যাচাই করুন।',
    sampleNext3: 'জায়গা ধরে রাখার জন্য পাসপোর্টের কপি বা ফি পাঠাবেন না।',
    sampleAuditCta: 'নিজের কাগজ যাচাই করুন',

    demoKicker: 'একটি নমুনা উদাহরণ',
    demoTitle: 'একটি অফার, আসা থেকে পরবর্তী পদক্ষেপ পর্যন্ত।',
    demoBody:
      'একটি কাল্পনিক বার্তা অডিটরের ভিতর দিয়ে অনুসরণ করুন: এটি কী দাবি করে, কোন দাবিগুলো প্রকাশিত নিয়মের সাথে সাংঘর্ষিক, আর টাকা দেওয়ার আগে কী করতে হবে।',
    demoStep1Body: 'ফোনে যা এসেছে।',
    demoStep2Body: 'ভেরিপাথ যার সাথে মিলিয়ে দেখেছে।',
    demoStep3Body: 'কাউকে টাকা দেওয়ার আগে যা করতে হবে।',

    lineTitle: 'একটি অফারের সাথে যা ঘটে',
    lineCaption: 'নমুনা প্রদর্শনী · উদাহরণ তথ্য। এখানে কিছুই যাচাই করা হয়নি।',
    lineOfferLabel: 'অফারটি',
    lineOfferFrom: 'ওভারসিজ এমপ্লয়মেন্ট বিডি',
    lineOfferText: 'ভিসা নিশ্চিত, ইন্টারভিউ নেই। প্রসেসিং ফি ৩,৫০০ কাতারি রিয়াল আজই। ৮টি পদ বাকি।',
    lineStage: 'যাচাই',
    lineOf: '/',
    linePaused: 'থেমে আছে',
    linePauseHint: 'নিজে থেকেই চলে; ফোকাস বা মাউস রাখলে থামে।',
    lineTrackLabel: 'এই অফারটি যে পাঁচটি ধাপ পার হয়',
    lineGateLabel: 'পাঁচটি যাচাই',
    lineUnderExam: 'যা পরীক্ষা করা হচ্ছে',
    lineNoAnchor: 'বার্তায় এর কোনো উত্তর নেই।',

    outcomeWarning: 'সম্ভাব্য সতর্কতা',
    outcomeReview: 'মানুষের পর্যালোচনা প্রয়োজন',
    outcomeInsufficient: 'পর্যাপ্ত প্রমাণ নেই',

    gate1Name: 'ফি',
    gate1Check: 'চাওয়া ফি — এই কাগজ নিজেই যে নিয়ম উল্লেখ করেছে তার সাথে',
    gate1Finding: 'আগাম ৩,৫০০ রিয়াল চাইছে, অথচ উল্লিখিত নিয়মে নিয়োগের খরচ নিয়োগকর্তার।',
    gate2Name: 'নিশ্চয়তা',
    gate2Check: 'ভিসার নিশ্চয়তা — একজন এজেন্ট আসলে যা প্রতিশ্রুতি দিতে পারে তার সাথে',
    gate2Finding: 'ইন্টারভিউ ছাড়া ভিসা নিশ্চিত করার প্রতিশ্রুতি কোনো এজেন্ট দিতে পারে না।',
    gate3Name: 'সময়সীমা',
    gate3Check: '৪৮ ঘণ্টার সময়সীমা — প্রকাশিত প্রক্রিয়াকরণ সময়ের সাথে',
    gate3Finding: 'এই পথের জন্য প্রকাশিত কোনো প্রক্রিয়াকরণ সময়ের সাথে ৪৮ ঘণ্টার সময়সীমা মেলে না।',
    gate4Name: 'নিয়োগকর্তা',
    gate4Check: 'নিয়োগকর্তার নাম ও লাইসেন্স নম্বর — সরকারি রেজিস্ট্রির সাথে',
    gate4Finding: 'কোনো লাইসেন্স নম্বর দেওয়া নেই, তাই রেজিস্ট্রিতে খোঁজার মতো কিছুই নেই।',
    gate5Name: 'উৎস',
    gate5Check: 'উপরের কোনো কিছুর জন্য সরকারি উৎস আনা গেছে কিনা',
    gate5Finding: 'এই নমুনার জন্য কোনো সরকারি উৎস আনা যায়নি, কিছুই নিশ্চিত নয়।',

    findingsKicker: 'যাচাইগুলো যা পেয়েছে',
    lineResultLabel: 'যেখানে গিয়ে দাঁড়ায়',
    lineResultTitle: 'প্রাথমিক এআই মূল্যায়ন',
    lineResultBody: 'তিনটি দাবি উল্লিখিত নিয়মের সাথে সাংঘর্ষিক, এবং কোনো সরকারি উৎস আনা যায়নি।',
    lineNextStepLabel: 'পরবর্তী যাচাইয়ের ধাপ',
    lineNextStepBody: 'লাইসেন্স নম্বর লিখিতভাবে চান, তারপর সরকারি রেজিস্ট্রিতে নিজে যাচাই করুন।',

    principlesKicker: 'ভেরিপাথ যেভাবে কাজ করে',
    principlesTitle: 'প্রতিটি পর্যবেক্ষণ এমন কিছু দেখায় যা আপনি নিজে যাচাই করতে পারেন।',
    principlesBody:
      'ভেরিপাথ সিদ্ধান্ত দেয় না যে অফারটি আসল কিনা। এটি কাগজটি পড়ে, দাবিগুলো প্রকাশিত নিয়মের সাথে মেলায়, এবং কোন সরকারি সংস্থা প্রতিটি বিষয় নিশ্চিত করতে পারে তা দেখায়।',
    principle1Title: 'উৎস দেখানো হয়',
    principle1Body: 'প্রতিটি পর্যবেক্ষণে কী মেলানো হয়েছে এবং নিয়মটি কোথা থেকে এসেছে তা লেখা থাকে।',
    principle2Title: 'সহজ ভাষা',
    principle2Body: 'কোনো আইনি জটিল শব্দ নয়। কোনো দাবি নিয়মের সাথে না মিললে এক বাক্যে তা বলা হয়।',
    principle3Title: 'সবখানে বাংলা',
    principle3Body: 'প্রতিটি পাতা, পর্যবেক্ষণ ও সতর্কতা বাংলা ও ইংরেজি দুই ভাষাতেই লেখা।',
    principle4Title: 'শুধু আপনার ফলাফলের জন্য',
    principle4Body: 'আপনি যা দেন তা কেবল আপনার ফলাফল তৈরির জন্য বিশ্লেষণে পাঠানো হয়, কোথাও প্রকাশ করা হয় না।',

    challengeKicker: 'সমস্যাটি',
    challengeTitle: 'তথ্য আছে। শুধু আপনার নাগালে নেই।',
    challengeBody:
      'সরকারি শর্তগুলো ছড়িয়ে আছে নানা পোর্টালে, কঠিন ভাষায়। আর নিয়োগের দাবিগুলো আপনার ফোনে আসে, সাথে তাড়াহুড়ো নিয়ে।',
    challenge1Title: 'ছড়ানো নিয়ম',
    challenge1Body: 'ফি, কোটা ও শর্ত বিভিন্ন মন্ত্রণালয়ে, বিভিন্ন ভাষায় ছড়িয়ে আছে।',
    challenge2Title: 'আত্মবিশ্বাসী দাবি',
    challenge2Body: 'নিয়মভঙ্গকারী অফার দেখতে ঠিক নিয়ম মানা অফারের মতোই।',
    challenge3Title: 'সময়ের চাপ',
    challenge3Body: 'যাচাই করার সময় পাওয়ার আগেই টাকা চাওয়া হয়।',

    toolsKicker: 'দুটি টুল',
    toolsTitle: 'পথ যাচাই করুন, অথবা কাগজ যাচাই করুন।',
    tool1Role: 'পথ পরিকল্পনা',
    tool1Name: 'প্রোফাইল ম্যাচার',
    tool1Body:
      'আপনার দক্ষতা, বাজেট ও গন্তব্য লিখুন। সরকারি ফি, ধাপে ধাপে করণীয় এবং প্রতিটি ধাপ নিশ্চিত করার পোর্টালসহ একটি প্রাথমিক পথ পাবেন।',
    tool1Cta: 'প্রোফাইল ম্যাচার খুলুন',
    tool1PreviewRoute: 'বাংলাদেশ → কাতার · নির্মাণ',
    tool1PreviewTitle: 'ওয়ার্ক ভিসা, সাধারণ শ্রমিক',
    tool1PreviewFee: 'সরকারি ফি',
    tool1PreviewFeeValue: '৩০০ কাতারি রিয়াল',
    tool1PreviewTime: 'উল্লিখিত সময়',
    tool1PreviewTimeValue: '২–৪ সপ্তাহ',
    tool2Role: 'কাগজ যাচাই',
    tool2Name: 'ডকুমেন্ট অডিটর',
    tool2Body:
      'অফার লেটার, ভিসা নোটিশ, চুক্তি বা রসিদ পেস্ট করুন বা আপলোড করুন। কোন দাবিগুলো প্রকাশিত নিয়মের সাথে সাংঘর্ষিক তা দেখুন।',
    tool2Cta: 'ডকুমেন্ট অডিটর খুলুন',
    tool2PreviewFile: 'Offer_Letter.pdf',
    tool2PreviewClaim: 'দাবি: "কোনো মেডিকেল টেস্ট লাগবে না"',
    tool2PreviewBody:
      'প্রকাশিত নিয়ম অনুযায়ী ভিসা দেওয়ার আগে মেডিকেল পরীক্ষা বাধ্যতামূলক। এই দাবি তার সাথে সাংঘর্ষিক।',

    processKicker: 'যেভাবে কাজ করে',
    processTitle: 'চারটি ধাপ',
    processBody: 'একটি অযাচাইকৃত দাবি থেকে শুরু করে, কে তা নিশ্চিত করতে পারে সেই কর্তৃপক্ষ পর্যন্ত।',
    step1Title: 'কাগজ বা আপনার অবস্থা জানান',
    step1Body: 'লেখা পেস্ট করুন, ফাইল আপলোড করুন, বা প্রোফাইল ফর্ম পূরণ করুন।',
    step2Title: 'দাবিগুলো আলাদা করা হয়',
    step2Body: 'বেতন, ফি, সময়সীমা, নিশ্চয়তা ও লাইসেন্স নম্বর বাকি লেখা থেকে আলাদা করা হয়।',
    step3Title: 'দাবিগুলো মেলানো হয়',
    step3Body:
      'প্রতিটি দাবি প্রকাশিত নিয়মের সাথে, এবং সেবাটি পৌঁছাতে পারলে সরকারি পোর্টালে সরাসরি অনুসন্ধানের সাথে মেলানো হয়।',
    step4Title: 'পর্যবেক্ষণ ও নিশ্চিত করার উপায় পান',
    step4Body: 'প্রতিটি পর্যবেক্ষণে কী মেলানো হয়েছে, উৎস কী, কতদূর যাচাই হয়েছে এবং কখন — সবই লেখা থাকে।',

    resultsKicker: 'ফলাফল পড়া',
    resultsTitle: 'লেবেলগুলোর অর্থ',
    resultsBody:
      'দুটি জিনিস আলাদাভাবে চিহ্নিত করা হয়: কাগজটি কী বলছে, আর ভেরিপাথ তা যাচাইয়ে কতদূর যেতে পেরেছে।',
    findingsHeading: 'কাগজ সম্পর্কে',
    finding1Title: 'কোনো অসঙ্গতি পাওয়া যায়নি',
    finding1Body:
      'যে নিয়মগুলো মেলানো হয়েছে, তার সাথে এই কাগজের কিছু সাংঘর্ষিক নয়। তবে এটি কাগজটি আসল হওয়ার প্রমাণ নয়।',
    finding2Title: 'সতর্কতা প্রয়োজন',
    finding2Body: 'কিছু একটা প্রকাশিত নিয়মের সাথে মিলছে না, অথবা গুরুত্বপূর্ণ তথ্য অনুপস্থিত।',
    finding3Title: 'গুরুতর অসঙ্গতি',
    finding3Body:
      'দাবিগুলো প্রকাশিত নিয়মের বিরুদ্ধে যায়, অথবা প্রতারণামূলক নিয়োগের পরিচিত ধরনের সাথে মেলে। টাকা দেবেন না।',
    statusHeading: 'যাচাই সম্পর্কে',
    legendPreliminary: 'একটি যন্ত্র কাগজটি পড়েছে। কোনো মানুষ বা সরকারি অফিস এটি দেখেনি।',
    legendRequiresConfirmation: 'একটি উৎস পাওয়া গেছে। কাজ করার আগে উল্লিখিত কর্তৃপক্ষের কাছে নিশ্চিত করুন।',
    legendNeedsReview: 'ফলাফলটি অস্পষ্ট বা পরস্পরবিরোধী, একজন মানুষের দেখা প্রয়োজন।',
    legendInsufficient: 'কোনো সরকারি উৎস আনা যায়নি। এটিকে অযাচাইকৃত ধরুন।',
    legendBackendUnavailable: 'বিশ্লেষণ সেবার সাথে যুক্ত হওয়া যায়নি, তাই কিছুই যাচাই হয়নি।',
    legendUnsupportedDestination: 'এই গন্তব্যের জন্য ভেরিপাথের কাছে এখনো রেফারেন্স তথ্য নেই।',

    accessKicker: 'সহজলভ্যতা',
    accessTitle: 'আপনার পকেটের ফোনের জন্য তৈরি',
    accessBody: 'নিচের বোতামগুলো চেপে দেখুন একটি পর্যবেক্ষণ কীভাবে বদলায়।',
    access1: 'প্রতিটি পাতায় বাংলা ও ইংরেজি',
    access2: 'বড় লেখা ও বেশি কনট্রাস্ট, পরের বারও মনে রাখা হয়',
    access3: 'ছোট স্ক্রিন ও ধীর সংযোগেও চলে',
    access4: 'কীবোর্ড ও স্ক্রিন রিডারে সম্পূর্ণ ব্যবহারযোগ্য',
    accessDemoLabel: 'একটি পর্যবেক্ষণ দেখুন',
    accessModeStandard: 'সাধারণ',
    accessModeBengali: 'বাংলা',
    accessModeLarge: 'বড় লেখা',
    accessDemoTitle: 'সতর্কতা প্রয়োজন',
    accessDemoBody:
      'এই অফারের বেতন এই কাজের প্রকাশিত সীমার চেয়ে বেশি। টাকা দেওয়ার আগে লিখিতভাবে নিশ্চিত করুন।',

    traceKicker: 'উৎস অনুসরণ',
    traceTitle: 'প্রতিটি পর্যবেক্ষণ কোথা থেকে আসে',
    traceBody: 'ভেরিপাথের প্রতিটি পর্যবেক্ষণে একই চারটি লাইন, একই ক্রমে থাকে।',
    trace1: 'কী মেলানো হয়েছে',
    trace2: 'কোন উৎস থেকে এসেছে',
    trace3: 'যাচাই কতদূর গেছে',
    trace4: 'কখন করা হয়েছে',
    traceClaimLabel: 'দাবি',
    traceClaim: '"ভিসার সব খরচ নিয়োগকর্তা বহন করবে।"',
    traceResultTitle: 'যে নিয়মটি মেলানো হয়েছে তার সাথে মিলেছে',
    traceResultBody:
      'কাতারের প্রকাশিত শ্রম নিয়ম অনুযায়ী নিয়োগ ও ভিসা প্রক্রিয়ার খরচ নিয়োগকর্তার, কর্মীর নয়।',
    traceChecked: 'খরচ বহনের শর্ত — প্রকাশিত শ্রম নিয়মের সাথে',
    traceSource: 'প্রদর্শনী তথ্য — শ্রম মন্ত্রণালয়, কাতার',

    closingTitle: 'টাকা দেওয়ার আগে যাচাই করুন।',
    closingBody:
      'কয়েক মিনিটের যাচাই আপনাকে সঠিক প্রশ্নগুলো দেয়, আর কে সেগুলোর উত্তর দিতে পারে তার হিসাব দেয়।',
    closingCta: 'একটি কাগজ যাচাই করুন',
  },

  matcher: {
    kicker: 'প্রোফাইল ম্যাচার',
    title: 'টাকা খরচ করার আগে পথটি ঠিক করে নিন',
    intro:
      'আপনার অবস্থা লিখুন। ভেরিপাথ সরকারি ফি, ধাপে ধাপে করণীয় এবং প্রতিটি ধাপ নিশ্চিত করার পোর্টালসহ একটি প্রাথমিক পথের খসড়া তৈরি করবে। আপনি গৃহীত হবেন কিনা তা এটি বলতে পারে না।',

    formLegend1: 'গন্তব্য ও উদ্দেশ্য',
    formLegend2: 'শিক্ষা ও কাজ',
    formLegend3: 'অর্থ ও রেকর্ড',

    destination: 'গন্তব্য দেশ',
    destinationHint: 'ভেরিপাথের কাছে কেবল এই গন্তব্যগুলোর রেফারেন্স তথ্য আছে।',
    destinationRequired: 'এগিয়ে যেতে একটি গন্তব্য বেছে নিন।',
    destinationPlaceholder: 'একটি গন্তব্য বেছে নিন',
    destinationNotListed: 'আমার গন্তব্য এই তালিকায় নেই',
    purpose: 'কেন যাচ্ছেন',
    purposePlaceholder: 'উদ্দেশ্য বেছে নিন',
    education: 'সর্বোচ্চ শিক্ষা',
    educationPlaceholder: 'স্তর বেছে নিন',
    fieldOfStudy: 'বিষয় বা ট্রেড',
    fieldOfStudyHint: 'যেমন: ইলেকট্রিক্যাল, প্লাম্বিং, নার্সিং, আইটি',
    skills: 'মূল দক্ষতা ও সনদ',
    skillsHint: 'যেমন: ইলেকট্রিক ওয়্যারিং, ড্রাইভিং, ওয়েল্ডিং',
    experience: 'কাজের অভিজ্ঞতা (বছর)',
    experiencePlaceholder: 'একটি সীমা বেছে নিন',
    budget: 'হাতে থাকা টাকা (বিডিটি)',
    budgetHint: 'শুধু সংখ্যা, যেমন ৮০০০০০',
    budgetInvalid: 'পরিমাণ শুধু সংখ্যায় লিখুন।',
    funds: 'টাকার উৎস',
    fundsPlaceholder: 'উৎস বেছে নিন',
    record: 'পুলিশ বা আইনি রেকর্ড',
    recordPlaceholder: 'উত্তর বেছে নিন',
    optional: 'ঐচ্ছিক',
    required: 'আবশ্যক',

    reviewLabel: 'পর্যালোচনা',
    reviewNote:
      'এই উত্তরগুলোই ভেরিপাথ প্রকাশিত শর্তের সাথে মিলিয়ে দেখবে। ঐচ্ছিক উত্তরগুলো দিলে পথটি আরও নির্দিষ্ট হয়।',
    answered: 'দেওয়া হয়েছে',

    submit: 'প্রাথমিক পথের খসড়া তৈরি করুন',
    submitting: 'পথের খসড়া তৈরি হচ্ছে…',
    loadingDetail: 'আপনার তথ্য এই গন্তব্যের প্রকাশিত শর্তের সাথে মেলানো হচ্ছে।',

    emptyTitle: 'এখনো কোনো পথ তৈরি হয়নি',
    emptyBody: 'ফর্মটি পূরণ করুন, ভেরিপাথ একটি প্রাথমিক পথ তৈরি করবে যা নিয়ে আপনি সরকারি পোর্টালে যেতে পারবেন।',

    resultKicker: 'প্রাথমিক পথ',
    resultTitle: 'পথ —',
    indicatorLabel: 'মিলের সূচক',
    indicatorNote: 'এটি এআইয়ের দেওয়া একটি আনুমানিক স্কোর। এটি যোগ্যতার সিদ্ধান্ত নয় এবং কোনো অফিস এটি দেখেনি।',
    matchLabel: 'উল্লিখিত মিল',
    checkedProfile: 'আপনার দেওয়া তথ্য — এই গন্তব্যের প্রকাশিত শর্তের সাথে',

    warningsTitle: 'কাউকে টাকা দেওয়ার আগে এটি পড়ুন',
    adviceTitle: 'পরবর্তী করণীয়',

    groupRouteTitle: 'পথটি',
    groupRouteSummary: 'প্রোফাইলের পাঠ, প্রস্তাবিত পথ এবং এর সরকারি চ্যানেল',
    groupCostTitle: 'খরচ ও টাকা',
    groupCostSummary: 'ফির হিসাব, বাজেট যাচাই এবং টাকার প্রমাণের শর্ত',
    groupStepsTitle: 'কাগজপত্র ও ধাপ',
    groupStepsSummary: 'কী কী লাগবে, কোন ক্রমে, এবং প্রতিটি ধাপের পোর্টাল',
    groupRightsTitle: 'অধিকার ও শর্ত',
    groupRightsSummary: 'শ্রম আইন, বেতন, থাকার ব্যবস্থা এবং রেকর্ডের প্রভাব',
    groupFutureTitle: 'দীর্ঘমেয়াদে',
    groupFutureSummary: 'বসবাস, পরিবার, দক্ষতা ও রেমিট্যান্স',

    profileAnalysis: 'ভেরিপাথ আপনার প্রোফাইল যেভাবে পড়েছে',
    bestPath: 'প্রস্তাবিত পথ',
    suggestions: 'কৌশলগত পরামর্শ',
    pathwayMap: 'সরকারি চ্যানেল',
    channel: 'সরকারি চ্যানেল',
    timeline: 'উল্লিখিত সময়',
    feeCap: 'উল্লিখিত ফির সীমা',
    costTable: 'ফির হিসাব',
    costItem: 'খাত',
    costAmount: 'উল্লিখিত খরচ',
    costNote: 'মন্তব্য',
    financialCheck: 'বাজেট যাচাই',
    fundsProof: 'টাকার প্রমাণ',
    documents: 'যে কাগজগুলো লাগবে',
    roadmap: 'ধাপগুলো ক্রমানুসারে',
    officialPortal: 'সরকারি পোর্টাল',
    skills2: 'দক্ষতা ও যোগ্যতার মান',
    reality: 'সেখানে থাকা কেমন বলে জানানো হয়েছে',
    laborLaws: 'শ্রম আইন ও কর্মীর অধিকার',
    background: 'আপনার রেকর্ড যা প্রভাবিত করে',
    future: 'দীর্ঘমেয়াদি সুযোগ',
    checklist: 'করণীয়ের তালিকা',
    checklistPhase1: 'যাওয়ার আগে',
    checklistPhase2: 'দূতাবাসের সাক্ষাৎকারে',
    checklistPhase3: 'পৌঁছানোর পর',

    detailRequiredBalance: 'প্রয়োজনীয় ব্যালেন্স',
    detailSeasonedPeriod: 'যত মাস জমা থাকতে হবে',
    detailSourceOfFunds: 'টাকার উৎস',
    detailTaxClearance: 'কর ছাড়পত্র',
    detailSponsorAffidavit: 'স্পনসরের হলফনামা',

    detailMinimumWage: 'ন্যূনতম মজুরি',
    detailOvertime: 'অতিরিক্ত সময়ের কাজ',
    detailChangingEmployer: 'নিয়োগকর্তা পরিবর্তন',
    detailDisputePortal: 'অভিযোগ জানানোর পোর্টাল',

    detailNetPay: 'হাতে পাওয়া মাসিক বেতন',
    detailLivingCost: 'জীবনযাত্রার খরচ',
    detailHousing: 'থাকার ব্যবস্থা',
    detailWorkAndClimate: 'কাজ ও আবহাওয়া',
    detailProbation: 'শিক্ষানবিশকাল',

    detailTradeCertificate: 'ট্রেড সার্টিফিকেট',
    detailLanguage: 'ভাষা',
    detailPracticalTest: 'ব্যবহারিক পরীক্ষা',
    detailMinimumExperience: 'ন্যূনতম অভিজ্ঞতা',

    detailResidency: 'স্থায়ী বসবাস',
    detailFamilySponsorship: 'পরিবারকে নেওয়া',
    detailSkillUpgrading: 'দক্ষতা বাড়ানো',
    detailRemittance: 'দেশে টাকা পাঠানো',

    feeWarning:
      'এখানে দেখানো ফি এআইয়ের জানানো তথ্য, কোনো প্রকাশিত তালিকা নয়। টাকা দেওয়ার আগে প্রতিটি অঙ্ক সরকারি পোর্টালে যাচাই করুন।',
  },

  auditor: {
    kicker: 'ডকুমেন্ট অডিটর',
    title: 'কাগজের দাবি অনুযায়ী কাজ করার আগে তা যাচাই করুন',
    intro:
      'অফার লেটার, ভিসা নোটিশ, চুক্তি বা রসিদ পেস্ট করুন বা আপলোড করুন। ভেরিপাথ দাবিগুলো আলাদা করে প্রকাশিত নিয়মের সাথে মেলায়। কাগজটি আসল কিনা তা এটি বলতে পারে না।',

    inputTitle: 'কাগজটি',
    inputHint: 'চাকরির অফার, ভিসা নোটিশ, পারমিট, চুক্তি, এজেন্সির রসিদ বা ব্যাংকের কাগজ।',
    textLabel: 'লেখা পেস্ট করুন',
    textPlaceholder: 'বার্তা, চিঠি বা নোটিশ এখানে পেস্ট করুন…',
    uploadLabel: 'অথবা ফাইল আপলোড করুন',
    uploadHint: 'PDF, JPG, PNG, WEBP বা TXT। একাধিক ফাইল একসাথে বিশ্লেষণ করা হয়।',
    uploadCta: 'ফাইল বেছে নিন',
    dropHint: 'ফাইল এখানে টেনে আনুন, অথবা ডিভাইস থেকে বেছে নিন।',
    unsupportedFile: 'এই ফাইলগুলো পড়া যায়নি, তাই যুক্ত করা হয়নি:',
    supportedFiles:
      'ভেরিপাথ PDF, JPG, PNG, WEBP ও TXT পড়তে পারে। ওয়ার্ড ফাইল হলে সেটি PDF করে নিন, অথবা উপরে লেখাটি পেস্ট করুন।',
    attached: 'সংযুক্ত',
    removeFile: 'সরান',
    clearAll: 'সব সরান',
    submit: 'এই কাগজ যাচাই করুন',
    submitting: 'যাচাই চলছে…',
    loadingDetail: 'দাবিগুলো আলাদা করে প্রকাশিত নিয়মের সাথে মেলানো হচ্ছে।',

    emptyTitle: 'এখনো কোনো কাগজ যাচাই করা হয়নি',
    emptyBody: 'লেখা পেস্ট করুন বা ফাইল আপলোড করুন। তার আগে কিছুই যাচাই হয় না।',

    assessmentLabel: 'মূল্যায়ন',
    verdictNoConflicts: 'যে উৎসগুলো দেখা হয়েছে তার সাথে কোনো অসঙ্গতি নেই',
    verdictFewConflicts: 'বড় কোনো অসঙ্গতি পাওয়া যায়নি',
    verdictConflicts: 'অসঙ্গতি পাওয়া গেছে — সতর্কতা প্রয়োজন',
    verdictSerious: 'গুরুতর অসঙ্গতি — পরিচিত প্রতারণার ধরনের সাথে মেলে',
    verdictInsufficient: 'এই কাগজ মূল্যায়ন করার মতো যথেষ্ট সরকারি প্রমাণ নেই',
    verdictNote:
      'এটি কাগজের দাবিগুলো সম্পর্কে বলছে, কাগজটি নিজে আসল কিনা তা নয়। কেবল ইস্যুকারী কর্তৃপক্ষই তা নিশ্চিত করতে পারে।',
    verdictInsufficientNote:
      'কোনো সরকারি উৎস পাওয়া যায়নি, তাই এই কাগজের কোনো দাবিই প্রকাশিত নিয়মের সাথে মিলিয়ে দেখা হয়নি। একে যাচাই না-হওয়া হিসেবে ধরুন এবং ইস্যুকারী কর্তৃপক্ষের সাথে নিশ্চিত করুন।',

    riskIndicator: 'ঝুঁকির সূচক',
    authenticityIndicator: 'এআইয়ের আস্থার সূচক',
    indicatorNote: 'সংখ্যাগুলো এআইয়ের দেওয়া। কোনোটিই কাগজ সম্পর্কে চূড়ান্ত রায় নয়।',
    checkedClaims: 'কাগজের দাবিগুলো — প্রকাশিত নিয়মের সাথে',

    fakeSignals: 'যেসব বিষয়কে এআই সন্দেহজনক ধরেছে',
    genuineSignals: 'যেসব বিষয়কে এআই সঙ্গতিপূর্ণ ধরেছে',

    classificationTitle: 'এটি কী ধরনের কাগজ',
    docType: 'ধরন',
    whatIsIt: 'এটি কী',
    whatItMeans: 'এর অর্থ কী',
    whatItIsFor: 'কী কাজে লাগে',
    issuingBody: 'উল্লিখিত ইস্যুকারী',

    elementsTitle: 'কাগজে পাওয়া তথ্য',
    employer: 'নিয়োগকর্তা বা প্রতিষ্ঠান',
    candidate: 'যার নামে দেওয়া',
    jobTitle: 'পদ',
    salary: 'উল্লিখিত বেতন',
    fees: 'যে টাকা চাওয়া হয়েছে',
    licence: 'লাইসেন্স বা রেফারেন্স নম্বর',
    contact: 'দেওয়া যোগাযোগ',
    issueDate: 'তারিখ বা মেয়াদ',

    verificationTitle: 'রেজিস্ট্রি যাচাই',
    registryMatched: 'রেজিস্ট্রিতে একটি রেকর্ড মিলেছে',
    registryNotFound: 'রেজিস্ট্রিতে কোনো রেকর্ড পাওয়া যায়নি',
    registryFlagged: 'রেজিস্ট্রিতে সতর্কতা চিহ্নিত',
    registryManual: 'নিজে হাতে যাচাই করা প্রয়োজন',
    registryNote:
      'রেজিস্ট্রিতে মিল পাওয়ার অর্থ এই নামে একটি রেকর্ড আছে। এই কাগজটি তাদের কাছ থেকে এসেছে তা এটি প্রমাণ করে না।',
    searchedWith: 'যে শব্দ দিয়ে খোঁজা হয়েছে',
    portalsTitle: 'যেখানে আপনি নিজে যাচাই করতে পারেন',

    flagsTitle: 'যেখানে দাবিগুলো সাংঘর্ষিক',
    severityHigh: 'গুরুতর',
    severityMedium: 'সতর্কতা প্রয়োজন',
    severityLow: 'ছোট',
    quotedText: 'কাগজ থেকে উদ্ধৃত',
    flagRule: 'নিয়ম বা ধরন',
    flagFinding: 'ভেরিপাথের পর্যবেক্ষণ',
    whatToDo: 'যা করবেন',

    actionsTitle: 'পরবর্তী করণীয়',
    salaryCheck: 'বেতন যাচাই',
    limitationsTitle: 'এই যাচাই যা করতে পারে না',
  },

  news: {
    kicker: 'আপডেট',
    title: 'নীতি ও নিয়োগ সংক্রান্ত খবর, সাথে প্রকাশকারী পোর্টাল',
    intro:
      'অভিবাসন, পড়াশোনা ও শ্রম সংক্রান্ত ঘোষণার সারসংক্ষেপ। প্রতিটি আইটেমের সাথে মূল পোর্টালের লিঙ্ক আছে — কাজ করার আগে মূল লেখাটি পড়ুন।',

    searchLabel: 'আপডেট খুঁজুন',
    searchPlaceholder: 'বিষয়, দেশ বা উৎস দিয়ে খুঁজুন…',
    regionLabel: 'অঞ্চল',
    categoryLabel: 'বিষয়',
    trendingLabel: 'প্রচলিত বিষয়',
    clearSearch: 'সার্চ মুছুন',
    refresh: 'রিফ্রেশ',
    refreshing: 'রিফ্রেশ হচ্ছে…',
    updated: 'আপডেট',
    lastUpdatedNever: 'এখনো আনা হয়নি',

    demoBadge: 'প্রদর্শনী তথ্য',
    demoNotice:
      'এই আইটেমগুলো অ্যাপের সাথেই দেওয়া, ফিড কেমন দেখায় তা বোঝানোর জন্য। এগুলো সরাসরি খবর নয় এবং কোনো উৎস থেকে আনা হয়নি।',
    liveBadge: 'সেবা থেকে আনা',
    liveNotice:
      'এআইয়ের লেখা সারসংক্ষেপ। কাজ করার আগে সংযুক্ত পোর্টালটি পড়ুন — সারসংক্ষেপ ভুল বা পুরোনো হতে পারে।',
    offlineNotice:
      'আপডেট সেবা উপলব্ধ নয়, তাই নতুন কিছু আনা যায়নি। নিচে কেবল প্রদর্শনী আইটেমগুলো দেখানো হচ্ছে।',

    sourceLabel: 'উৎস',
    readTime: 'পড়তে',
    openOriginal: 'মূল লেখাটি পড়ুন',
    save: 'সেভ করুন',
    saved: 'সেভ করা হয়েছে',
    like: 'উপকারী',
    share: 'লিঙ্ক কপি করুন',
    articleLabel: 'আপডেট',
    summaryLabel: 'সারসংক্ষেপ',

    emptyTitle: 'আপনার ফিল্টারের সাথে কোনো আপডেট মেলেনি',
    emptyBody: 'সার্চ মুছুন অথবা অন্য বিষয় বা অঞ্চল বেছে নিন।',
    clearFilters: 'সব ফিল্টার মুছুন',

    catAll: 'সব',
    catJobs: 'চাকরি ও ক্যারিয়ার',
    catStudy: 'পড়াশোনা ও ভর্তি',
    catBusiness: 'ব্যবসা ও বাণিজ্য',
    catVisa: 'ভিসা ও ইমিগ্রেশন',
    catGov: 'সরকার ও আইন',
    catFuture: 'ভবিষ্যৎ ও দক্ষতা',
    catSaved: 'সেভ করা',

    regionAll: 'সব অঞ্চল',
    regionEurope: 'যুক্তরাজ্য ও ইউরোপ',
    regionMiddleEast: 'মধ্যপ্রাচ্য',
    regionAmerica: 'উত্তর আমেরিকা',
    regionAsia: 'এশিয়া প্যাসিফিক',
  },

  portals: {
    kicker: 'সরকারি পোর্টাল',
    title: 'যে দপ্তর নিশ্চিত করতে পারে, সরাসরি সেখানে যান',
    intro:
      'সরকারি ভিসা, শ্রম ও রেজিস্ট্রি পোর্টালের সরাসরি লিঙ্ক। ভেরিপাথ এই তালিকাটি রাখে; পাতাগুলো উল্লিখিত কর্তৃপক্ষের নিজস্ব।',

    statPortals: '{n}টি সরকারি পোর্টাল',
    statDestinations: '{n}টি গন্তব্য',

    searchLabel: 'পোর্টাল খুঁজুন',
    searchPlaceholder: 'পোর্টাল, দেশ বা ডোমেইন দিয়ে খুঁজুন…',

    countryLabel: 'গন্তব্য',
    allCountries: 'সব গন্তব্য',
    homeCountry: 'বাংলাদেশ ক্লিয়ারেন্স',

    categoryLabel: 'উদ্দেশ্য',
    allCategories: 'সব উদ্দেশ্য',

    directoryLabel: 'সরকারি পোর্টাল তালিকা',
    groupCount: '{n}টি পোর্টাল',
    groupCountOne: '{n}টি পোর্টাল',
    resultSummary: 'মোট {total}টির মধ্যে {shown}টি পোর্টাল দেখানো হচ্ছে',
    clearSearch: 'সার্চ মুছুন',
    clearDestination: 'গন্তব্য মুছুন',
    clearPurpose: 'উদ্দেশ্য মুছুন',
    clearAll: 'সব ফিল্টার মুছুন',

    domainLabel: 'ডোমেইন',
    visit: 'পোর্টাল খুলুন',
    opensNewTab: 'নতুন ট্যাবে খোলে',
    copy: 'লিঙ্ক কপি করুন',
    copyOf: 'লিঙ্ক কপি করুন: {title}',
    copied: 'কপি হয়েছে',
    copiedOf: 'লিঙ্ক কপি হয়েছে: {title}',
    copyFailed: 'কপি করা যায়নি। উপরের লেখাটি নির্বাচন করে নিজে কপি করুন।',

    emptyTitle: 'আপনার ফিল্টারের সাথে কোনো পোর্টাল মেলেনি',
    emptyBody: 'সার্চ মুছুন অথবা অন্য গন্তব্য বা উদ্দেশ্য বেছে নিন।',
    emptyElsewhere: 'অন্য গন্তব্যে মিল: {n}টি',
    emptyOtherPurpose: 'অন্য উদ্দেশ্যে মিল: {n}টি',
    reset: 'ফিল্টার রিসেট করুন',

    helplinesTitle: 'জরুরি যোগাযোগ',
    helplinesBody: 'প্রতারণামূলক নিয়োগ ও চুক্তি সংক্রান্ত অভিযোগ জানানোর জন্য।',
    helplineNote: 'নম্বরগুলো সংশ্লিষ্ট কর্তৃপক্ষের প্রকাশ করা। ব্যবহারের আগে তাদের পোর্টালে যাচাই করুন।',
    helplineCall: 'কল করুন',
    helplineCopy: 'নম্বর কপি করুন',
    helplineCopyOf: 'নম্বর কপি করুন: {authority}',
    helplineCopiedOf: 'নম্বর কপি হয়েছে: {authority}',
    helplineMatches: 'আপনার গন্তব্যের সাথে মেলে',

    helpline1Authority: 'BMET প্রতারণা রিপোর্টিং',
    helpline1Note: 'টোল-ফ্রি',
    /* Latin, per the project rule on authority names: no official Bengali
       rendering of this one is verified anywhere in the project. */
    helpline2Authority: 'Probashi Kalyan হেল্পলাইন',
    helpline2Note: '২৪/৭ কল সেন্টার',
    helpline3Authority: 'কাতার MOL শ্রম কেন্দ্র',
    helpline3Note: 'কর্মীর অধিকার লাইন',
    helpline4Authority: 'সৌদি MHRSD কেন্দ্র',
    helpline4Note: 'Qiwa ও শ্রম বিরোধ',

    guidanceKicker: 'এই তালিকা কীভাবে ব্যবহার করবেন',
    guidanceTitle: 'সরকারি উৎস ব্যবহার',
    guide1Title: 'ঠিকানা মিলিয়ে নিন।',
    guide1Body:
      'ব্যক্তিগত তথ্য দেওয়ার বা টাকা দেওয়ার আগে আপনার ব্রাউজারে দেখানো ওয়েবসাইট ডোমেইনটি এখানে দেওয়া সরকারি উৎসের সাথে মিলিয়ে নিন।',
    guide2Title: 'উৎস মানেই সিদ্ধান্ত নয়।',
    guide2Body:
      'কোনো সরকারি পোর্টালে পৌঁছানো নিজে থেকেই প্রমাণ করে না যে কোনো নিয়োগকারী, অফার বা কাগজ আসল।',
    guide3Title: 'টাকা দেওয়ার আগে নিশ্চিত হোন।',
    guide3Body:
      'কোনো ফি, শর্ত, লাইসেন্স বা প্রক্রিয়া অস্পষ্ট থাকলে কাউকে টাকা দেওয়ার আগে ইস্যুকারী কর্তৃপক্ষ বা এখানে দেওয়া সরকারি চ্যানেলে নিশ্চিত হয়ে নিন।',

    closeTitle: 'হাতে কোনো কাগজ বা অফার আছে?',
    closeBody:
      'ভেরিপাথ একটি প্রাথমিক যাচাই দেয়, আর যে পোর্টাল সেটি নিশ্চিত করতে পারে সেখানে ফিরিয়ে দেয়।',
    closeAction: 'একটি কাগজ যাচাই করুন',

    catVisa: 'ভিসা ও স্ট্যাটাস',
    catLabour: 'শ্রম ও চুক্তি',
    catGov: 'সরকার ও মন্ত্রণালয়',
    catBusiness: 'ব্যবসা ও বাণিজ্য',
    catStudy: 'পড়াশোনা ও শিক্ষা',
    catHome: 'নিজ দেশ ও ছাড়পত্র',
  },

  about: {
    kicker: 'আমাদের সম্পর্কে',
    title: 'ভেরিপাথ যা করে, আর যা করতে পারে না',
    intro:
      'ভেরিপাথ তৈরি হয়েছে তাদের জন্য, যারা অভিবাসনের কোনো সুযোগের জন্য টাকা দেবেন কিনা ঠিক করছেন — সাধারণত সময়ের চাপে, এবং সামনে থাকা দাবিগুলো যাচাই করার উপায় ছাড়াই।',

    factsLabel: 'সংক্ষেপে',
    whatIsTerm: 'এটি কী',
    whatIsDef: 'কাগজে থাকা দাবিগুলোর একটি প্রাথমিক এআই মূল্যায়ন, প্রকাশিত নিয়মের সাথে মিলিয়ে দেখা।',
    whoForTerm: 'কার জন্য',
    whoForDef: 'যারা অভিবাসনের কোনো সুযোগের জন্য টাকা দেবেন কিনা ঠিক করছেন, সাধারণত সময়ের চাপে।',
    notTerm: 'এটি যা নয়',
    notDef: 'এটি আইনি পরামর্শ নয়, ভিসার সিদ্ধান্তও নয়।',

    registerKicker: 'সক্ষমতা ও সীমা',

    doesTitle: 'যা করে',
    does1Title: 'কাগজটি পড়ে',
    does1Body: 'বেতন, ফি, সময়সীমা, নিশ্চয়তা, লাইসেন্স নম্বর — দাবিগুলো আশেপাশের কথা থেকে আলাদা করে।',
    does2Title: 'প্রকাশিত নিয়মের সাথে মেলায়',
    does2Body: 'প্রতিটি দাবি প্রকাশিত শর্তের সাথে, এবং সেবাটি পৌঁছাতে পারলে সরকারি পোর্টালের সাথে মেলায়।',
    does3Title: 'কাজটি দেখিয়ে দেয়',
    does3Body: 'প্রতিটি পর্যবেক্ষণে কী মেলানো হয়েছে, উৎস, কতদূর যাচাই হয়েছে এবং কখন — সব লেখা থাকে।',
    does4Title: 'কর্তৃপক্ষের দিকে পথ দেখায়',
    does4Body: 'যে সরকারি পোর্টাল আসলেই দাবিটি নিশ্চিত বা বাতিল করতে পারে, তার লিঙ্ক দেয়।',

    cannotTitle: 'যা করতে পারে না',
    cannot1: 'কোনো কাগজ আসল কিনা তা এটি নিশ্চিত করতে পারে না। কেবল ইস্যুকারী কর্তৃপক্ষই পারে।',
    cannot2: 'এটি ভিসা অনুমোদন, বাতিল বা ভবিষ্যদ্বাণী করতে পারে না।',
    cannot3: 'কোনো ফি, কোটা বা নিয়ম এখনো চালু আছে কিনা তার নিশ্চয়তা দিতে পারে না — নিয়ম বদলায়।',
    cannot4: 'এটি আইনি পরামর্শ বা সরকারি সিদ্ধান্তের বিকল্প নয়।',

    chainKicker: 'প্রমাণের শৃঙ্খল',
    chainTitle: 'দাবি থেকে কর্তৃপক্ষ পর্যন্ত',
    chainStep: 'ধাপ',
    chain1Label: 'দাবি',
    chain1Body: 'কাগজে লেখা একটি কথা — বেতন, ফি, সময়সীমা, লাইসেন্স নম্বর।',
    chain2Label: 'প্রকাশিত নিয়ম',
    chain2Body: 'যে প্রকাশিত শর্তের সাথে দাবিটি মিলিয়ে দেখা হয়।',
    chain3Label: 'পর্যবেক্ষণ',
    chain3Body: 'কী মেলানো হয়েছে, কীসের সাথে, কতদূর যাচাই হয়েছে এবং কখন।',
    chain4Label: 'কর্তৃপক্ষ',
    chain4Body: 'যে সরকারি পোর্টাল দাবিটি নিশ্চিত বা বাতিল করতে পারে।',

    howKicker: 'পদ্ধতি',
    howTitle: 'মূল্যায়ন যেভাবে তৈরি হয়',
    howBody:
      'আপনি যা দেন তা ভেরিপাথ একটি বৃহৎ ভাষা মডেলে পাঠায়, এই নির্দেশনাসহ যে দাবিগুলো প্রকাশিত অভিবাসন ও শ্রম নিয়মের সাথে মিলিয়ে দেখতে হবে এবং ফলাফল একটি নির্দিষ্ট কাঠামোয় ফেরত দিতে হবে। ভাষা মডেল ভুল করতে পারে এবং ভুল কথাও আত্মবিশ্বাসের সাথে বলতে পারে। এ কারণেই প্রতিটি ফলাফলকে প্রাথমিক এআই মূল্যায়ন হিসেবে চিহ্নিত করা হয়, উৎস থাকলে দেখানো হয়, আর না থাকলে ইন্টারফেস তা স্পষ্ট করে বলে দেয়।',

    limitsTitle: 'সীমাবদ্ধতা যেখানে দেখা যায়',
    limitsBody:
      'সেবাটি যখন সরাসরি কোনো উৎসে পৌঁছাতে পারে না, ফলাফলকে যাচাইকৃত হিসেবে না দেখিয়ে "পর্যাপ্ত প্রমাণ নেই" লেখা হয়। সেবাটি একেবারে অচল থাকলে ভেরিপাথ "ব্যাকএন্ড উপলব্ধ নয়" দেখায় এবং কোনো মূল্যায়নই দেখায় না — অনুমান দিয়ে ফাঁক পূরণ করে না।',

    holdKicker: 'অঙ্গীকার',
    holdTitle: 'আমরা যা মেনে চলি',
    hold1Title: 'প্রকাশিত উৎস',
    hold1Body:
      'দাবিগুলো প্রকাশিত শর্তের সাথে, এবং সেবাটি পৌঁছাতে পারলে সরকারি পোর্টালের সাথে মিলিয়ে দেখা হয়।',
    hold2Title: 'অনুসরণযোগ্য পর্যবেক্ষণ',
    hold2Body:
      'প্রতিটি পর্যবেক্ষণে কী মেলানো হয়েছে, উৎস, কতদূর যাচাই হয়েছে এবং কখন — সব লেখা থাকে।',
    hold3Title: 'অনিশ্চয়তা স্পষ্ট করা',
    hold3Body:
      'সরাসরি কোনো উৎসে পৌঁছানো না গেলে ফলাফলকে যাচাইকৃত হিসেবে না দেখিয়ে "পর্যাপ্ত প্রমাণ নেই" লেখা হয়।',
    hold4Title: 'সিদ্ধান্ত কর্তৃপক্ষের',
    hold4Body:
      'কোনো কাগজ আসল কিনা কেবল ইস্যুকারী কর্তৃপক্ষই নিশ্চিত করতে পারে। ভেরিপাথ সেই পোর্টালের লিঙ্ক দেয়।',

    dataKicker: 'তথ্য',
    dataTitle: 'আপনার কাগজ',
    dataBody:
      'আপনি যা পেস্ট বা আপলোড করেন তা কেবল আপনার ফলাফল তৈরির জন্য বিশ্লেষণে পাঠানো হয়। সেভ করা খবর ও প্রদর্শন পছন্দ আপনার নিজের ব্রাউজারে রাখা হয়, কোনো সার্ভারে নয়।',

    ctaTitle: 'টাকা দেওয়ার আগে যাচাই করুন।',
    ctaBody: 'আপনার সামনে থাকা কাগজটি দিয়েই শুরু করুন।',
    ctaButton: 'একটি কাগজ যাচাই করুন',
  },
};

export function useT(lang: Language): Dictionary {
  return lang === 'bn' ? bn : (en as unknown as Dictionary);
}

export type { Dictionary };
