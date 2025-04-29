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
  assetNumber: number;
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

export interface NewDisbursementRequest {
  ProjectNumber: number;
  AssetNumber: number;
  Category: string;
  SubCategory: string;
  PartyName: string;
  PartyGSTIN?: string;
  PartyPAN?: string;
  PartyEmail?: string;
  PartyMobile?: string;
  Reason: string;
  PurchaseOrder?: string;
  TotalOrderAmount?: number;
  DocumentType?: string;
  PartyDocumentNumber?: string;
  PartyDocumentDate: Date;
  PartyDocumentPayableDays?: number;
  PartyDocumentAmount: number;
  PartyDocumentGSTAmount: number;
  PartyDocumentTotalAmount: number;
  PartyTDSAmount?: number;
  PartyAdvanceAdjusted?: number;
  PartyRetentionAmount?: number;
  PartyOtherDeductionAmount?: number;
  PartyPayableAmount: number;
  PartyOutstandingAmount: number;
  BorrowerAccountNumber: string;
  PartyBankName: string;
  PartyAccountName: string;
  PartyAccountNumber: string;
  PartyAccountIFSC: string;
  Status: string;
  ApprovedAmount: number;
  ReferenceDRNumber?: number;
  Remarks?: string;
  AttachmentReference?: string;
  CreatedBy: string;
  LastModifiedBy: string;
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