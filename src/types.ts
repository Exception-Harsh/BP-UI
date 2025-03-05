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

export interface newAssetSale {
  [key: string]: any;
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
