import { useState, useEffect } from "react";
import { AssetSale, ApprovalWorkflow } from "../types";
import endpoints from "../endpoints";
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

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
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
      style={style}
    >
      {notification.type === 'success' ? (
        <IoCheckmarkCircle className="text-2xl" />
      ) : (
        <IoCloseCircle className="text-2xl" />
      )}
      <span className="flex-1">{notification.message}</span>
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
  const userRole = localStorage.getItem("role");

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
    console.log("Fetching buildings from:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((fetchedData) => {
        console.log("API Response (Buildings):", fetchedData);
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
          console.log("Saved buildingsData to localStorage:", buildingsData);
        } else {
          console.error("Unexpected API response format:", fetchedData);
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
    console.log("Checking workflow status from URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Workflow status fetch failed:", response.status, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Workflow status response:", result);
      setWorkflowStatus(result.status === "null" ? null : result.status);
      setRejectionReason(result.comment && result.comment !== "null" ? result.comment : "");
      // Reset submissionSuccessful if not fully approved
      if (result.status !== "A" || userRole !== "Arbour") {
        setSubmissionSuccessful(false);
      }
    } catch (error) {
      console.error("Error checking workflow status:", error, "URL:", url);
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

    // Determine if data should be fetched based on role and workflow status
    let shouldFetchData = false;
    if (userRole === "Borrower") {
      // Borrower can view data when status is null or rejected
      shouldFetchData = workflowStatus === null || workflowStatus === "R";
    } else if (userRole === "PME") {
      // PME can view data when Borrower has submitted (status = "0")
      shouldFetchData = workflowStatus === "0";
    } else if (userRole === "Arbour") {
      // Arbour can view data when PME has approved (status = "A")
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
    console.log("Fetching data from:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((fetchedData) => {
        console.log("API Response (Data):", fetchedData);
        if (Array.isArray(fetchedData.data)) {
          const mappedData = fetchedData.data.map((row: AssetSale) => ({
            ...row,
            SourceOfCustomer: mapToDisplayLabel("SourceOfCustomer", row.SourceOfCustomer),
            ModeOfFinance: mapToDisplayLabel("ModeOfFinance", row.ModeOfFinance),
          }));
          setData(mappedData);
        } else {
          console.error("Unexpected API response format:", fetchedData);
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching asset sales data:", error);
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

  const handleChange = (
    index: number,
    key: string,
    value: string | number | boolean
  ) => {
    // Allow editing only for Borrowers when status is null or "R"
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
      ].forEach((field) => {
        updatedData[index][field] = null;
      });
      updatedData[index]["RegisteredFlag"] = "N";
      updatedData[index]["NcIssuedFlag"] = "N";
    }

    if (key === "RegisteredFlag" && value === "N") {
      ["RegistrationDate"].forEach((field) => {
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
      const isEmpty = inputStr === "";

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
        console.error("Failed to update asset sales");
        addNotification("Some updates failed. Check console for details.", "error");
      } else {
        const result = await response.json();
        console.log("Update successful", result);
        addNotification("All updates successful", "success");
        setUpdatedRows([]);
      }
    } catch (error) {
      console.error("Error updating asset sales:", error);
      addNotification("Some updates failed. Check console for details.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitApproval = async () => {
    if (!projectNumber || !yearMonth) {
      console.error("Project number or year-month is missing.");
      addNotification("Submit failed. Check console for details.", "error");
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
        console.error("Failed to submit approval workflow");
        addNotification("Submit failed. Please try again.", "error");
      } else {
        const result = await response.json();
        console.log("Submit successful", result);
        addNotification("Submit successful!", "success");
        setSubmissionSuccessful(true);
        await checkWorkflowStatus();
      }
    } catch (error) {
      console.error("Error submitting approval workflow:", error);
      addNotification("Submit failed. Check console for details.", "error");
    }
  };

  const handleApprove = async () => {
    if (!projectNumber || !yearMonth) {
      console.error("Project number or year-month is missing.");
      addNotification("Approval failed. Check console for details.", "error");
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
        console.error("Failed to approve workflow");
        addNotification("Approval failed. Please try again.", "error");
      } else {
        const result = await response.json();
        console.log("Approval successful", result);
        addNotification("Approval successful!", "success");
        if (userRole === "Arbour") {
          // Update approval flag in header table
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
      console.error("Error approving workflow:", error);
      addNotification("Approval failed. Check console for details.", "error");
    }
  };

  const handleReject = async () => {
    if (!projectNumber || !yearMonth) {
      console.error("Project number or year-month is missing.");
      addNotification("Rejection failed. Check console for details.", "error");
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
        console.error("Failed to reject workflow");
        addNotification("Rejection failed. Please try again.", "error");
      } else {
        const result = await response.json();
        console.log("Rejection successful", result);
        addNotification("Rejection successful!", "success");
        await checkWorkflowStatus();
      }
    } catch (error) {
      console.error("Error rejecting workflow:", error);
      addNotification("Rejection failed. Check console for details.", "error");
    }
  };

  const handleRejectConfirm = async () => {
    if (!projectNumber || !yearMonth) {
      console.error("Project number or year-month is missing.");
      addNotification("Rejection failed. Check console for details.", "error");
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
        console.error("Failed to reject workflow");
        addNotification("Rejection failed. Please try again.", "error");
      } else {
        const result = await response.json();
        console.log("Rejection successful", result);
        addNotification("Rejection successful!", "success");
        setShowRejectPopup(false);
        setRejectInput("");
        await checkWorkflowStatus();
      }
    } catch (error) {
      console.error("Error rejecting workflow:", error);
      addNotification("Rejection failed. Check console for details.", "error");
    }
  };

  const handleRejectCancel = () => {
    setShowRejectPopup(false);
    setRejectInput("");
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

  // Check if data is fully approved (after Arbour's approval)
  const isFullyApproved = submissionSuccessful && userRole === "Arbour" && workflowStatus === "A";

  // Check if Borrower has not submitted data
  const isDataNotSubmitted = (userRole === "PME" || userRole === "Arbour") && workflowStatus === null;

  // Check if approval is pending from PME for Arbour
  const isPmeApprovalPending = userRole === "Arbour" && workflowStatus === "0";

  // Check if Borrower has submitted data
  const isBorrowerSubmitted = userRole === "Borrower" && workflowStatus === "0";

  if (isFullyApproved) {
    return (
      <div className={`p-6 rounded-lg relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <p className="text-green-600 text-xl font-bold mb-4">
          Sales data for the month of {formatYearMonth(yearMonth)} has been successfully approved.
        </p>
      </div>
    );
  }

  if (isDataNotSubmitted) {
    return (
      <div className={`p-6 rounded-lg relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <p className="text-yellow-600 text-xl font-bold mb-4">
          Sales data for the month of {formatYearMonth(yearMonth)} has not been submitted.
        </p>
      </div>
    );
  }

  if (isPmeApprovalPending) {
    return (
      <div className={`p-6 rounded-lg relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <p className="text-yellow-600 text-xl font-bold mb-4">
          Approval pending from PME for the month of {formatYearMonth(yearMonth)}.
        </p>
      </div>
    );
    }

  if (isBorrowerSubmitted) {
    return (
      <div className={`p-6 rounded-lg relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <p className="text-green-600 text-xl font-bold mb-2 text-center">
          Sales Data for the month of {formatYearMonth(yearMonth)} has been submitted successfully
        </p>
        <p className="text-yellow-600 font-bold text-lg mb-4 text-center">
          (Approval from PME and Arbour Pending)
        </p>
      </div>
    );
  }

  // Check if user has permission to view data
  const canViewData = (
    (userRole === "Borrower" && (workflowStatus === null || workflowStatus === "R")) ||
    (userRole === "PME" && workflowStatus === "0") ||
    (userRole === "Arbour" && workflowStatus === "A")
  );

  if (!canViewData) {
    return (
      <div className={`p-6 rounded-lg relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <p className="text-yellow-600 text-xl font-bold mb-4">
          You do not have permission to view or edit data at this stage.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-lg relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
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

      {workflowStatus === "R" && userRole === "Borrower" && rejectionReason && (
        <div className="text-center text-red-600 text-xl font-bold mb-4">
          Submission rejected. Reason: {rejectionReason}
        </div>
      )}

      <div className="mb-4 flex items-center">
        <div className="flex items-center mr-4">
          <label htmlFor="building" className="mr-2">
            Asset:
          </label>
          <select
            id="building"
            value={Object.keys(buildingMap).find(
              (key) => buildingMap[key] === selectedAssetNumber
            ) || ""}
            onChange={(e) => setSelectedAssetNumber(buildingMap[e.target.value])}
            className={`p-1 border rounded ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
            }`}
          >
            <option value="">Select a building</option>
            {buildings.map((building, index) => (
              <option key={index} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>

        {selectedAssetNumber && (
          <>
            <span className="mx-2">|</span>
            <div className="flex items-center mr-4">
              <label htmlFor="search" className="mr-2">
                Search:
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`p-1 border rounded ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
                }`}
                placeholder="Number/Config/Name"
              />
            </div>

            <span className="mx-2">|</span>
            <div className="flex items-center">
              <label htmlFor="soldFlag" className="mr-2">
                Filter by Sold/Unsold:
              </label>
              <input
                type="checkbox"
                id="soldFlag"
                checked={soldFlag}
                onChange={(e) => setSoldFlag(e.target.checked)}
                className="mr-2"
              />
            </div>
          </>
        )}
      </div>

      {filteredData.map((row, rowIndex) => {
        const salesTotal = calculateTotal(row, "Sales");
        const demandTotal = calculateTotal(row, "Demand");
        const receivedTotal = calculateTotal(row, "Received");
        // Determine if fields should be disabled
        const isDisabled =
          (userRole === "Borrower" && workflowStatus !== null && workflowStatus !== "R") ||
          ["Arbour", "PME", "Trustee"].includes(userRole || "");

        return (
          <div
            key={rowIndex}
            className={`mb-6 p-4 shadow-lg rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div className="mb-4 grid grid-cols-5 gap-4">
              <div className="flex items-center">
                <label className="w-20 font-bold">Sold?</label>
                <input
                  type="checkbox"
                  checked={row.SoldFlag?.trim().toUpperCase() === "Y"}
                  onChange={() =>
                    handleChange(
                      rowIndex,
                      "SoldFlag",
                      row.SoldFlag === "Y" ? "N" : "Y"
                    )
                  }
                  className="mr-2"
                  disabled={isDisabled}
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 mb-4">
              {[
                "UnitNumber",
                "UnitConfiguration",
                "UnitType",
                "CarpetAreaRR",
                "SaleableArea",
                "Floor",
              ].map((colName) => (
                <div key={colName} className="flex flex-col">
                  <label className="font-bold">{columnNames[colName]}:</label>
                  <span className="p-1 rounded">
                    {colName === "UnitType" ? getUnitTypeLabel(row[colName]) : row[colName] || ""}
                  </span>
                </div>
              ))}
            </div>

            {row.SoldFlag?.trim().toUpperCase() === "Y" && (
              <>
                <div className="mb-2">
                  <h4 className="font-bold mb-2">Sale Details:</h4>
                  <div className="grid grid-cols-7 gap-3">
                    {[
                      "SalesBasePrice",
                      "SalesStampDutyAmount",
                      "SalesRegistrationAmount",
                      "SalesOtherCharges",
                      "SalesPassThroughCharges",
                      "SalesTaxesAmount",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {columnNames[colName]}:
                          {[
                            "SalesBasePrice",
                            "SalesStampDutyAmount",
                            "SalesRegistrationAmount",
                          ].includes(colName) && (
                            <span className="text-red-700">*</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={formatAmount(row[colName])}
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              e.target.value.replace(/,/g, '')
                            )
                          }
                          required={[
                            "SalesBasePrice",
                            "SalesStampDutyAmount",
                            "SalesRegistrationAmount",
                          ].includes(colName)}
                          className="p-1 border rounded text-black"
                          disabled={isDisabled}
                        />
                        {inputErrors[`${rowIndex}-${colName}`] && (
                          <span className="text-red-500 text-xs">
                            {inputErrors[`${rowIndex}-${colName}`]}
                          </span>
                        )}
                      </div>
                    ))}
                    <span className="font-bold self-center">
                      Total: {formatAmount(salesTotal.toFixed(2))}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="font-bold mb-2">Demand Details:</h4>
                  <div className="grid grid-cols-7 gap-3">
                    {[
                      "DemandBasePrice",
                      "DemandStampDuty",
                      "DemandRegistrationAmount",
                      "DemandOtherCharges",
                      "DemandPassThroughCharges",
                      "DemandTaxesAmount",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {columnNames[colName]}:
                        </label>
                        <input
                          type="text"
                          value={formatAmount(row[colName])}
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              e.target.value.replace(/,/g, '')
                            )
                          }
                          className="p-1 border rounded text-black"
                          disabled={isDisabled}
                        />
                        {inputErrors[`${rowIndex}-${colName}`] && (
                          <span className="text-red-500 text-xs">
                            {inputErrors[`${rowIndex}-${colName}`]}
                          </span>
                        )}
                      </div>
                    ))}
                    <span className="font-bold self-center">
                      Total: {formatAmount(demandTotal.toFixed(2))}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="font-bold mb-2">Received Details:</h4>
                  <div className="grid grid-cols-7 gap-3">
                    {[
                      "ReceivedBasePrice",
                      "ReceivedStampDutyAmount",
                      "ReceivedRegistrationAmount",
                      "ReceivedOtherCharges",
                      "ReceivedPassThroughCharges",
                      "ReceivedTaxesAmount",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {columnNames[colName]}:
                        </label>
                        <input
                          type="text"
                          value={formatAmount(row[colName])}
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              e.target.value.replace(/,/g, '')
                            )
                          }
                          className="p-1 border rounded text-black"
                          disabled={isDisabled}
                        />
                        {inputErrors[`${rowIndex}-${colName}`] && (
                          <span className="text-red-500 text-xs">
                            {inputErrors[`${rowIndex}-${colName}`]}
                          </span>
                        )}
                      </div>
                    ))}
                    <span className="font-bold self-center">
                      Total: {formatAmount(receivedTotal.toFixed(2))}
                    </span>
                  </div>
                </div>

                <div className="mb-2 flex items-center space-x-4 flex-wrap">
                  <div className="flex items-center">
                    <label className="w-32 font-bold">Registered?</label>
                    <input
                      type="checkbox"
                      checked={row.RegisteredFlag?.trim().toUpperCase() === "Y"}
                      onChange={() =>
                        handleChange(
                          rowIndex,
                          "RegisteredFlag",
                          row.RegisteredFlag === "Y" ? "N" : "Y"
                        )
                      }
                      className="mr-2"
                      disabled={isDisabled}
                    />
                  </div>
                  {row.RegisteredFlag?.trim().toUpperCase() === "Y" && (
                    <div className="flex flex-col">
                      <label className="font-bold">
                        {columnNames["RegistrationDate"]}:
                        <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="date"
                        value={
                          row.RegistrationDate
                            ? new Date(row.RegistrationDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleChange(
                            rowIndex,
                            "RegistrationDate",
                            e.target.value
                          )
                        }
                        required
                        className="p-1 border rounded text-black w-40"
                        disabled={isDisabled}
                      />
                      {inputErrors[`${rowIndex}-RegistrationDate`] && (
                        <span className="text-red-500 text-xs">
                          {inputErrors[`${rowIndex}-RegistrationDate`]}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      "BookingDate",
                      "AllotmentLetterDate",
                      "AgreementDate",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {columnNames[colName]}:
                        </label>
                        <input
                          type="date"
                          value={
                            row[colName]
                              ? new Date(row[colName])
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleChange(rowIndex, colName, e.target.value)
                          }
                          className="p-1 border rounded text-black"
                          disabled={isDisabled}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="font-bold mb-2">Customer Details:</h4>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-2 flex flex-col">
                      <label className="font-bold">
                        {columnNames["CustomerName"]}:
                        <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        value={row["CustomerName"] || ""}
                        onChange={(e) =>
                          handleChange(rowIndex, "CustomerName", e.target.value)
                        }
                        required
                        className="p-1 border rounded text-black"
                        disabled={isDisabled}
                      />
                    </div>
                    <div className="col-span-3 flex flex-col">
                      <label className="font-bold">
                        {columnNames["CustomerKycAddress"]}:
                        <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        value={row["CustomerKycAddress"] || ""}
                        onChange={(e) =>
                          handleChange(
                            rowIndex,
                            "CustomerKycAddress",
                            e.target.value
                          )
                        }
                        required
                        className="p-1 border rounded text-black"
                        disabled={isDisabled}
                      />
                    </div>

                    {[
                      "CustomerKycAadhar",
                      "CustomerKycPan",
                      "CustomerKycMobile",
                      "CustomerKycEmail",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {columnNames[colName]}:
                          <span className="text-red-700">*</span>
                        </label>
                        <input
                          type={
                            colName === "CustomerKycEmail" ? "email" : "text"
                          }
                          value={row[colName] || ""}
                          onChange={(e) =>
                            handleChange(rowIndex, colName, e.target.value)
                          }
                          required
                          className="p-1 border rounded text-black"
                          disabled={isDisabled}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-2 flex items-center space-x-4 flex-wrap">
                  <div className="flex flex-col">
                    <label className="font-bold">
                      {columnNames["SourceOfCustomer"]}:
                    </label>
                    <select
                      value={row.SourceOfCustomer || ""}
                      onChange={(e) =>
                        handleChange(rowIndex, "SourceOfCustomer", e.target.value)
                      }
                      className="p-1 border rounded text-black w-48"
                      disabled={isDisabled}
                    >
                      <option value="">Select</option>
                      <option value="Direct">Direct</option>
                      <option value="Channel Partners (CP)">
                        Channel Partners (CP)
                      </option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  {row.SourceOfCustomer === "Channel Partners (CP)" && (
                    <div className="flex space-x-4">
                      {[
                        { key: "ChannelPartnerName", label: "Name" },
                        { key: "ChannelPartnerMobile", label: "Mobile" },
                        { key: "ChannelPartnerEmail", label: "Email" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex flex-col">
                          <label className="font-bold">
                            {label}:<span className="text-red-700">*</span>
                          </label>
                          <input
                            type={key === "ChannelPartnerEmail" ? "email" : "text"}
                            value={row[key] || ""}
                            onChange={(e) =>
                              handleChange(rowIndex, key, e.target.value)
                            }
                            required
                            className="p-1 border rounded text-black w-40"
                            disabled={isDisabled}
                          />
                          {inputErrors[`${rowIndex}-${key}`] && (
                            <span className="text-red-500 text-xs">
                              {inputErrors[`${rowIndex}-${key}`]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-2 flex items-center space-x-4 flex-wrap">
                  <div className="flex flex-col">
                    <label className="font-bold">
                      {columnNames["ModeOfFinance"]}:
                    </label>
                    <select
                      value={row.ModeOfFinance || ""}
                      onChange={(e) =>
                        handleChange(rowIndex, "ModeOfFinance", e.target.value)
                      }
                      className="p-1 border rounded text-black w-48"
                      disabled={isDisabled}
                    >
                      <option value="">Select</option>
                      <option value="Self">Self</option>
                      <option value="Loan">Loan</option>
                      <option value="Financial Institution">
                        Financial Institution
                      </option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  {row.ModeOfFinance === "Financial Institution" && (
                    <div className="flex flex-col">
                      <label className="font-bold">
                        {columnNames["FinancialInstitutionName"]}:
                        <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        value={row.FinancialInstitutionName || ""}
                        onChange={(e) =>
                          handleChange(
                            rowIndex,
                            "FinancialInstitutionName",
                            e.target.value
                          )
                        }
                        required
                        className="p-1 border rounded text-black w-40"
                        disabled={isDisabled}
                      />
                      {inputErrors[`${rowIndex}-FinancialInstitutionName`] && (
                        <span className="text-red-500 text-xs">
                          {inputErrors[`${rowIndex}-FinancialInstitutionName`]}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-2 flex items-center space-x-4 flex-wrap">
                  <div className="flex items-center">
                    <label className="w-32 font-bold">NOC Issued?</label>
                    <input
                      type="checkbox"
                      checked={row.NcIssuedFlag?.trim().toUpperCase() === "Y"}
                      onChange={() =>
                        handleChange(
                          rowIndex,
                          "NcIssuedFlag",
                          row.NcIssuedFlag === "Y" ? "N" : "Y"
                        )
                      }
                      className="mr-2"
                      disabled={isDisabled}
                    />
                  </div>
                  {row.NcIssuedFlag?.trim().toUpperCase() === "Y" && (
                    <div className="flex flex-col">
                      <label className="font-bold">
                        {columnNames["NcNumber"]}:
                        <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        value={row["NcNumber"] || ""}
                        onChange={(e) =>
                          handleChange(rowIndex, "NcNumber", e.target.value)
                        }
                        required
                        className="p-1 border rounded text-black w-40"
                        disabled={isDisabled}
                      />
                      {inputErrors[`${rowIndex}-NcNumber`] && (
                        <span className="text-red-500 text-xs">
                          {inputErrors[`${rowIndex}-NcNumber`]}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label className="font-bold">
                      {columnNames["PaymentPlanName"]}:
                    </label>
                    <select
                      value={row.PaymentPlanName || ""}
                      onChange={(e) =>
                        handleChange(rowIndex, "PaymentPlanName", e.target.value)
                      }
                      className="p-1 border rounded text-black w-48"
                      disabled={isDisabled}
                    >
                      <option value="">Select</option>
                      {Array.from({ length: 9 }, (_, i) => (
                        <option key={i} value={`CLP${i + 1}`}>
                          {`CLP${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold">
                      {columnNames["BrokerageAmount"]}:
                    </label>
                    <input
                      type="text"
                      value={formatAmount(row.BrokerageAmount)}
                      onChange={(e) =>
                        handleChange(
                          rowIndex,
                          "BrokerageAmount",
                          e.target.value.replace(/,/g, '')
                        )
                      }
                      className={`p-1 border rounded text-black w-40 ${
                        row.BrokerageAmount === "" ? "border-red-500" : ""
                      }`}
                      disabled={isDisabled}
                    />
                    {inputErrors[`${rowIndex}-BrokerageAmount`] && (
                      <span className="text-red-500 text-xs">
                        {inputErrors[`${rowIndex}-BrokerageAmount`]}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {showRejectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h3 className="text-lg font-bold mb-4">Enter Reason for Rejection</h3>
            <textarea
              value={rejectInput}
              onChange={(e) => setRejectInput(e.target.value)}
              className={`w-full p-2 border rounded mb-4 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
              placeholder="Please provide the reason for rejection"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleRejectCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {userRole === "Borrower" && selectedAssetNumber && (workflowStatus === null || workflowStatus === "R") && (
        <div
          className="flex justify-center items-center mt-4 p-4 border-t sticky bottom-0 left-0 right-0 h-12"
          style={{
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            zIndex: 10,
          }}
        >
          <button
            onClick={handleSubmit}
            className={`py-1 px-5 rounded text-white flex items-center justify-center ${
              isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 font-bold'
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
          <button
            onClick={handleSubmitApproval}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded ml-4"
          >
            Submit
          </button>
        </div>
      )}

      {(userRole === "PME" && selectedAssetNumber && workflowStatus === "0") ||
       (userRole === "Arbour" && selectedAssetNumber && workflowStatus === "A" && !submissionSuccessful) ? (
        <div
          className="flex justify-between items-center mt-4 p-4 bg-white border-t sticky bottom-0 left-0 right-0"
          style={{
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            zIndex: 10,
          }}
        >
          <button
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Reject
          </button>
        </div>
      ) : null}
    </div>
  );
}