export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string;
  role: string | null;
  borrowerCode: string | null;
  trusteeCode: string | null;
  pmeCode: string | null;
}


export interface Project {
    projectName: string;
    projectNumber: string;
    totalIRR: number;
    borrowerIRR: number;
    mspApplicable: string;
}

export interface UserCheckResult {
  isValid: boolean;
  code: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  code?: string; // Optional because not all logins return a code
}

export interface AssetSale {
  [key: string]: any;
  yearMonth: string;
  projectNumber: string;
  assetNumber: string;
  phase: string;
  building: string;
  floor: string;
  unitNumber: string;
  unitConfiguration: string;
  unitType: string;
  saleableArea: number;
  carpetArea: number;
  carpetAreaRR: number;
  uniqueUnitNumber: string;
  owner: string;
  soldFlag: string;
  registeredFlag: string;
  registrationDate: string | null;
  bookingDate: string | null;
  allotmentLetterDate: string | null;
  agreementDate: string | null;
  customerName: string;
  customerKycAadhar: string;
  customerKycPan: string;
  customerKycMobile: string;
  customerKycEmail: string;
  customerKycAddress: string;
  ncIssuedFlag: string;
  ncNumber: string;
  salesBasePrice: number;
  salesStampDutyAmount: number;
  salesRegistrationAmount: number;
  salesOtherCharges: number;
  salesPassThroughCharges: number;
  salesTaxesAmount: number;
  salesTotalAmount: number;
  demandBasePrice: number;
  demandStampDuty: number;
  demandRegistrationAmount: number;
  demandOtherCharges: number;
  demandPassThroughCharges: number;
  demandTaxesAmount: number;
  demandTotalAmount: number;
  receivedBasePrice: number;
  receivedStampDutyAmount: number;
  receivedRegistrationAmount: number;
  receivedOtherCharges: number;
  receivedPassThroughCharges: number;
  receivedTaxesAmount: number;
  receivedTotalAmount: number;
  modeOfFinance: string;
  financialInstitutionName: string;
  paymentPlanName: string;
  sourceOfCustomer: string;
  channelPartnerName: string;
  channelPartnerMobile: string;
  channelPartnerEmail: string;
  brokerageAmount: number;
}

export interface ApprovalWorkflow {
  statusFlag: string;
  workflowComment: string;
  username: string;
}

export interface DisbursementRequestDto {
  PadrDrNmbrN: number;
  PadrPrjctNmbrN: number;
  PadrAsstNmbrN: number;
  PadrCtgryV: string;
  PadrSbCtgryV: string;
  PadrPrtyNmV: string;
  PadrPrtyGstnV: string;
  PadrPrtyPanV: string;
  PadrPrtyEmlV: string;
  PadrPrtyMblV: string;
  PadrRsnV: string;
  PadrPoWoV: string;
  PadrTtlOrdrAmntN: number;
  PadrDcmntTypV: string;
  PadrPrtyDcmntNmbrV: string;
  PadrPrtyDcmntDtD: Date;
  PadrPrtyDcmntPyblDysN: number;
  PadrPrtyDcmntAmntN: number;
  PadrPrtyDcmntGstAmntN: number;
  PadrPrtyDcmntTtlAmntN: number;
  PadrPrtyTdsAmntN: number;
  PadrPrtyAdvncAdjstdN: number;
  PadrPrtyRtntnAmntN: number;
  PadrPrtyOthrDdctnAmntN: number;
  PadrPrtyPyblAmntN: number;
  PadrPrtyOtstndngAmntN: number;
  PadrBrrwrAccntNmbrV: string;
  PadrPrtyBnkNmV: string;
  PadrPrtyAccntNmV: string;
  PadrPrtyAccntNmbrV: string;
  PadrPrtyAccntIfscV: string;
  PadrSttsC: string;
  PadrApprvdAmntN: number;
  PadrRfrncDrNmbrN: number;
  PadrRmrksV: string;
  PadrAttchmntRfrncV: string;

  // File attachment properties
  // AttachmentFileName: string;
  // AttachmentContentType: string;
  // Attachment: Blob; // Assuming Blob is used for file attachments

  CoinCrtnUsrIdV: string, // New field
  CoinCrtnDtD: Date, // New field
  CoinLstMdfdUsrIdV: string, // New field
  CoinLstMdfdDtD: Date, // New field
}

// types.ts
export interface NewDisbursementRequest {
  ProjectNumber: string | number;
  AssetNumber: string;
  Category: string;
  SubCategory: string;
  PartyName: string;
  PartyGSTIN?: string;
  PartyPAN?: string;
  PartyEmail?: string;
  PartyMobile?: string;
  Reason: string;
  PurchaseOrder?: string;
  TotalOrderAmount?: string | number;
  DocumentType?: string;
  PartyDocumentNumber?: string;
  PartyDocumentDate?: string;
  PartyDocumentPayableDays?: string | number;
  PartyDocumentAmount: string | number;
  PartyDocumentGSTAmount: string | number;
  PartyDocumentTotalAmount?: string | number;
  PartyTDSAmount?: string | number;
  PartyAdvanceAdjusted?: string | number;
  PartyRetentionAmount?: string | number;
  PartyOtherDeductionAmount?: string | number;
  PartyPayableAmount: string | number;
  PartyOutstandingAmount: string | number;
  BorrowerAccountNumber: string;
  PartyBankName: string;
  PartyAccountName: string;
  PartyAccountNumber: string;
  PartyAccountIFSC: string;
  Status: string;
  ApprovedAmount: string | number;
  ReferenceDRNumber?: string | number;
  Remarks?: string;
  AttachmentReference: string;
  CreatedBy: string;
  LastModifiedBy: string;
  Attachments: { file: File; name: string; type: string }[];
}

export interface FileDataStorageBlobDto {
  FdsbNmbrN: number;
  FdsbFlNmV: string;
  FdsbFlTypV: string;
  FdsbFlB: Uint8Array; // Using Uint8Array for byte array
}

export interface ProjectHeader {
  remarks: string;
  userName: string;
}

export interface MaxFdsbNumberResponse {
  maxFdsbNumber: number;
}

export interface ProjectAssetBankAccount {
  AccountNumber: string;
}

export interface DpBankAccount {
  AccountNumber: string;
}