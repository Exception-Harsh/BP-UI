import React, { useState, useEffect } from "react";
import { NewDisbursementRequest, FileStorage } from "../types";
import axios from "axios";
import endpoints from "../endpoints";
import { FaFilePdf, FaFileExcel, FaFile } from "react-icons/fa";
import { IoClose, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

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

// Define the building data interface
interface BuildingData {
  asm_bldng_v: string;
  asm_asst_nmbr_n: string;
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
      className={`fixed top-4 right-4 w-80 p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 ${
        notification.type === "success"
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

const FetchedAssetDisbursement: React.FC = () => {
  const [requests, setRequests] = useState<NewDisbursementRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const [buildingsData, setBuildingsData] = useState<BuildingData[]>([]);
  const [approvedAmounts, setApprovedAmounts] = useState<{
    [key: number]: number;
  }>({});
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({});
  const [files, setFiles] = useState<{ [key: number]: FileStorage[] }>({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get<NewDisbursementRequest[]>(
          endpoints.alldisbursements
        );
        setRequests(response.data);
        setLoading(Array(response.data.length).fill(false));

        // Fetch files for each request
        response.data.forEach(async (request, index) => {
          if (request.AttachmentReference) {
            const filesResponse = await axios.get<FileStorage[]>(
              `${endpoints.filesByAttachmentReferences}/${request.AttachmentReference}`
            );
            setFiles((prev) => ({ ...prev, [index]: filesResponse.data }));
          }
        });
      } catch (error) {
        console.error("Error fetching asset disbursement requests:", error);
        addNotification("Error fetching asset disbursement requests", "error");
      }
    };

    const fetchBuildingsDataFromLocalStorage = () => {
      try {
        // Get buildings data from localStorage
        const buildingsDataString = localStorage.getItem("buildingsData");
        if (buildingsDataString) {
          const parsedData = JSON.parse(buildingsDataString) as BuildingData[];
          setBuildingsData(parsedData);
        } else {
          console.warn("No buildings data found in localStorage");
          addNotification("No buildings data found in localStorage", "error");
        }
      } catch (error) {
        console.error("Error fetching buildings data from localStorage:", error);
        addNotification(
          "Error fetching buildings data from localStorage",
          "error"
        );
      }
    };

    fetchRequests();
    fetchBuildingsDataFromLocalStorage();
  }, []);

  useEffect(() => {
    console.log("Files state:", files);
  }, [files]);

  // Function to get building name from asset number
  const getBuildingName = (assetNumber: string | number): string => {
    const building = buildingsData.find(
      (building) => building.asm_asst_nmbr_n === assetNumber.toString()
    );
    return building ? building.asm_bldng_v : assetNumber.toString();
  };

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substring(2);
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "Pdf") {
      return <FaFilePdf className="text-red-600 text-4xl" />;
    } else if (fileType === "Excel") {
      return <FaFileExcel className="text-green-600 text-4xl" />;
    } else {
      return <FaFile className="text-gray-600 text-4xl" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleApprovedAmountChange = (index: number, value: number) => {
    setApprovedAmounts((prev) => ({ ...prev, [index]: value }));
  };

  const handleRemarksChange = (index: number, value: string) => {
    setRemarks((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fetched Asset Disbursement</h1>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Approve All
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
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Asset
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Category
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Sub Category
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Name
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party GSTIN
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party PAN
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Email
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Mobile
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Reason
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Purchase Order
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Total Order Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Document Type
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Document Number
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Document Date
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Document Payable Days
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Document Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Document GST Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Document Total Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party TDS Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Advance Adjusted
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Retention Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Other Deduction Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Payable Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Outstanding Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Borrower Account Number
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Bank Name
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Account Name
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Account Number
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Party Account IFSC
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Approved Amount
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Remarks
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Attachment
              </th>
              <th className="py-3 px-4 border-b bg-[#00134B] text-white w-48">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td className="py-3 px-4 border-b">
                  {/* Display building name instead of asset number */}
                  {getBuildingName(request.AssetNumber)}
                </td>
                <td className="py-3 px-4 border-b">{request.Category}</td>
                <td className="py-3 px-4 border-b">{request.SubCategory}</td>
                <td className="py-3 px-4 border-b">{request.PartyName}</td>
                <td className="py-3 px-4 border-b">{request.PartyGSTIN}</td>
                <td className="py-3 px-4 border-b">{request.PartyPAN}</td>
                <td className="py-3 px-4 border-b">{request.PartyEmail}</td>
                <td className="py-3 px-4 border-b">{request.PartyMobile}</td>
                <td className="py-3 px-4 border-b">{request.Reason}</td>
                <td className="py-3 px-4 border-b">{request.PurchaseOrder}</td>
                <td className="py-3 px-4 border-b">
                  {request.TotalOrderAmount}
                </td>
                <td className="py-3 px-4 border-b">{request.DocumentType}</td>
                <td className="py-3 px-4 border-b">
                  {request.PartyDocumentNumber}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyDocumentDate
                    ? formatDate(request.PartyDocumentDate)
                    : "N/A"}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyDocumentPayableDays}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyDocumentAmount}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyDocumentGSTAmount}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyDocumentTotalAmount}
                </td>
                <td className="py-3 px-4 border-b">{request.PartyTDSAmount}</td>
                <td className="py-3 px-4 border-b">
                  {request.PartyAdvanceAdjusted}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyRetentionAmount}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyOtherDeductionAmount}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyPayableAmount}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyOutstandingAmount}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.BorrowerAccountNumber}
                </td>
                <td className="py-3 px-4 border-b">{request.PartyBankName}</td>
                <td className="py-3 px-4 border-b">
                  {request.PartyAccountName}
                </td>
                <td className="py-3 px-4 border-b">
                  {request.PartyAccountNumber}
                </td>
                <td className="py-3 px-4 border-b">{request.PartyAccountIFSC}</td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="number"
                    value={approvedAmounts[index] || ""}
                    onChange={(e) =>
                      handleApprovedAmountChange(index, parseFloat(e.target.value))
                    }
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <input
                    type="text"
                    value={remarks[index] || ""}
                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex flex-row gap-2 items-center">
                    {files[index]?.map((file, fileIndex) => {
                      console.log("File Type:", file.FileType); // Log the file type
                      return (
                        <a
                          key={fileIndex}
                          href={`${endpoints.downloadFile}/${file.Number}`}
                          download={file.FileName}
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <div className="relative">
                            {getFileIcon(file.FileType)}
                          </div>
                          <span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap max-w-[200px] truncate">
                            {file.FileName}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex space-x-2">
                    <button
                      className={`py-2 px-4 rounded text-white flex items-center justify-center ${
                        loading[index] || request.Status === "A"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      disabled={loading[index] || request.Status === "A"}
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
                          Approving...
                        </>
                      ) : request.Status === "A" ? (
                        "Approved"
                      ) : (
                        "Approve"
                      )}
                    </button>
                    <button
                      className={`py-2 px-4 rounded text-white flex items-center justify-center ${
                        loading[index] || request.Status === "R"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      disabled={loading[index] || request.Status === "R"}
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
                          Rejecting...
                        </>
                      ) : request.Status === "R" ? (
                        "Rejected"
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FetchedAssetDisbursement;