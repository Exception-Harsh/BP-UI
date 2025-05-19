import React, { useState, useEffect } from "react";
import {
  NewDisbursementRequest,
  MaxFdsbNumberResponse,
  ProjectAssetBankAccount,
  DpBankAccount,
} from "../types";
import axios from "axios";
import endpoints from "../endpoints";
import { FaFilePdf, FaFileExcel, FaFile } from "react-icons/fa";
import { IoClose, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

interface Building {
  asm_bldng_v: string;
  asm_asst_nmbr_n: string;
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "error";
}

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  style?: React.CSSProperties;
}

const Notification: React.FC<NotificationProps> = ({
  notification,
  onDismiss,
}) => {
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
      className={`fixed top-4 right-4 w-80 p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 ${notification.type === "success"
        ? "bg-green-500 text-white"
        : "bg-red-500 text-white"
        }`}
    >
      {notification.type === "success" ? (
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

const NewAssetDisbursement: React.FC = () => {
  const [requests, setRequests] = useState<NewDisbursementRequest[]>(
    Array.from({ length: 10 }, () => ({
      ProjectNumber: "",
      AssetNumber: "",
      Category: "",
      SubCategory: "",
      PartyName: "",
      PartyGSTIN: "",
      PartyPAN: "",
      PartyEmail: "",
      PartyMobile: "",
      Reason: "",
      PurchaseOrder: "",
      TotalOrderAmount: "",
      DocumentType: "",
      PartyDocumentNumber: "",
      PartyDocumentDate: "",
      PartyDocumentPayableDays: "",
      PartyDocumentAmount: "",
      PartyDocumentGSTAmount: "",
      PartyDocumentTotalAmount: "",
      PartyTDSAmount: "",
      PartyAdvanceAdjusted: "",
      PartyRetentionAmount: "",
      PartyOtherDeductionAmount: "",
      PartyPayableAmount: "",
      PartyOutstandingAmount: "",
      BorrowerAccountNumber: "",
      PartyBankName: "",
      PartyAccountName: "",
      PartyAccountNumber: "",
      PartyAccountIFSC: "",
      Status: "0",
      ApprovedAmount: "0",
      ReferenceDRNumber: "",
      Remarks: "",
      AttachmentReference: "",
      CreatedBy: "",
      LastModifiedBy: "",
      Attachments: [],
    }))
  );

  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<{
    [key: string]: string[];
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }[]>(
    Array(10).fill({})
  );
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean[]>(Array(10).fill(false));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [submittedRows, setSubmittedRows] = useState<boolean[]>(
    Array(10).fill(false)
  );
  const [maxFdsbNumber, setMaxFdsbNumber] = useState<number>(0);
  const [accountNumbers, setAccountNumbers] = useState<
    ProjectAssetBankAccount[][]
  >(Array(10).fill([]));
  const [dpAccountNumbers, setDpAccountNumbers] = useState<DpBankAccount[][]>(
    Array(10).fill([])
  );

  useEffect(() => {
    const buildingsData = localStorage.getItem("buildingsData");
    if (buildingsData) {
      const parsedData = JSON.parse(buildingsData);
      const buildingsArray = Array.isArray(parsedData)
        ? parsedData
        : [parsedData];
      setBuildings(buildingsArray);
      // Auto-select if only one building
      if (buildingsArray.length === 1) {
        setRequests((prev) =>
          prev.map((req) => ({
            ...req,
            AssetNumber: buildingsArray[0].asm_asst_nmbr_n,
          }))
        );
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${endpoints.category}`);
        const fetchedCategories = response.data;
        setCategories(fetchedCategories);
        // Auto-select if only one category
        if (fetchedCategories.length === 1) {
          setRequests((prev) =>
            prev.map((req) => ({ ...req, Category: fetchedCategories[0] }))
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchInitialMaxFdsbNumber = async () => {
      const max = await fetchMaxFdsbNumber();
      setMaxFdsbNumber(max);
    };

    fetchCategories();
    fetchInitialMaxFdsbNumber();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const subCategoryPromises = categories.map(async (category) => {
          const response = await axios.get(
            `${endpoints.subcategory}?category=${category}`
          );
          return { category, subCategories: response.data };
        });

        const subCategoryResults = await Promise.all(subCategoryPromises);
        const subCategoryMap = subCategoryResults.reduce(
          (acc, { category, subCategories }) => {
            acc[category] = subCategories;
            return acc;
          },
          {} as { [key: string]: string[] }
        );

        setSubCategories(subCategoryMap);
        // Auto-select if only one subcategory for each category
        setRequests((prev) =>
          prev.map((req) => {
            if (req.Category && subCategoryMap[req.Category]?.length === 1) {
              return { ...req, SubCategory: subCategoryMap[req.Category][0] };
            }
            return req;
          })
        );
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    if (categories.length > 0) {
      fetchSubCategories();
    }
  }, [categories]);

  useEffect(() => {
    const rememberedCredentials = localStorage.getItem("rememberedCredentials");
    if (rememberedCredentials) {
      const { username } = JSON.parse(rememberedCredentials);
      setRequests((prevRequests) =>
        prevRequests.map((request) => ({
          ...request,
          CreatedBy: username,
          LastModifiedBy: username,
        }))
      );
    }
  }, []);

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substring(2);
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchBorrowerAccountNumber = async (
    projectNumber: string,
    assetNumber: string,
    index: number
  ) => {
    try {
      console.log(
        `Fetching borrower accounts for project: ${projectNumber}, asset: ${assetNumber}, index: ${index}`
      );
      const response = await axios.get(
        `${endpoints.accntnum}/${projectNumber}/${assetNumber}`
      );
      const accounts: ProjectAssetBankAccount[] = response.data;
      console.log("Borrower accounts response:", accounts);
      if (accounts && accounts.length > 0) {
        // Filter accounts to find the one with type "T" (Project Cost)
        const projectCostAccount = accounts.find(account => account.AccountType === 'T');

        setAccountNumbers((prev) => {
          const newAccountNumbers = [...prev];
          newAccountNumbers[index] = accounts;
          return newAccountNumbers;
        });
        setDpAccountNumbers((prev) => {
          const newDpAccountNumbers = [...prev];
          newDpAccountNumbers[index] = [];
          return newDpAccountNumbers;
        });

        // Set the borrower account number to the Project Cost account if found, otherwise use the first account
        setRequests((prevRequests) => {
          const newRequests = [...prevRequests];
          newRequests[index].BorrowerAccountNumber = projectCostAccount
            ? projectCostAccount.AccountNumber
            : accounts[0].AccountNumber;
          return newRequests;
        });
      } else {
        console.log("No borrower accounts found");
        addNotification(
          "No borrower account numbers found for the selected asset",
          "error"
        );
        setAccountNumbers((prev) => {
          const newAccountNumbers = [...prev];
          newAccountNumbers[index] = [];
          return newAccountNumbers;
        });
        setRequests((prevRequests) => {
          const newRequests = [...prevRequests];
          newRequests[index].BorrowerAccountNumber = "";
          return newRequests;
        });
      }
    } catch (error) {
      console.error("Error fetching borrower account numbers:", error);
      addNotification("Failed to fetch borrower account numbers", "error");
      setAccountNumbers((prev) => {
        const newAccountNumbers = [...prev];
        newAccountNumbers[index] = [];
        return newAccountNumbers;
      });
      setRequests((prevRequests) => {
        const newRequests = [...prevRequests];
        newRequests[index].BorrowerAccountNumber = "";
        return newRequests;
      });
    }
  };

  const fetchDpBankAccount = async (projectNumber: string, index: number) => {
    try {
      console.log(
        `Fetching DP accounts for project: ${projectNumber}, index: ${index}`
      );
      const response = await axios.get<DpBankAccount[]>(
        `${endpoints.dpaccntnum}/${projectNumber}`
      );
      const accounts = response.data;
      console.log("DP accounts response:", accounts);
      if (accounts && accounts.length > 0) {
        setDpAccountNumbers((prev) => {
          const newDpAccountNumbers = [...prev];
          newDpAccountNumbers[index] = accounts;
          return newDpAccountNumbers;
        });
        setAccountNumbers((prev) => {
          const newAccountNumbers = [...prev];
          newAccountNumbers[index] = [];
          return newAccountNumbers;
        });
        setRequests((prevRequests) => {
          const newRequests = [...prevRequests];
          newRequests[index].BorrowerAccountNumber = accounts.length === 1 ? accounts[0].AccountNumber : "";
          return newRequests;
        });
      } else {
        console.log("No DP accounts found");
        addNotification(
          "No DP bank accounts found for the selected project",
          "error"
        );
        setDpAccountNumbers((prev) => {
          const newDpAccountNumbers = [...prev];
          newDpAccountNumbers[index] = [];
          return newDpAccountNumbers;
        });
        setRequests((prevRequests) => {
          const newRequests = [...prevRequests];
          newRequests[index].BorrowerAccountNumber = "";
          return newRequests;
        });
      }
    } catch (error) {
      console.error("Error fetching DP bank accounts:", error);
      addNotification("Failed to fetch DP bank accounts", "error");
      setDpAccountNumbers((prev) => {
        const newDpAccountNumbers = [...prev];
        newDpAccountNumbers[index] = [];
        return newDpAccountNumbers;
      });
      setRequests((prevRequests) => {
        const newRequests = [...prevRequests];
        newRequests[index].BorrowerAccountNumber = "";
        return newRequests;
      });
    }
  };

  const calculatePayableAmount = (request: NewDisbursementRequest) => {
    const totalAmount =
      request.PartyDocumentTotalAmount === "" ||
        isNaN(Number(request.PartyDocumentTotalAmount))
        ? 0
        : Number(request.PartyDocumentTotalAmount);
    const tdsAmount =
      request.PartyTDSAmount === "" || isNaN(Number(request.PartyTDSAmount))
        ? 0
        : Number(request.PartyTDSAmount);
    const advanceAdjusted =
      request.PartyAdvanceAdjusted === "" ||
        isNaN(Number(request.PartyAdvanceAdjusted))
        ? 0
        : Number(request.PartyAdvanceAdjusted);
    const retentionAmount =
      request.PartyRetentionAmount === "" ||
        isNaN(Number(request.PartyRetentionAmount))
        ? 0
        : Number(request.PartyRetentionAmount);
    const otherDeductionAmount =
      request.PartyOtherDeductionAmount === "" ||
        isNaN(Number(request.PartyOtherDeductionAmount))
        ? 0
        : Number(request.PartyOtherDeductionAmount);

    return (
      totalAmount -
      tdsAmount -
      advanceAdjusted -
      retentionAmount -
      otherDeductionAmount
    );
  };

  const handleInputChange = (
    index: number,
    field: keyof NewDisbursementRequest,
    value: string | number | Date | { file: File; name: string; type: string }[]
  ) => {
    const newRequests = [...requests];
    const newErrors = [...errors];

    if (
      field === "ProjectNumber" ||
      field === "PartyDocumentPayableDays" ||
      field === "PartyDocumentAmount" ||
      field === "PartyDocumentGSTAmount" ||
      field === "PartyTDSAmount" ||
      field === "PartyAdvanceAdjusted" ||
      field === "PartyRetentionAmount" ||
      field === "PartyOtherDeductionAmount" ||
      field === "PartyOutstandingAmount" ||
      field === "ApprovedAmount" ||
      field === "ReferenceDRNumber"
    ) {
      newRequests[index][field] = value === "" ? "" : (Number(value) as never);
    } else if (field === "PartyDocumentDate" || field === "Attachments") {
      newRequests[index][field] = value as never;
    } else {
      newRequests[index][field] = value as never;
    }

    // Validate GSTIN and extract PAN if valid
    if (field === "PartyGSTIN" && typeof value === "string") {
      const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
      const gstin = value.trim();

      if (gstin.length === 0) {
        delete newErrors[index].PartyGSTIN;
      } else if (!gstinRegex.test(gstin)) {
        newErrors[index] = { ...newErrors[index], PartyGSTIN: "Invalid GSTIN format. It should match the pattern: \\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}" };
      } else {
        delete newErrors[index].PartyGSTIN;
        // Extract the first 10 characters from the GSTIN
        const pan = gstin.substring(2, 12);
        newRequests[index].PartyPAN = pan;
      }
    }

    const docAmount = newRequests[index].PartyDocumentAmount;
    const gstAmount = newRequests[index].PartyDocumentGSTAmount;
    newRequests[index].PartyDocumentTotalAmount =
      (docAmount === "" ? 0 : Number(docAmount)) +
      (gstAmount === "" ? 0 : Number(gstAmount));

    newRequests[index].PartyPayableAmount = calculatePayableAmount(
      newRequests[index]
    ).toString();

    // Set PartyOutstandingAmount to PartyPayableAmount by default
    if (field !== "PartyOutstandingAmount") {
      newRequests[index].PartyOutstandingAmount = newRequests[index].PartyPayableAmount;
    }

    const projectNumber = localStorage.getItem("projectNumber");
    if (!projectNumber) {
      addNotification("Project number not found in localStorage", "error");
      console.log("Project number missing in localStorage");
      return;
    }

    const shouldFetchDpAccount =
      (newRequests[index].Category === "Finance" &&
        [
          "Debenture Interest",
          "AMC",
          "Redemption premium",
          "Distribution fees",
        ].includes(newRequests[index].SubCategory)) ||
      (newRequests[index].Category === "Architect and Consultant" &&
        ["Distribution fees", "AMC"].includes(newRequests[index].SubCategory));

    console.log(
      `handleInputChange: index=${index}, field=${field}, value=${value}, shouldFetchDpAccount=${shouldFetchDpAccount}`
    );

    if (field === "AssetNumber" && !shouldFetchDpAccount) {
      if (value === "") {
        console.log("Clearing account numbers for empty AssetNumber");
        setAccountNumbers((prev) => {
          const newAccountNumbers = [...prev];
          newAccountNumbers[index] = [];
          return newAccountNumbers;
        });
        setDpAccountNumbers((prev) => {
          const newDpAccountNumbers = [...prev];
          newDpAccountNumbers[index] = [];
          return newDpAccountNumbers;
        });
        newRequests[index].BorrowerAccountNumber = "";
      } else {
        console.log(
          `Triggering fetchBorrowerAccountNumber for AssetNumber: ${value}`
        );
        fetchBorrowerAccountNumber(projectNumber, value as string, index);
      }
    }

    if (field === "SubCategory" && value !== "") {
      console.log(
        `SubCategory changed to: ${value}, checking if DP account fetch is needed`
      );
      if (shouldFetchDpAccount) {
        console.log("Triggering fetchDpBankAccount");
        fetchDpBankAccount(projectNumber, index);
      } else {
        console.log(
          "Clearing DP accounts as SubCategory does not require DP account"
        );
        setDpAccountNumbers((prev) => {
          const newDpAccountNumbers = [...prev];
          newDpAccountNumbers[index] = [];
          return newDpAccountNumbers;
        });
        if (newRequests[index].AssetNumber) {
          console.log(
            "Re-fetching borrower accounts due to SubCategory change"
          );
          fetchBorrowerAccountNumber(
            projectNumber,
            newRequests[index].AssetNumber,
            index
          );
        }
      }
    }

    if (field === "Category" && value === "") {
      console.log(
        "Clearing SubCategory and account numbers due to empty Category"
      );
      newRequests[index].SubCategory = "";
      newRequests[index].BorrowerAccountNumber = "";
      setAccountNumbers((prev) => {
        const newAccountNumbers = [...prev];
        newAccountNumbers[index] = [];
        return newAccountNumbers;
      });
      setDpAccountNumbers((prev) => {
        const newDpAccountNumbers = [...prev];
        newDpAccountNumbers[index] = [];
        return newDpAccountNumbers;
      });
    }

    setRequests(newRequests);
    setErrors(newErrors);
    validateAmounts(index);
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files).map((file) => ({
        file,
        name: file.name,
        type: file.type,
      }));
      handleInputChange(index, "Attachments", [
        ...requests[index].Attachments,
        ...filesArray,
      ]);
    }
  };

  const handleRemoveFile = (rowIndex: number, fileIndex: number) => {
    const newRequests = [...requests];
    newRequests[rowIndex].Attachments = newRequests[
      rowIndex
    ].Attachments.filter((_, i) => i !== fileIndex);
    setRequests(newRequests);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "application/pdf") {
      return <FaFilePdf className="text-red-600 text-4xl" />;
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "application/vnd.ms-excel"
    ) {
      return <FaFileExcel className="text-green-600 text-4xl" />;
    } else {
      return <FaFile className="text-gray-600 text-4xl" />;
    }
  };

  const fetchMaxFdsbNumber = async (): Promise<number> => {
    try {
      const response = await axios.get<MaxFdsbNumberResponse>(
        endpoints.maxfdsbnumber,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("fetchMaxFdsbNumber status:", response.status);
      console.log(
        "fetchMaxFdsbNumber content-type:",
        response.headers["content-type"]
      );

      const contentType = response.headers["content-type"]?.toLowerCase();
      if (!contentType?.includes("application/json")) {
        console.error("Received non-JSON response:", response.data);
        addNotification(
          "Invalid response format from max FDSB number API",
          "error"
        );
        return 0;
      }

      const maxFdsbNumber = Number(response.data?.maxFdsbNumber);
      if (isNaN(maxFdsbNumber)) {
        console.error(
          "Invalid maxFdsbNumber received:",
          response.data?.maxFdsbNumber
        );
        addNotification(
          "Invalid max FDSB number received from server",
          "error"
        );
        return 0;
      }

      console.log("fetchMaxFdsbNumber success:", maxFdsbNumber);
      return maxFdsbNumber;
    } catch (error) {
      console.error("Error fetching max FDSB_NMBR_N:", error);
      addNotification(
        "Failed to fetch max FDSB number. Please check the API endpoint configuration.",
        "error"
      );
      return 0;
    }
  };

  const handleSubmit = async (index: number) => {
  if (!validateAmounts(index, true)) {
    return;
  }

  // Check if GSTN is valid
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
  const gstin = (requests[index].PartyGSTIN || "").trim();

  if (gstin.length > 0 && !gstinRegex.test(gstin)) {
    addNotification("Invalid GSTN entered", "error");
    return;
  }

  try {
    setLoading((prev) => {
      const newLoading = [...prev];
      newLoading[index] = true;
      return newLoading;
    });

    const projectNumber = localStorage.getItem("projectNumber");
    if (!projectNumber) {
      addNotification("Project number not found in localStorage", "error");
      return;
    }

    const attachments = requests[index].Attachments;
    let attachmentReference = "";

    if (attachments.length > 0) {
      const fileCount = attachments.length;
      const referenceNumbers = Array.from(
        { length: fileCount },
        (_, i) => maxFdsbNumber + i + 1
      );
      console.log("referenceNumbers:", referenceNumbers);
      attachmentReference = referenceNumbers.join(",");
      console.log("attachmentReference:", attachmentReference);

      const formData = new FormData();
      attachments.forEach(({ file }, i) => {
        formData.append(`files[${i}]`, file);
      });
      await axios.post(endpoints.fileupload, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    const requestData = {
      ...requests[index],
      AttachmentReference: attachmentReference,
      Attachments: undefined,
      Status: "0",
      ApprovedAmount: "0",
      ReferenceDRNumber: "",
      Remarks: "Borrower submitted successfully",
    };

    await axios.post(
      `${endpoints.disbursement}/${projectNumber}`,
      requestData
    );
    addNotification("Insert successful", "success");

    setSubmittedRows((prev) => {
      const newSubmitted = [...prev];
      newSubmitted[index] = true;
      return newSubmitted;
    });

    const newMax = await fetchMaxFdsbNumber();
    setMaxFdsbNumber(newMax);

    // Update local state to reflect submission
    setRequests((prevRequests) => {
      const newRequests = [...prevRequests];
      newRequests[index].Remarks = "Borrower submitted successfully";
      newRequests[index].Status = "0";
      newRequests[index].ApprovedAmount = "0";
      newRequests[index].ReferenceDRNumber = "";
      return newRequests;
    });
  } catch (error) {
    console.error("Error inserting asset disbursement request:", error);
    addNotification("Error inserting asset disbursement request", "error");
  } finally {
    setLoading((prev) => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  }
};


  const handleSubmitAll = async () => {
    const rowsWithBorrowerAccount = requests
      .map((req, index) => ({ req, index }))
      .filter(({ req }) => req.BorrowerAccountNumber);

    if (rowsWithBorrowerAccount.length === 0) {
      addNotification("No rows with borrower account numbers selected to submit", "error");
      return;
    }

    let successCount = 0;
    let currentMaxFdsbNumber = maxFdsbNumber;

    for (const { index } of rowsWithBorrowerAccount) {
      if (!submittedRows[index]) {
        try {
          // Update the maxFdsbNumber for the current row
          setMaxFdsbNumber(currentMaxFdsbNumber);

          await handleSubmit(index);

          // Increment the maxFdsbNumber based on the number of attachments in the current row
          const attachments = requests[index].Attachments;
          if (attachments.length > 0) {
            currentMaxFdsbNumber += attachments.length;
          } else {
            currentMaxFdsbNumber += 1; // Increment by 1 if no attachments
          }

          successCount++;
        } catch (error) {
          console.error(`Error submitting row ${index}:`, error);
        }
      }
    }

    if (successCount > 0) {
      addNotification(
        `Inserted ${successCount} row(s) successfully`,
        "success"
      );
    }
  };

  const addRows = () => {
    setRequests([
      ...requests,
      ...Array.from({ length: 10 }, () => ({
        ProjectNumber: "",
        AssetNumber: buildings.length === 1 ? buildings[0].asm_asst_nmbr_n : "",
        Category: categories.length === 1 ? categories[0] : "",
        SubCategory: "",
        PartyName: "",
        PartyGSTIN: "",
        PartyPAN: "",
        PartyEmail: "",
        PartyMobile: "",
        Reason: "",
        PurchaseOrder: "",
        TotalOrderAmount: "",
        DocumentType: "",
        PartyDocumentNumber: "",
        PartyDocumentDate: "",
        PartyDocumentPayableDays: "",
        PartyDocumentAmount: "",
        PartyDocumentGSTAmount: "",
        PartyDocumentTotalAmount: "",
        PartyTDSAmount: "",
        PartyAdvanceAdjusted: "",
        PartyRetentionAmount: "",
        PartyOtherDeductionAmount: "",
        PartyPayableAmount: "",
        PartyOutstandingAmount: "",
        BorrowerAccountNumber: "",
        PartyBankName: "",
        PartyAccountName: "",
        PartyAccountNumber: "",
        PartyAccountIFSC: "",
        Status: "0",
        ApprovedAmount: "0",
        ReferenceDRNumber: "",
        Remarks: "",
        AttachmentReference: "",
        CreatedBy: "",
        LastModifiedBy: "",
        Attachments: [],
      })),
    ]);
    setErrors([...errors, ...Array(10).fill({})]);
    setLoading((prev) => [...prev, ...Array(10).fill(false)]);
    setSubmittedRows((prev) => [...prev, ...Array(10).fill(false)]);
    setAccountNumbers((prev) => [...prev, ...Array(10).fill([])]);
    setDpAccountNumbers((prev) => [...prev, ...Array(10).fill([])]);
  };

  const validateAmounts = (index: number, showAlert: boolean = false) => {
    const request = requests[index];
    const totalAmount =
      request.PartyDocumentTotalAmount === "" ||
        isNaN(Number(request.PartyDocumentTotalAmount))
        ? 0
        : Number(request.PartyDocumentTotalAmount);
    const newErrors = { ...errors[index] };

    const fields = [
      "PartyTDSAmount",
      "PartyAdvanceAdjusted",
      "PartyRetentionAmount",
      "PartyOtherDeductionAmount",
      "PartyOutstandingAmount",
    ] as const;

    fields.forEach((field) => {
      const value = request[field];
      const numericValue =
        value === "" || isNaN(Number(value)) ? 0 : Number(value);
      if (numericValue > totalAmount) {
        newErrors[field] = "Amount should be less than total amount";
      } else {
        delete newErrors[field];
      }
    });

    const newErrorsArray = [...errors];
    newErrorsArray[index] = newErrors;
    setErrors(newErrorsArray);

    if (showAlert && Object.keys(newErrors).length > 0) {
      addNotification(
        "Some amounts exceed the Party Document Total Amount",
        "error"
      );
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const getAccountTypeLabel = (accountType: string) => {
    switch (accountType) {
      case 'C':
        return 'Collection (100%)';
      case 'R':
        return 'RERA (70%)';
      case 'E':
        return 'Escrow (30%)';
      case 'T':
        return 'Project Cost';
      case 'P':
        return 'Pass Through Charges';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">New Asset Disbursement</h1>
        <button
          onClick={handleSubmitAll}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit All
        </button>
      </div>

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

      <div className="bg-white w-full overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Asset</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Category</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Sub Category</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Name</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party GSTIN</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party PAN</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Email</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Mobile</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Reason</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Purchase Order</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Total Order Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Document Type</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Document Number</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Document Date</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Document Payable Days</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Document Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Document GST Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Document Total Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party TDS Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Advance Adjusted</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Retention Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Other Deduction Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Payable Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Outstanding Amount</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Borrower Account Number</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Bank Name</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Account Name</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Account Number</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Party Account IFSC</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Attachment</th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td className="py-3 px-4 border-b">
                  <select
                    value={request.AssetNumber}
                    onChange={(e) =>
                      handleInputChange(index, "AssetNumber", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  >
                    <option value="">Select a building</option>
                    {buildings.map((building) => (
                      <option
                        key={building.asm_asst_nmbr_n}
                        value={building.asm_asst_nmbr_n}
                      >
                        {building.asm_bldng_v}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 border-b">
                  <select
                    value={request.Category}
                    onChange={(e) =>
                      handleInputChange(index, "Category", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 border-b">
                  <select
                    value={request.SubCategory}
                    onChange={(e) =>
                      handleInputChange(index, "SubCategory", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={!request.Category || submittedRows[index]}
                  >
                    <option value="">Select Subcategory</option>
                    {request.Category && subCategories[request.Category]
                      ? subCategories[request.Category].map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))
                      : null}
                  </select>
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyName}
                    onChange={(e) =>
                      handleInputChange(index, "PartyName", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyGSTIN}
                    onChange={(e) =>
                      handleInputChange(index, "PartyGSTIN", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                  {errors[index]?.PartyGSTIN && (
                    <span className="text-red-500 text-sm">
                      {errors[index]?.PartyGSTIN}
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyPAN}
                    onChange={(e) =>
                      handleInputChange(index, "PartyPAN", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyEmail}
                    onChange={(e) =>
                      handleInputChange(index, "PartyEmail", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyMobile}
                    onChange={(e) =>
                      handleInputChange(index, "PartyMobile", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.Reason}
                    onChange={(e) =>
                      handleInputChange(index, "Reason", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PurchaseOrder}
                    onChange={(e) =>
                      handleInputChange(index, "PurchaseOrder", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.TotalOrderAmount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "TotalOrderAmount",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <select
                    value={request.DocumentType}
                    onChange={(e) =>
                      handleInputChange(index, "DocumentType", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  >
                    <option value="">Select Document Type</option>
                    <option value="INVOICE">INVOICE</option>
                    <option value="PI">PI</option>
                    <option value="ADVANCE">ADVANCE</option>
                    <option value="DN">DN</option>
                    <option value="CN">CN</option>
                  </select>
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyDocumentNumber}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyDocumentNumber",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="date"
                    value={request.PartyDocumentDate}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyDocumentDate",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                    max={today}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyDocumentPayableDays}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyDocumentPayableDays",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyDocumentAmount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyDocumentAmount",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyDocumentGSTAmount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyDocumentGSTAmount",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <span className="block p-2 w-36">
                    {request.PartyDocumentTotalAmount}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyTDSAmount}
                    onChange={(e) =>
                      handleInputChange(index, "PartyTDSAmount", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                  {errors[index]?.PartyTDSAmount && (
                    <span className="text-red-500 text-sm">
                      {errors[index]?.PartyTDSAmount}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyAdvanceAdjusted}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyAdvanceAdjusted",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                  {errors[index]?.PartyAdvanceAdjusted && (
                    <span className="text-red-500 text-sm">
                      {errors[index]?.PartyAdvanceAdjusted}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyRetentionAmount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyRetentionAmount",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                  {errors[index]?.PartyRetentionAmount && (
                    <span className="text-red-500 text-sm">
                      {errors[index]?.PartyRetentionAmount}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyOtherDeductionAmount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyOtherDeductionAmount",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                  {errors[index]?.PartyOtherDeductionAmount && (
                    <span className="text-red-500 text-sm">
                      {errors[index]?.PartyOtherDeductionAmount}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  <span className="block p-2 w-36">
                    {request.PartyPayableAmount}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyOutstandingAmount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyOutstandingAmount",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                  {errors[index]?.PartyOutstandingAmount && (
                    <span className="text-red-500 text-sm">
                      {errors[index]?.PartyOutstandingAmount}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  <select
                    value={request.BorrowerAccountNumber}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "BorrowerAccountNumber",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={
                      submittedRows[index] ||
                      (accountNumbers[index].length === 0 &&
                        dpAccountNumbers[index].length === 0)
                    }
                  >
                    <option value="">Select Account Number</option>
                    {accountNumbers[index].map((account, i) => {
                      console.log(
                        `Rendering ProjectAssetBankAccount[${index}][${i}]:`,
                        account
                      );
                      const accountType = getAccountTypeLabel(account.AccountType);
                      return (
                        <option
                          key={`account-${i}-${account.AccountNumber}`}
                          value={account.AccountNumber}
                        >
                          {account.AccountNumber} {accountType ? `(${accountType})` : ''}
                        </option>
                      );
                    })}
                    {dpAccountNumbers[index].map((account, i) => {
                      console.log(
                        `Rendering DpBankAccount[${index}][${i}]:`,
                        account
                      );
                      return (
                        <option
                          key={`dp-account-${i}-${account.AccountNumber}`}
                          value={account.AccountNumber}
                        >
                          {account.AccountNumber} (DP)
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyBankName}
                    onChange={(e) =>
                      handleInputChange(index, "PartyBankName", e.target.value)
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyAccountName}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyAccountName",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyAccountNumber}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyAccountNumber",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyAccountIFSC}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "PartyAccountIFSC",
                        e.target.value
                      )
                    }
                    className="border p-2 w-36"
                    disabled={submittedRows[index]}
                  />
                </td>
                <td className="py-3 px-4 border-b">
  <div className="flex items-center space-x-2">
    <input
      type="file"
      id={`file-input-${index}`}
      className="hidden"
      multiple
      onChange={(e) => handleFileChange(index, e)}
      disabled={submittedRows[index]}
    />
    <label
      htmlFor={`file-input-${index}`}
      className={`cursor-pointer text-2xl text-gray-600 ${
        submittedRows[index] ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      +
    </label>
    <div className="flex flex-row gap-2 items-center">
      {request.Attachments.map(({ name, type }, fileIndex) => (
        <div
          key={fileIndex}
          className="relative group"
        >
          <div className="relative">
            {getFileIcon(type)}
            <button
              onClick={() => handleRemoveFile(index, fileIndex)}
              className={`absolute -top-2 -right-2 text-red-500 text-lg ${
                submittedRows[index] ? "hidden" : ""
              }`}
              disabled={submittedRows[index]}
            >
              <IoClose />
            </button>
          </div>
          <span
            className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap max-w-[200px] truncate"
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  </div>
</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleSubmit(index)}
                    className={`py-2 px-4 rounded text-white flex items-center justify-center ${loading[index] || submittedRows[index]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    disabled={loading[index] || submittedRows[index]}
                  >
                    {loading[index] ? (
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
                        Submitting...
                      </>
                    ) : submittedRows[index] ? (
                      "Submitted"
                    ) : (
                      "Submit"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addRows}
        className="bg-green-500 text-white py-2 px-4 rounded mb-4"
      >
        Add 10 more rows
      </button>
    </div>
  );
};

export default NewAssetDisbursement;
