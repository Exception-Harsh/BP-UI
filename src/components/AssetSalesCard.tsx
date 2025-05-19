import { useState, useEffect } from "react";
import { AssetSale, ApprovalWorkflow } from "../types";
import endpoints from "../endpoints";
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { FaInfoCircle } from 'react-icons/fa';

interface ColumnNames {
  [key: string]: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  style?: React.CSSProperties;
}

interface AssetSalesComponentProps {
  isDarkMode: boolean;
  submissionSuccessful: boolean;
  setSubmissionSuccessful: (status: boolean) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onDismiss, style }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        clearInterval(timer);
        onDismiss(notification.id);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [notification.id, onDismiss]);

  return (
    <div
      className={`fixed top-4 right-4 w-80 p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 ${
        notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      } transition-transform duration-300 ease-in-out`}
      style={style}
    >
      {notification.type === 'success' ? (
        <IoCheckmarkCircle className="text-2xl" />
      ) : (
        <IoCloseCircle className="text-2xl" />
      )}
      <span className="flex-1 text-sm">{notification.message}</span>
      <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-50">
        <div
          className="h-full bg-white transition-all duration-[50ms] ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function AssetSalesComponent({
  isDarkMode,
  submissionSuccessful,
  setSubmissionSuccessful
}: AssetSalesComponentProps) {
  const [data, setData] = useState<AssetSale[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [selectedAssetNumber, setSelectedAssetNumber] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [soldFlag, setSoldFlag] = useState<boolean>(false);
  const [yearMonth, setYearMonth] = useState<string>("");
  const [projectNumber, setProjectNumber] = useState<string | null>(null);
  const [updatedRows, setUpdatedRows] = useState<AssetSale[]>([]);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const [unitNumbers, setUnitNumbers] = useState<string[]>([]);
  const [unitConfigurations, setUnitConfigurations] = useState<string[]>([]);
  const [customerNames, setCustomerNames] = useState<string[]>([]);
  const [buildingMap, setBuildingMap] = useState<{ [key: string]: string }>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [workflowStatus, setWorkflowStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectPopup, setShowRejectPopup] = useState<boolean>(false);
  const [rejectInput, setRejectInput] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: { [key: string]: boolean } }>({});
  const userRole = localStorage.getItem("role");

  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
  };

  const getUnitTypeLabel = (unitType: string | null | undefined): string => {
    switch (unitType) {
      case 'S': return 'Shop';
      case 'P': return 'Parking';
      case 'R': return 'Residential';
      default: return unitType || '';
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatYearMonth = (yearMonth: string | any[]) => {
    if (typeof yearMonth !== 'string') {
      console.error("yearMonth is not a string:", yearMonth);
      return "";
    }
    const year = yearMonth.slice(0, 4);
    const month = yearMonth.slice(4, 6);
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const mapToDisplayLabel = (field: string, value: string | null | undefined): string => {
    if (!value) return "";
    if (field === "SourceOfCustomer") {
      switch (value.trim()) {
        case "D": return "Direct";
        case "C": return "Channel Partners (CP)";
        case "O": return "Others";
        default: return value;
      }
    } else if (field === "ModeOfFinance") {
      switch (value.trim()) {
        case "S": return "Self";
        case "L": return "Loan";
        case "F": return "Financial Institution";
        case "O": return "Others";
        default: return value;
      }
    }
    return value;
  };

  const columnNames: ColumnNames = {
    UnitNumber: "Unit No.",
    UnitConfiguration: "Unit Config.",
    UnitType: "Unit Type",
    CarpetAreaRR: "Carpet Area (RR)",
    SaleableArea: "Saleable Area",
    Floor: "Floor",
    SalesBasePrice: "Base Price",
    SalesStampDutyAmount: "Stamp Duty",
    SalesRegistrationAmount: "Registration",
    SalesOtherCharges: "Other Charges",
    SalesPassThroughCharges: "Pass-Through",
    SalesTaxesAmount: "Taxes",
    DemandBasePrice: "Base Price",
    DemandStampDuty: "Stamp Duty",
    DemandRegistrationAmount: "Registration",
    DemandOtherCharges: "Other Charges",
    DemandPassThroughCharges: "Pass-Through",
    DemandTaxesAmount: "Taxes",
    ReceivedBasePrice: "Base Price",
    ReceivedStampDutyAmount: "Stamp Duty",
    ReceivedRegistrationAmount: "Registration",
    ReceivedOtherCharges: "Other Charges",
    ReceivedPassThroughCharges: "Pass-Through",
    ReceivedTaxesAmount: "Taxes",
    RegistrationDate: "Registration Date",
    CustomerName: "Name",
    CustomerKycAadhar: "Aadhar",
    CustomerKycPan: "PAN",
    CustomerKycMobile: "Mobile",
    CustomerKycEmail: "Email",
    CustomerKycAddress: "Address",
    SourceOfCustomer: "Source of Customer",
    ChannelPartnerName: "Partner Name",
    ChannelPartnerMobile: "Partner Mobile",
    ChannelPartnerEmail: "Partner Email",
    NcNumber: "NOC Number",
    PaymentPlanName: "Payment Plan",
    ModeOfFinance: "Mode of Finance",
    FinancialInstitutionName: "Financial Institution",
    BrokerageAmount: "Brokerage Amount",
    BookingDate: "Booking Date",
    AllotmentLetterDate: "Allotment Letter Date",
    AgreementDate: "Agreement Date",
  };

  useEffect(() => {
    const storedYearMonth = localStorage.getItem("yearMonth");
    const storedProjectNumber = localStorage.getItem("projectNumber");
    if (storedYearMonth) setYearMonth(storedYearMonth);
    if (storedProjectNumber) setProjectNumber(storedProjectNumber);
  }, []);

  useEffect(() => {
    if (!projectNumber || !yearMonth) return;
    const url = `${endpoints.sales}buildings/${projectNumber}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((fetchedData) => {
        if (fetchedData && Array.isArray(fetchedData.buildings)) {
          const buildingNames = fetchedData.buildings.map((building: any) => building.buildingName);
          setBuildings(buildingNames);
          const map: { [key: string]: string } = {};
          fetchedData.buildings.forEach((building: any) => {
            map[building.buildingName] = building.assetNumber;
          });
          setBuildingMap(map);
          const buildingsData = fetchedData.buildings.map((building: any) => ({
            asm_bldng_v: building.buildingName,
            asm_asst_nmbr_n: building.assetNumber,
          }));
          localStorage.setItem("buildingsData", JSON.stringify(buildingsData));
        } else {
          setBuildings([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching buildings:", error.message);
        setBuildings([]);
      });
  }, [projectNumber, yearMonth]);

  const checkWorkflowStatus = async () => {
    if (!projectNumber || !yearMonth || !userRole) return;
    const url = `${endpoints.workflowCheck}${projectNumber}/${yearMonth}/${userRole}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setWorkflowStatus(result.status === "null" ? null : result.status);
      setRejectionReason(result.comment && result.comment !== "null" ? result.comment : "");
      if (result.status !== "A" || userRole !== "Arbour") {
        setSubmissionSuccessful(false);
      }
    } catch (error) {
      setWorkflowStatus(null);
      setRejectionReason("");
      addNotification("Failed to fetch workflow status.", "error");
    }
  };

  useEffect(() => {
    if (projectNumber && yearMonth && userRole) {
      checkWorkflowStatus();
    } else {
      setWorkflowStatus(null);
      setRejectionReason("");
    }
  }, [projectNumber, yearMonth, userRole]);

  useEffect(() => {
    if (!projectNumber || !selectedAssetNumber || !yearMonth || !userRole) return;
    let shouldFetchData = false;
    if (userRole === "Borrower") {
      shouldFetchData = workflowStatus === null || workflowStatus === "R";
    } else if (userRole === "PME") {
      shouldFetchData = workflowStatus === "0";
    } else if (userRole === "Arbour") {
      shouldFetchData = workflowStatus === "A";
    }
    if (!shouldFetchData) {
      setData([]);
      return;
    }
    let url = `${endpoints.sales}dataByAsset/${projectNumber}/${yearMonth}/${selectedAssetNumber}`;
    if (userRole === "PME" || userRole === "Arbour") {
      url = `${endpoints.sales}updatedDataByAsset/${projectNumber}/${yearMonth}/${selectedAssetNumber}`;
    }
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((fetchedData) => {
        if (Array.isArray(fetchedData.data)) {
          const mappedData = fetchedData.data.map((row: AssetSale) => ({
            ...row,
            SourceOfCustomer: mapToDisplayLabel("SourceOfCustomer", row.SourceOfCustomer),
            ModeOfFinance: mapToDisplayLabel("ModeOfFinance", row.ModeOfFinance),
          }));
          setData(mappedData);
        } else {
          setData([]);
        }
      })
      .catch((error) => {
        setData([]);
        addNotification("Failed to fetch asset sales data.", "error");
      });
  }, [projectNumber, selectedAssetNumber, yearMonth, workflowStatus, userRole]);

  useEffect(() => {
    setData([]);
    setUnitNumbers([]);
    setUnitConfigurations([]);
    setCustomerNames([]);
    setUpdatedRows([]);
  }, [selectedAssetNumber]);

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2);
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const validateCustomerDetails = (row: AssetSale): boolean => {
    if (row.SoldFlag?.trim().toUpperCase() === "Y") {
      const requiredFields = [
        "CustomerName",
        "CustomerKycAadhar",
        "CustomerKycPan",
        "CustomerKycMobile",
        "CustomerKycEmail",
        "CustomerKycAddress",
      ];
      return requiredFields.every((field) => row[field] && row[field].trim() !== "");
    }
    return true;
  };

  const handleChange = (
    index: number,
    key: string,
    value: string | number | boolean
  ) => {
    if (
      userRole === "Borrower" && workflowStatus !== null && workflowStatus !== "R"
    ) {
      return;
    }
    if (["Arbour", "PME", "Trustee"].includes(userRole || "")) {
      return;
    }
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [key]: value };
    if (key === "RegistrationDate" && value) {
      updatedData[index]["AgreementDate"] = value;
    }
    if (key === "SoldFlag" && value === "N") {
      [
        "SalesBasePrice",
        "SalesStampDutyAmount",
        "SalesRegistrationAmount",
        "SalesOtherCharges",
        "SalesPassThroughCharges",
        "SalesTaxesAmount",
        "DemandBasePrice",
        "DemandStampDuty",
        "DemandRegistrationAmount",
        "DemandOtherCharges",
        "DemandPassThroughCharges",
        "DemandTaxesAmount",
        "ReceivedBasePrice",
        "ReceivedStampDutyAmount",
        "ReceivedRegistrationAmount",
        "ReceivedOtherCharges",
        "ReceivedPassThroughCharges",
        "ReceivedTaxesAmount",
        "RegistrationDate",
        "CustomerName",
        "CustomerKycAadhar",
        "CustomerKycPan",
        "CustomerKycMobile",
        "CustomerKycEmail",
        "CustomerKycAddress",
        "SourceOfCustomer",
        "ChannelPartnerName",
        "ChannelPartnerMobile",
        "ChannelPartnerEmail",
        "NcNumber",
        "PaymentPlanName",
        "ModeOfFinance",
        "FinancialInstitutionName",
        "BrokerageAmount",
        "BookingDate",
        "AllotmentLetterDate",
        "AgreementDate",
      ].forEach((field) => {
        updatedData[index][field] = null;
      });
      updatedData[index]["RegisteredFlag"] = "N";
      updatedData[index]["NcIssuedFlag"] = "N";
    }
    if (key === "RegisteredFlag" && value === "N") {
      ["RegistrationDate", "AgreementDate"].forEach((field) => {
        updatedData[index][field] = null;
      });
    }
    if (key === "NcIssuedFlag" && value === "N") {
      ["NcNumber"].forEach((field) => {
        updatedData[index][field] = null;
      });
    }
    if (key === "SourceOfCustomer" && value !== "Channel Partners (CP)") {
      [
        "ChannelPartnerName",
        "ChannelPartnerMobile",
        "ChannelPartnerEmail",
      ].forEach((field) => {
        updatedData[index][field] = null;
      });
    }
    if (
      key.includes("BasePrice") ||
      key.includes("StampDuty") ||
      key.includes("RegistrationAmount") ||
      key.includes("OtherCharges") ||
      key.includes("PassThroughCharges") ||
      key.includes("TaxesAmount") ||
      key.includes("BrokerageAmount")
    ) {
      const inputStr = value.toString().trim();
      const isAlpha = /[a-zA-Z]/.test(inputStr);
      if (isAlpha) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          [`${index}-${key}`]: "Enter numeric values",
        }));
        updatedData[index][key] = "";
        setData(updatedData);
        return;
      } else {
        setInputErrors((prevErrors) => {
          const { [`${index}-${key}`]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    const prefixes = ["Sales", "Demand", "Received"];
    prefixes.forEach((prefix) => {
      const basePriceKey = `${prefix}BasePrice`;
      const fieldsToValidate = [
        `${prefix}${prefix === "Demand" ? "StampDuty" : "StampDutyAmount"}`,
        `${prefix}RegistrationAmount`,
        `${prefix}OtherCharges`,
        `${prefix}PassThroughCharges`,
        `${prefix}TaxesAmount`,
      ];
      fieldsToValidate.forEach((field) => {
        if (key === field || key === basePriceKey) {
          const basePrice = parseFloat(updatedData[index][basePriceKey]) || 0;
          const fieldValue = parseFloat(updatedData[index][field]) || 0;
          if (fieldValue >= basePrice && fieldValue !== 0) {
            setInputErrors((prevErrors) => ({
              ...prevErrors,
              [`${index}-${field}`]: "Amount should be less than Base Price",
            }));
          } else {
            setInputErrors((prevErrors) => {
              const { [`${index}-${field}`]: _, ...rest } = prevErrors;
              return rest;
            });
          }
        }
      });
    });
    if (key === "DemandBasePrice" || key === "SalesBasePrice") {
      const demandBasePrice = parseFloat(updatedData[index]["DemandBasePrice"]) || 0;
      const salesBasePrice = parseFloat(updatedData[index]["SalesBasePrice"]) || 0;
      if (demandBasePrice > salesBasePrice && demandBasePrice !== 0) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          [`${index}-DemandBasePrice`]: "Demand Base Price should be less than or equal to Sales Base Price",
        }));
      } else {
        setInputErrors((prevErrors) => {
          const { [`${index}-DemandBasePrice`]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    if (key === "ReceivedBasePrice" || key === "DemandBasePrice") {
      const receivedBasePrice = parseFloat(updatedData[index]["ReceivedBasePrice"]) || 0;
      const demandBasePrice = parseFloat(updatedData[index]["DemandBasePrice"]) || 0;
      if (receivedBasePrice > demandBasePrice && receivedBasePrice !== 0) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          [`${index}-ReceivedBasePrice`]: "Received Base Price should be less than or equal to Demand Base Price",
        }));
      } else {
        setInputErrors((prevErrors) => {
          const { [`${index}-ReceivedBasePrice`]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    setData(updatedData);
    const existingRowIndex = updatedRows.findIndex(
      (row) => row.UniqueUnitNumber === updatedData[index].UniqueUnitNumber
    );
    if (existingRowIndex >= 0) {
      const newUpdatedRows = [...updatedRows];
      newUpdatedRows[existingRowIndex] = updatedData[index];
      setUpdatedRows(newUpdatedRows);
    } else {
      setUpdatedRows([...updatedRows, updatedData[index]]);
    }
  };

  const formatAmount = (amount: number | string) => {
    if (!amount || parseFloat(amount as string) === 0) return "";
    return parseFloat(amount as string).toLocaleString('en-IN');
  };

  const calculateTotal = (row: any, prefix: string) => {
    const basePrice = parseFloat(row[`${prefix}BasePrice`]) || 0;
    const stampDuty = parseFloat(row[`${prefix}${prefix === "Demand" ? "StampDuty" : "StampDutyAmount"}`]) || 0;
    const registrationAmount = parseFloat(row[`${prefix}RegistrationAmount`]) || 0;
    const otherCharges = parseFloat(row[`${prefix}OtherCharges`]) || 0;
    const passThroughCharges = parseFloat(row[`${prefix}PassThroughCharges`]) || 0;
    const taxesAmount = parseFloat(row[`${prefix}TaxesAmount`]) || 0;
    return basePrice + stampDuty + registrationAmount + otherCharges + passThroughCharges + taxesAmount;
  };

  const handleSubmit = async () => {
    if (!updatedRows.length) {
      addNotification("No changes to save.", "error");
      return;
    }
    if (Object.keys(inputErrors).length > 0) {
      addNotification("Error Saving Data", "error");
      return;
    }

    // Check if customer details are filled for sold units
    const hasInvalidCustomerDetails = updatedRows.some((row) => !validateCustomerDetails(row));
    if (hasInvalidCustomerDetails) {
      addNotification("Please fill in all customer details for sold units.", "error");
      return;
    }

    setIsSaving(true);
    const mappedRows = updatedRows.map(row => ({
      ...row,
      SourceOfCustomer: row.SourceOfCustomer ? (() => {
        switch (row.SourceOfCustomer.trim()) {
          case "Direct": return "D";
          case "Channel Partners (CP)": return "C";
          case "Others": return "O";
          default: return row.SourceOfCustomer;
        }
      })() : null,
      ModeOfFinance: row.ModeOfFinance ? (() => {
        switch (row.ModeOfFinance.trim()) {
          case "Self": return "S";
          case "Loan": return "L";
          case "Financial Institution": return "F";
          case "Others": return "O";
          default: return row.ModeOfFinance;
        }
      })() : null,
    }));
    try {
      const response = await fetch(
        `${endpoints.update}${projectNumber}/${yearMonth}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mappedRows),
        }
      );
      if (!response.ok) {
        addNotification("Some updates failed.", "error");
      } else {
        addNotification("All updates successful", "success");
        setUpdatedRows([]);
      }
    } catch (error) {
      addNotification("Some updates failed.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitApproval = async () => {
    if (!projectNumber || !yearMonth) {
      addNotification("Submit failed.", "error");
      return;
    }

    // Check if customer details are filled for sold units
    const hasInvalidCustomerDetails = data.some((row) => row.SoldFlag?.trim().toUpperCase() === "Y" && !validateCustomerDetails(row));
    if (hasInvalidCustomerDetails) {
      addNotification("Please fill in all customer details for sold units.", "error");
      return;
    }

    const credentials = localStorage.getItem("rememberedCredentials");
    const parsedCredentials = credentials ? JSON.parse(credentials) : null;
    const username = parsedCredentials?.username ?? "";
    const requestBody: ApprovalWorkflow = {
      statusFlag: '0',
      workflowComment: "",
      username: username,
    };
    try {
      const response = await fetch(
        `${endpoints.workflow}${projectNumber}/${yearMonth}/Borrower`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        addNotification("Submit failed.", "error");
      } else {
        addNotification("Submit successful!", "success");
        setSubmissionSuccessful(true);
        await checkWorkflowStatus();
      }
    } catch (error) {
      addNotification("Submit failed.", "error");
    }
  };

  const handleApprove = async () => {
    if (!projectNumber || !yearMonth) {
      addNotification("Approval failed.", "error");
      return;
    }
    const credentials = localStorage.getItem("rememberedCredentials");
    const parsedCredentials = credentials ? JSON.parse(credentials) : null;
    const username = parsedCredentials?.username ?? "";
    const requestBody: ApprovalWorkflow = {
      statusFlag: 'A',
      workflowComment: `Approved by ${userRole}`,
      username: username,
    };
    try {
      const response = await fetch(
        `${endpoints.workflow}${projectNumber}/${yearMonth}/${userRole}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        addNotification("Approval failed.", "error");
      } else {
        addNotification("Approval successful!", "success");
        if (userRole === "Arbour") {
          await fetch(
            `${endpoints.updateProjecthdr}/${projectNumber}/${yearMonth}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ UserName: username }),
            }
          );
          setSubmissionSuccessful(true);
        }
        await checkWorkflowStatus();
      }
    } catch (error) {
      addNotification("Approval failed.", "error");
    }
  };

  const handleReject = async () => {
    if (!projectNumber || !yearMonth) {
      addNotification("Rejection failed.", "error");
      return;
    }
    if (["Arbour", "PME"].includes(userRole || "")) {
      setShowRejectPopup(true);
      return;
    }
    const credentials = localStorage.getItem("rememberedCredentials");
    const parsedCredentials = credentials ? JSON.parse(credentials) : null;
    const username = parsedCredentials?.username ?? "";
    const requestBody: ApprovalWorkflow = {
      statusFlag: 'R',
      workflowComment: `Rejected by ${userRole}`,
      username: username,
    };
    try {
      const response = await fetch(
        `${endpoints.workflow}${projectNumber}/${yearMonth}/${userRole}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        addNotification("Rejection failed.", "error");
      } else {
        addNotification("Rejection successful!", "success");
        await checkWorkflowStatus();
      }
    } catch (error) {
      addNotification("Rejection failed.", "error");
    }
  };

  const handleRejectConfirm = async () => {
    if (!projectNumber || !yearMonth) {
      addNotification("Rejection failed.", "error");
      setShowRejectPopup(false);
      return;
    }
    if (!rejectInput.trim()) {
      addNotification("Please enter a reason for rejection.", "error");
      return;
    }
    const credentials = localStorage.getItem("rememberedCredentials");
    const parsedCredentials = credentials ? JSON.parse(credentials) : null;
    const username = parsedCredentials?.username ?? "";
    const requestBody: ApprovalWorkflow = {
      statusFlag: 'R',
      workflowComment: rejectInput,
      username: username,
    };
    try {
      const response = await fetch(
        `${endpoints.workflow}${projectNumber}/${yearMonth}/${userRole}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        addNotification("Rejection failed.", "error");
      } else {
        addNotification("Rejection successful!", "success");
        setShowRejectPopup(false);
        setRejectInput("");
        await checkWorkflowStatus();
      }
    } catch (error) {
      addNotification("Rejection failed.", "error");
    }
  };

  const handleRejectCancel = () => {
    setShowRejectPopup(false);
    setRejectInput("");
  };

  const toggleSection = (rowIndex: number, section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [section]: !prev[rowIndex]?.[section],
      },
    }));
  };

  const filteredData = data.filter((row) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (row.UnitNumber?.toLowerCase().includes(searchLower) ||
        row.UnitConfiguration?.toLowerCase().includes(searchLower) ||
        row.CustomerName?.toLowerCase().includes(searchLower)) &&
      (soldFlag ? row.SoldFlag?.trim().toUpperCase() === "Y" : true)
    );
  });

  const isFullyApproved = submissionSuccessful && userRole === "Arbour" && workflowStatus === "A";
  const isDataNotSubmitted = (userRole === "PME" || userRole === "Arbour") && workflowStatus === null;
  const isPmeApprovalPending = userRole === "Arbour" && workflowStatus === "0";
  const isBorrowerSubmitted = userRole === "Borrower" && workflowStatus === "0";
  const canViewData = (
    (userRole === "Borrower" && (workflowStatus === null || workflowStatus === "R")) ||
    (userRole === "PME" && workflowStatus === "0") ||
    (userRole === "Arbour" && workflowStatus === "A")
  );

  if (userRole === "Borrower" && yearMonth === getCurrentYearMonth()) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-lg`}>
        <p className="text-green-500 text-lg font-semibold text-center">
          All asset sales data filled.
        </p>
      </div>
    );
  }

  if (isFullyApproved) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-lg`}>
        <p className="text-green-500 text-lg font-semibold text-center">
          Sales data for {formatYearMonth(yearMonth)} has been approved.
        </p>
      </div>
    );
  }

  if (isDataNotSubmitted) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-lg`}>
        <p className="text-yellow-500 text-lg font-semibold text-center">
          Sales data for {formatYearMonth(yearMonth)} not submitted.
        </p>
      </div>
    );
  }

  if (isPmeApprovalPending) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-lg`}>
        <p className="text-yellow-500 text-lg font-semibold text-center">
          Approval pending from PME for {formatYearMonth(yearMonth)}.
        </p>
      </div>
    );
  }

  if (isBorrowerSubmitted) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-lg`}>
        <p className="text-green-500 text-lg font-semibold text-center">
          Sales data for {formatYearMonth(yearMonth)} submitted successfully
        </p>
        <p className="text-yellow-500 text-sm text-center mt-2">
          (Approval from PME and Arbour pending)
        </p>
      </div>
    );
  }

  if (!canViewData) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-lg`}>
        <p className="text-yellow-500 text-lg font-semibold text-center">
          You lack permission to view or edit data at this stage.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-lg`}>
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            notification={notification}
            onDismiss={dismissNotification}
            style={{ transform: `translateY(${index * 100}px)` }}
          />
        ))}
      </div>

      {(userRole === "PME" || userRole === "Arbour") && (
        <div className="text-center text-blue-500 text-lg font-semibold mb-4 bg-blue-100 p-3 rounded-lg">
          Only changed rows are shown.
        </div>
      )}

      {workflowStatus === "R" && userRole === "Borrower" && rejectionReason && (
        <div className="text-center text-red-500 text-lg font-semibold mb-4 bg-red-100 p-3 rounded-lg">
          Submission rejected: {rejectionReason}
        </div>
      )}

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="building" className="text-sm font-medium">Asset:</label>
          <select
            id="building"
            value={Object.keys(buildingMap).find((key) => buildingMap[key] === selectedAssetNumber) || ""}
            onChange={(e) => setSelectedAssetNumber(buildingMap[e.target.value])}
            className={`p-2 rounded-md text-sm ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:ring-2 focus:ring-blue-500 transition-colors`}
          >
            <option value="">Select a building</option>
            {buildings.map((building, index) => (
              <option key={index} value={building}>{building}</option>
            ))}
          </select>
        </div>
        {selectedAssetNumber && (
          <>
            <div className="flex items-center gap-2">
              <label htmlFor="search" className="text-sm font-medium">Search:</label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`p-2 rounded-md text-sm ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                placeholder="Number/Config/Name"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="soldFlag"
                checked={soldFlag}
                onChange={(e) => setSoldFlag(e.target.checked)}
                className="rounded text-blue-500"
              />
              <label htmlFor="soldFlag" className="text-sm font-medium">Sold Only</label>
            </div>
          </>
        )}
      </div>

      {filteredData.map((row, rowIndex) => {
        const salesTotal = calculateTotal(row, "Sales");
        const demandTotal = calculateTotal(row, "Demand");
        const receivedTotal = calculateTotal(row, "Received");
        const isDisabled =
          (userRole === "Borrower" && workflowStatus !== null && workflowStatus !== "R") ||
          ["Arbour", "PME", "Trustee"].includes(userRole || "");
        return (
          <div
            key={rowIndex}
            className={`mb-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} shadow-md transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-center mb-3">
              <label className="w-20 text-sm font-semibold">Sold?</label>
              <input
                type="checkbox"
                checked={row.SoldFlag?.trim().toUpperCase() === "Y"}
                onChange={() => handleChange(rowIndex, "SoldFlag", row.SoldFlag === "Y" ? "N" : "Y")}
                className="rounded text-blue-500"
                disabled={isDisabled}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
              {["UnitNumber", "UnitConfiguration", "UnitType", "CarpetAreaRR", "SaleableArea", "Floor"].map((colName) => (
                <div key={colName} className="flex flex-col">
                  <label className="text-xs font-semibold">{columnNames[colName]}:</label>
                  <span className={`text-sm p-1 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                    {colName === "UnitType" ? getUnitTypeLabel(row[colName]) : row[colName] || ""}
                  </span>
                </div>
              ))}
            </div>

            {row.SoldFlag?.trim().toUpperCase() === "Y" && (
              <>
                {["Sales", "Demand", "Received"].map((type) => (
                  <div key={type} className="mb-3">
                    <button
                      onClick={() => toggleSection(rowIndex, type)}
                      className="w-full flex justify-between items-center text-sm font-semibold py-2 px-3 rounded-md bg-[#8089A5] text-white hover:bg-[#00134B] transition-colors"
                    >
                      {type} Details - Base Price: {formatAmount(row[`${type}BasePrice`])}, Other Charges: {formatAmount(row[`${type}OtherCharges`])}
                      <span>{expandedSections[rowIndex]?.[type] ? "▲" : "▼"}</span>
                    </button>
                    {expandedSections[rowIndex]?.[type] && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
                        {[
                          `${type}BasePrice`,
                          `${type}${type === "Demand" ? "StampDuty" : "StampDutyAmount"}`,
                          `${type}RegistrationAmount`,
                          `${type}OtherCharges`,
                          `${type}PassThroughCharges`,
                          `${type}TaxesAmount`,
                        ].map((colName) => (
                          <div key={colName} className="flex flex-col relative group">
                            <label className="text-xs font-semibold flex items-center gap-1">
                              {columnNames[colName]}
                              {["SalesBasePrice", "SalesStampDutyAmount", "SalesRegistrationAmount"].includes(colName) && (
                                <span className="text-red-500">*</span>
                              )}
                              {["SalesBasePrice", "SalesStampDutyAmount", "SalesRegistrationAmount"].includes(colName) && (
                                <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                              )}
                            </label>
                            <input
                              type="text"
                              value={formatAmount(row[colName])}
                              onChange={(e) => handleChange(rowIndex, colName, e.target.value.replace(/,/g, ''))}
                              required={["SalesBasePrice", "SalesStampDutyAmount", "SalesRegistrationAmount"].includes(colName)}
                              className={`p-2 text-sm rounded-md ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${inputErrors[`${rowIndex}-${colName}`] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                              disabled={isDisabled}
                            />
                            {inputErrors[`${rowIndex}-${colName}`] && (
                              <span className="text-red-500 text-xs mt-1">{inputErrors[`${rowIndex}-${colName}`]}</span>
                            )}
                          </div>
                        ))}
                        <div className="flex items-center">
                          <span className="text-sm font-semibold">Total: {formatAmount(calculateTotal(row, type).toFixed(2))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="mb-3">
                  <button
                    onClick={() => toggleSection(rowIndex, "Dates")}
                    className="w-full flex justify-between items-center text-sm font-semibold py-2 px-3 rounded-md bg-[#8089A5] text-white hover:bg-[#00134B] transition-colors"
                  >
                    Booking, Agreement, Registration Details
                    <span>{expandedSections[rowIndex]?.Dates ? "▲" : "▼"}</span>
                  </button>
                  {expandedSections[rowIndex]?.Dates && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold">{columnNames["BookingDate"]}:</label>
                        <input
                          type="date"
                          value={row.BookingDate ? new Date(row.BookingDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleChange(rowIndex, "BookingDate", e.target.value)}
                          className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                          disabled={isDisabled}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold">Registered?</label>
                        <input
                          type="checkbox"
                          checked={row.RegisteredFlag?.trim().toUpperCase() === "Y"}
                          onChange={() => handleChange(rowIndex, "RegisteredFlag", row.RegisteredFlag === "Y" ? "N" : "Y")}
                          className="rounded text-blue-500"
                          disabled={isDisabled}
                        />
                      </div>
                      {row.RegisteredFlag?.trim().toUpperCase() === "Y" && (
                        <>
                          <div className="flex flex-col relative group">
                            <label className="text-xs font-semibold flex items-center gap-1">
                              {columnNames["RegistrationDate"]} <span className="text-red-500">*</span>
                              <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                            </label>
                            <input
                              type="date"
                              value={row.RegistrationDate ? new Date(row.RegistrationDate).toISOString().split("T")[0] : ""}
                              onChange={(e) => handleChange(rowIndex, "RegistrationDate", e.target.value)}
                              required
                              className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${inputErrors[`${rowIndex}-RegistrationDate`] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                              disabled={isDisabled}
                            />
                            {inputErrors[`${rowIndex}-RegistrationDate`] && (
                              <span className="text-red-500 text-xs mt-1">{inputErrors[`${rowIndex}-RegistrationDate`]}</span>
                            )}
                          </div>
                          <div className="flex flex-col relative group">
                            <label className="text-xs font-semibold flex items-center gap-1">
                              {columnNames["AgreementDate"]} <span className="text-red-500">*</span>
                              <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                            </label>
                            <input
                              type="date"
                              value={row.AgreementDate ? new Date(row.AgreementDate).toISOString().split("T")[0] : ""}
                              onChange={(e) => handleChange(rowIndex, "AgreementDate", e.target.value)}
                              required
                              className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${inputErrors[`${rowIndex}-AgreementDate`] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                              disabled={isDisabled}
                            />
                            {inputErrors[`${rowIndex}-AgreementDate`] && (
                              <span className="text-red-500 text-xs mt-1">{inputErrors[`${rowIndex}-AgreementDate`]}</span>
                            )}
                          </div>
                        </>
                      )}
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold">{columnNames["AllotmentLetterDate"]}:</label>
                        <input
                          type="date"
                          value={row.AllotmentLetterDate ? new Date(row.AllotmentLetterDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleChange(rowIndex, "AllotmentLetterDate", e.target.value)}
                          className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <button
                    onClick={() => toggleSection(rowIndex, "Customer")}
                    className="w-full flex justify-between items-center text-sm font-semibold py-2 px-3 rounded-md bg-[#8089A5] text-white hover:bg-[#00134B] transition-colors"
                  >
                    Customer KYC
                    <span>{expandedSections[rowIndex]?.Customer ? "▲" : "▼"}</span>
                  </button>
                  {expandedSections[rowIndex]?.Customer && (
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex flex-col flex-1 relative group">
                          <label className="text-xs font-semibold flex items-center gap-1">
                            {columnNames["CustomerName"]} <span className="text-red-500">*</span>
                            <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                          </label>
                          <input
                            type="text"
                            value={row["CustomerName"] || ""}
                            onChange={(e) => handleChange(rowIndex, "CustomerName", e.target.value)}
                            required
                            className={`p-2 text-sm rounded-md ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                            disabled={isDisabled}
                          />
                        </div>
                        <div className="flex flex-col flex-1 relative group">
                          <label className="text-xs font-semibold flex items-center gap-1">
                            {columnNames["CustomerKycAddress"]} <span className="text-red-500">*</span>
                            <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                          </label>
                          <input
                            type="text"
                            value={row["CustomerKycAddress"] || ""}
                            onChange={(e) => handleChange(rowIndex, "CustomerKycAddress", e.target.value)}
                            required
                            className={`p-2 text-sm rounded-md ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                            disabled={isDisabled}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {["CustomerKycAadhar", "CustomerKycPan", "CustomerKycMobile", "CustomerKycEmail"].map((colName) => (
                          <div key={colName} className="flex flex-col relative group">
                            <label className="text-xs font-semibold flex items-center gap-1">
                              {columnNames[colName]} <span className="text-red-500">*</span>
                              <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                            </label>
                            <input
                              type={colName === "CustomerKycEmail" ? "email" : "text"}
                              value={row[colName] || ""}
                              onChange={(e) => handleChange(rowIndex, colName, e.target.value)}
                              required
                              className={`p-2 text-sm rounded-md ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                              disabled={isDisabled}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <button
                    onClick={() => toggleSection(rowIndex, "Source")}
                    className="w-full flex justify-between items-center text-sm font-semibold py-2 px-3 rounded-md bg-[#8089A5] text-white hover:bg-[#00134B] transition-colors"
                  >
                    Source of Customer & Finance
                    <span>{expandedSections[rowIndex]?.Source ? "▲" : "▼"}</span>
                  </button>
                  {expandedSections[rowIndex]?.Source && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold">{columnNames["SourceOfCustomer"]}:</label>
                        <select
                          value={row.SourceOfCustomer || ""}
                          onChange={(e) => handleChange(rowIndex, "SourceOfCustomer", e.target.value)}
                          className={`p-2 text-sm rounded-md w-44 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                          disabled={isDisabled}
                        >
                          <option value="">Select</option>
                          <option value="Direct">Direct</option>
                          <option value="Channel Partners (CP)">Channel Partners (CP)</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      {row.SourceOfCustomer === "Channel Partners (CP)" && (
                        <div className="flex flex-wrap gap-3">
                          {[
                            { key: "ChannelPartnerName", label: "Name" },
                            { key: "ChannelPartnerMobile", label: "Mobile" },
                            { key: "ChannelPartnerEmail", label: "Email" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex flex-col relative group">
                              <label className="text-xs font-semibold flex items-center gap-1">
                                {label} <span className="text-red-500">*</span>
                                <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                              </label>
                              <input
                                type={key === "ChannelPartnerEmail" ? "email" : "text"}
                                value={row[key] || ""}
                                onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                                required
                                className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${inputErrors[`${rowIndex}-${key}`] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                                disabled={isDisabled}
                              />
                              {inputErrors[`${rowIndex}-${key}`] && (
                                <span className="text-red-500 text-xs mt-1">{inputErrors[`${rowIndex}-${key}`]}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col relative group">
                        <label className="text-xs font-semibold">{columnNames["BrokerageAmount"]}:</label>
                        <input
                          type="text"
                          value={formatAmount(row.BrokerageAmount)}
                          onChange={(e) => handleChange(rowIndex, "BrokerageAmount", e.target.value.replace(/,/g, ''))}
                          className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${inputErrors[`${rowIndex}-BrokerageAmount`] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                          disabled={isDisabled}
                        />
                        {inputErrors[`${rowIndex}-BrokerageAmount`] && (
                          <span className="text-red-500 text-xs mt-1">{inputErrors[`${rowIndex}-BrokerageAmount`]}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold">{columnNames["ModeOfFinance"]}:</label>
                        <select
                          value={row.ModeOfFinance || ""}
                          onChange={(e) => handleChange(rowIndex, "ModeOfFinance", e.target.value)}
                          className={`p-2 text-sm rounded-md w-44 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                          disabled={isDisabled}
                        >
                          <option value="">Select</option>
                          <option value="Self">Self</option>
                          <option value="Loan">Loan</option>
                          <option value="Financial Institution">Financial Institution</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      {row.ModeOfFinance === "Financial Institution" && (
                        <div className="flex flex-col relative group">
                          <label className="text-xs font-semibold flex items-center gap-1">
                            {columnNames["FinancialInstitutionName"]} <span className="text-red-500">*</span>
                            <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                          </label>
                          <input
                            type="text"
                            value={row.FinancialInstitutionName || ""}
                            onChange={(e) => handleChange(rowIndex, "FinancialInstitutionName", e.target.value)}
                            required
                            className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${inputErrors[`${rowIndex}-FinancialInstitutionName`] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                            disabled={isDisabled}
                          />
                          {inputErrors[`${rowIndex}-FinancialInstitutionName`] && (
                            <span className="text-red-500 text-xs mt-1">{inputErrors[`${rowIndex}-FinancialInstitutionName`]}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <button
                    onClick={() => toggleSection(rowIndex, "Additional")}
                    className="w-full flex justify-between items-center text-sm font-semibold py-2 px-3 rounded-md bg-[#8089A5] text-white hover:bg-[#00134B] transition-colors"
                  >
                    NOC, CLP
                    <span>{expandedSections[rowIndex]?.Additional ? "▲" : "▼"}</span>
                  </button>
                  {expandedSections[rowIndex]?.Additional && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold">NOC Issued?</label>
                        <input
                          type="checkbox"
                          checked={row.NcIssuedFlag?.trim().toUpperCase() === "Y"}
                          onChange={() => handleChange(rowIndex, "NcIssuedFlag", row.NcIssuedFlag === "Y" ? "N" : "Y")}
                          className="rounded text-blue-500"
                          disabled={isDisabled}
                        />
                      </div>
                      {row.NcIssuedFlag?.trim().toUpperCase() === "Y" && (
                        <div className="flex flex-col relative group">
                          <label className="text-xs font-semibold flex items-center gap-1">
                            {columnNames["NcNumber"]} <span className="text-red-500">*</span>
                            <FaInfoCircle className="text-gray-400 text-xs cursor-help" title="Required field" />
                          </label>
                          <input
                            type="text"
                            value={row["NcNumber"] || ""}
                            onChange={(e) => handleChange(rowIndex, "NcNumber", e.target.value)}
                            required
                            className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border ${inputErrors[`${rowIndex}-NcNumber`] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 transition-colors`}
                            disabled={isDisabled}
                          />
                          {inputErrors[`${rowIndex}-NcNumber`] && (
                            <span className="text-red-500 text-xs mt-1">{inputErrors[`${rowIndex}-NcNumber`]}</span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold">{columnNames["PaymentPlanName"]}:</label>
                        <select
                          value={row.PaymentPlanName || ""}
                          onChange={(e) => handleChange(rowIndex, "PaymentPlanName", e.target.value)}
                          className={`p-2 text-sm rounded-md w-36 ${isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
                          disabled={isDisabled}
                        >
                          <option value="">Select</option>
                          {Array.from({ length: 9 }, (_, i) => (
                            <option key={i} value={`CLP${i + 1}`}>{`CLP${i + 1}`}</option>
                          ))}
                        </select>
                      </div>

                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}

      {showRejectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} max-w-md w-full`}>
            <h3 className="text-lg font-semibold mb-4">Reason for Rejection</h3>
            <textarea
              value={rejectInput}
              onChange={(e) => setRejectInput(e.target.value)}
              className={`w-full p-2 rounded-md text-sm ${isDarkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-900"} border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder="Provide the reason for rejection"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleRejectCancel}
                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {userRole === "Borrower" && selectedAssetNumber && (workflowStatus === null || workflowStatus === "R") && (
        <div className="flex justify-center gap-3 mt-4 p-4 border-t sticky bottom-0 bg-opacity-90 backdrop-blur-sm" style={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", zIndex: 10 }}>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#8089A5] hover:bg-blue-700'} transition-colors`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
          <button
            onClick={handleSubmitApproval}
            className="px-4 py-2 rounded-md bg-[#8089A5] text-white hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      )}

      {(userRole === "PME" && selectedAssetNumber && workflowStatus === "0") ||
       (userRole === "Arbour" && selectedAssetNumber && workflowStatus === "A" && !submissionSuccessful) ? (
        <div className="flex justify-center gap-3 mt-4 p-4 border-t sticky bottom-0 bg-opacity-90 backdrop-blur-sm" style={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", zIndex: 10 }}>
          <button
            onClick={handleApprove}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
      ) : null}
    </div>
  );
}
