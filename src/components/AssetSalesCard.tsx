// import { useState, useEffect } from "react";
// import { newAssetSale } from "../types";
// import endpoints from "../endpoints";

// export default function AssetSalesComponent({
//   isDarkMode,
// }: {
//   isDarkMode: boolean;
// }) {
//   const [data, setData] = useState<newAssetSale[]>([]);
//   const [buildings, setBuildings] = useState<string[]>([]);
//   const [selectedBuilding, setSelectedBuilding] = useState<string>("");
//   const [unitNumbers, setUnitNumbers] = useState<string[]>([]);
//   const [selectedUnitNumber, setSelectedUnitNumber] = useState<string>("");
//   const [unitConfigurations, setUnitConfigurations] = useState<string[]>([]);
//   const [selectedUnitConfiguration, setSelectedUnitConfiguration] = useState<string>("");
//   const [customerNames, setCustomerNames] = useState<string[]>([]);
//   const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
//   const [soldFlag, setSoldFlag] = useState<boolean>(false);
//   const [updateStatus, setUpdateStatus] = useState<string | null>(null);
//   const projectNumber = localStorage.getItem("projectNumber");
//   const yearMonth = localStorage.getItem("yearMonth");

//   // Fetch buildings on component mount
//   useEffect(() => {
//     if (!projectNumber || !yearMonth) {
//       console.error("Project number or YearMonth is missing!");
//       return;
//     }

//     const url = `${endpoints.sales}buildings/${projectNumber}/${yearMonth}`;
//     console.log("Fetching buildings from:", url);

//     fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((fetchedData) => {
//         console.log("API Response (Buildings):", fetchedData);
//         if (fetchedData.buildings && Array.isArray(fetchedData.buildings)) {
//           setBuildings(fetchedData.buildings);
//         } else {
//           console.error("Unexpected API response format:", fetchedData);
//           setBuildings([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching buildings:", error);
//         setBuildings([]);
//       });
//   }, [projectNumber, yearMonth]);

//   // Fetch filters data when a building is selected
//   useEffect(() => {
//     if (!projectNumber || !selectedBuilding || !yearMonth) {
//       return;
//     }

//     const url = `${endpoints.sales}filters/${projectNumber}/${yearMonth}/${selectedBuilding}`;
//     console.log("Fetching filters data from:", url);

//     fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((fetchedData) => {
//         console.log("API Response (Filters):", fetchedData);
//         if (fetchedData.unitNumbers && Array.isArray(fetchedData.unitNumbers)) {
//           setUnitNumbers(fetchedData.unitNumbers);
//         } else {
//           console.error("Unexpected API response format:", fetchedData);
//           setUnitNumbers([]);
//         }
//         if (
//           fetchedData.unitConfigurations &&
//           Array.isArray(fetchedData.unitConfigurations)
//         ) {
//           setUnitConfigurations(fetchedData.unitConfigurations);
//         } else {
//           console.error("Unexpected API response format:", fetchedData);
//           setUnitConfigurations([]);
//         }
//         if (
//           fetchedData.customerNames &&
//           Array.isArray(fetchedData.customerNames)
//         ) {
//           setCustomerNames(fetchedData.customerNames);
//         } else {
//           console.error("Unexpected API response format:", fetchedData);
//           setCustomerNames([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching filters data:", error);
//         setUnitNumbers([]);
//         setUnitConfigurations([]);
//         setCustomerNames([]);
//       });
//   }, [projectNumber, selectedBuilding, yearMonth]);

  
//   useEffect(() => {
//     if (!projectNumber || !selectedBuilding || !yearMonth) {
//       return;
//     }

//     let url = `${endpoints.sales}data/${projectNumber}/${yearMonth}/${selectedBuilding}`;
//     const params = new URLSearchParams();
//     if (selectedUnitNumber) {
//       params.append("unitNumber", selectedUnitNumber);
//     }
//     if (selectedUnitConfiguration) {
//       params.append("unitConfiguration", selectedUnitConfiguration);
//     }
//     if (selectedCustomerName) {
//       params.append("customerName", selectedCustomerName);
//     }
//     if (soldFlag) {
//       params.append("soldFlag", soldFlag ? "Y" : "N");
//     }

//     if (params.toString()) {
//       url += `?${params.toString()}`;
//     }

//     console.log("Fetching data from:", url);

//     fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((fetchedData) => {
//         console.log("API Response (Data):", fetchedData);
//         if (Array.isArray(fetchedData.data)) {
//           setData(fetchedData.data);
//           // Store uniqueUnitNumber in localStorage as an array
//           const uniqueUnitNumbers = fetchedData.data.map(
//             (row: { uniqueUnitNumber: any }) => row.uniqueUnitNumber
//           );
//           localStorage.setItem(
//             `uniqueUnitNumbers_${projectNumber}_${yearMonth}_${selectedBuilding}`,
//             JSON.stringify(uniqueUnitNumbers)
//           );
//         } else {
//           console.error("Unexpected API response format:", fetchedData);
//           setData([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching asset sales data:", error);
//         setData([]);
//       });
//   }, [
//     projectNumber,
//     selectedBuilding,
//     yearMonth,
//     selectedUnitNumber,
//     selectedUnitConfiguration,
//     selectedCustomerName,
//     soldFlag,
//   ]);

//   const handleChange = (
//     index: number,
//     key: string,
//     value: string | number | boolean
//   ) => {
//     const updatedData = [...data];
//     updatedData[index] = { ...updatedData[index], [key]: value };

//     // Clear associated fields if checkboxes are unchecked
//     if (key === "SoldFlag" && value === "N") {
//       [
//         "SalesBasePrice",
//         "SalesStampDutyAmount",
//         "SalesRegistrationAmount",
//         "SalesOtherCharges",
//         "SalesPassThroughCharges",
//         "SalesTaxesAmount",
//         "DemandBasePrice",
//         "DemandStampDuty",
//         "DemandRegistrationAmount",
//         "DemandOtherCharges",
//         "DemandPassThroughCharges",
//         "DemandTaxesAmount",
//         "ReceivedBasePrice",
//         "ReceivedStampDutyAmount",
//         "ReceivedRegistrationAmount",
//         "ReceivedOtherCharges",
//         "ReceivedPassThroughCharges",
//         "ReceivedTaxesAmount",
//         "RegistrationDate",
//         "CustomerName",
//         "CustomerKycAadhar",
//         "CustomerKycPan",
//         "CustomerKycMobile",
//         "CustomerKycEmail",
//         "CustomerKycAddress",
//         "SourceOfCustomer",
//         "ChannelPartnerName",
//         "ChannelPartnerMobile",
//         "ChannelPartnerEmail",
//         "NcNumber",
//         "PaymentPlanName",
//         "ModeOfFinance",
//         "FinancialInstitutionName",
//         "BrokerageAmount",
//       ].forEach((field) => {
//         updatedData[index][field] = null;
//       });
//       // Uncheck RegisteredFlag and NcIssuedFlag
//       updatedData[index]["RegisteredFlag"] = "N";
//       updatedData[index]["NcIssuedFlag"] = "N";
//     }

//     if (key === "RegisteredFlag" && value === "N") {
//       ["RegistrationDate"].forEach((field) => {
//         updatedData[index][field] = null;
//       });
//     }

//     if (key === "NcIssuedFlag" && value === "N") {
//       ["NcNumber"].forEach((field) => {
//         updatedData[index][field] = null;
//       });
//     }

//     if (key === "SourceOfCustomer" && value !== "Channel Partners (CP)") {
//       [
//         "ChannelPartnerName",
//         "ChannelPartnerMobile",
//         "ChannelPartnerEmail",
//       ].forEach((field) => {
//         updatedData[index][field] = null;
//       });
//     }

//     // Update the state with the new data
//     setData(updatedData);
//     setUpdateStatus(null); // Clear any previous status when editing starts
//   };

//   const handleSubmit = async () => {
//     setUpdateStatus("Updating...");

//     let allUpdatesSuccessful = true;
//     const uniqueUnitNumbers = JSON.parse(
//       localStorage.getItem(
//         `uniqueUnitNumbers_${projectNumber}_${yearMonth}_${selectedBuilding}`
//       ) || "[]"
//     );

//     for (const assetSale of data) {
//       const uniqueUnitNumber = uniqueUnitNumbers.find(
//         (num: string) => num === assetSale.uniqueUnitNumber
//       );
//       if (!uniqueUnitNumber) {
//         console.error(
//           `Unique Unit Number not found for asset sale:`,
//           assetSale
//         );
//         allUpdatesSuccessful = false;
//         continue;
//       }

//       try {
//         const response = await fetch(
//           `${endpoints.update}/${projectNumber}/${yearMonth}/${selectedBuilding}/${uniqueUnitNumber}`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(assetSale),
//           }
//         );

//         if (!response.ok) {
//           console.error(
//             `Failed to update asset sale for Unit Number: ${assetSale.uniqueUnitNumber}`
//           );
//           allUpdatesSuccessful = false;
//         } else {
//           const result = await response.json();
//           console.log(
//             `Update successful for Unit Number: ${assetSale.uniqueUnitNumber}`,
//             result
//           );
//         }
//       } catch (error) {
//         console.error("Error updating asset sales:", error);
//         allUpdatesSuccessful = false;
//       }
//     }

//     if (allUpdatesSuccessful) {
//       setUpdateStatus("All updates successful!");
//     } else {
//       setUpdateStatus("Some updates failed. Check console for details.");
//     }
//   };

//   return (
//     <div
//       className={`p-6 shadow-lg rounded-lg ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
//       }`}
//     >
//       {updateStatus && <div className="mb-4 text-center">{updateStatus}</div>}

//       {/* Building Selection Dropdown */}
//       <div className="mb-4">
//         <label htmlFor="building" className="mr-2">
//           Select Building:
//         </label>
//         <select
//           id="building"
//           value={selectedBuilding}
//           onChange={(e) => setSelectedBuilding(e.target.value)}
//           className={`p-2 border rounded ${
//             isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//           }`}
//         >
//           <option value="">Select a building</option>
//           {buildings.map((building, index) => (
//             <option key={index} value={building}>
//               {building}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Unit Number Selection Dropdown */}
//       <div className="mb-4">
//         <label htmlFor="unitNumber" className="mr-2">
//           Select Unit Number:
//         </label>
//         <select
//           id="unitNumber"
//           value={selectedUnitNumber}
//           onChange={(e) => setSelectedUnitNumber(e.target.value)}
//           className={`p-2 border rounded ${
//             isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//           }`}
//         >
//           <option value="">Select a unit number</option>
//           {unitNumbers.map((unitNumber, index) => (
//             <option key={index} value={unitNumber}>
//               {unitNumber}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Unit Configuration Selection Dropdown */}
//       <div className="mb-4">
//         <label htmlFor="unitConfiguration" className="mr-2">
//           Select Unit Configuration:
//         </label>
//         <select
//           id="unitConfiguration"
//           value={selectedUnitConfiguration}
//           onChange={(e) => setSelectedUnitConfiguration(e.target.value)}
//           className={`p-2 border rounded ${
//             isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//           }`}
//         >
//           <option value="">Select a unit configuration</option>
//           {unitConfigurations.map((unitConfiguration, index) => (
//             <option key={index} value={unitConfiguration}>
//               {unitConfiguration}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Customer Name Selection Dropdown */}
//       <div className="mb-4">
//         <label htmlFor="customerName" className="mr-2">
//           Select Customer Name:
//         </label>
//         <select
//           id="customerName"
//           value={selectedCustomerName}
//           onChange={(e) => setSelectedCustomerName(e.target.value)}
//           className={`p-2 border rounded ${
//             isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//           }`}
//         >
//           <option value="">Select a customer name</option>
//           {customerNames.map((customerName, index) => (
//             <option key={index} value={customerName}>
//               {customerName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Sold Flag Checkbox */}
//       <div className="mb-4">
//         <label htmlFor="soldFlag" className="mr-2">
//           Sold:
//         </label>
//         <input
//           type="checkbox"
//           id="soldFlag"
//           checked={soldFlag}
//           onChange={(e) => setSoldFlag(e.target.checked)}
//           className="mr-2"
//         />
//       </div>

//       {data.map((row, rowIndex) => {
//         // Calculate totals for Sales, Demand, and Received
//         const calculateTotal = (prefix: string) => {
//           const basePrice = parseFloat(row[`${prefix}BasePrice`]) || 0;
//           const stampDuty = parseFloat(row[`${prefix}StampDutyAmount`]) || 0;
//           const registrationAmount =
//             parseFloat(row[`${prefix}RegistrationAmount`]) || 0;
//           const otherCharges = parseFloat(row[`${prefix}OtherCharges`]) || 0;
//           const passThroughCharges =
//             parseFloat(row[`${prefix}PassThroughCharges`]) || 0;
//           const taxesAmount = parseFloat(row[`${prefix}TaxesAmount`]) || 0;

//           return (
//             basePrice +
//             stampDuty +
//             registrationAmount +
//             otherCharges +
//             passThroughCharges +
//             taxesAmount
//           );
//         };

//         const salesTotal = calculateTotal("Sales");
//         const demandTotal = calculateTotal("Demand");
//         const receivedTotal = calculateTotal("Received");

//         return (
//           <div
//             key={rowIndex}
//             className="mb-6 p-4 shadow-lg rounded-lg bg-gray-100"
//           >
//             <div className="mb-4 grid grid-cols-3 gap-4">
//               {/* Sold Checkbox */}
//               <div className="flex items-center">
//                 <label className="w-20 font-bold">Sold?</label>
//                 <input
//                   type="checkbox"
//                   checked={row.SoldFlag?.trim().toUpperCase() === "Y"}
//                   onChange={() =>
//                     handleChange(
//                       rowIndex,
//                       "SoldFlag",
//                       row.SoldFlag === "Y" ? "N" : "Y"
//                     )
//                   }
//                   className="mr-2"
//                 />
//               </div>
//             </div>

//             {/* 🟢 Unit Details */}
//             <div className="grid grid-cols-3 gap-4 mb-4">
//               {[
//                 "UnitNumber",
//                 "UnitConfiguration",
//                 "UnitType",
//                 "CarpetAreaRR",
//                 "SaleableArea",
//                 "Floor",
//                 "UniqueUnitNumber",
//               ].map((colName) => (
//                 <div key={colName} className="flex flex-col">
//                   <label className="font-bold">
//                     {colName.replace(/([A-Z])/g, " $1").trim()}:
//                   </label>
//                   <span className="p-1 border rounded">
//                     {row[colName] || ""}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* 🔴 Lines Below Only Appear If SoldFlag is "Y" */}
//             {row.SoldFlag?.trim().toUpperCase() === "Y" && (
//               <>
//                 <div className="mb-2">
//                   <h4 className="font-bold mb-2">Sale Details</h4>
//                   <div className="grid grid-cols-7 gap-4">
//                     {[
//                       "SalesBasePrice",
//                       "SalesStampDutyAmount",
//                       "SalesRegistrationAmount",
//                       "SalesOtherCharges",
//                       "SalesPassThroughCharges",
//                       "SalesTaxesAmount",
//                     ].map((colName) => (
//                       <div key={colName} className="flex flex-col">
//                         <label className="font-bold">
//                           {colName.replace(/([A-Z])/g, " $1").trim()}:
//                           {[
//                             "SalesBasePrice",
//                             "SalesStampDutyAmount",
//                             "SalesRegistrationAmount",
//                           ].includes(colName) && (
//                             <span className="text-red-700">*</span>
//                           )}
//                         </label>
//                         <input
//                           type="number"
//                           min="0"
//                           value={row[colName] || ""}
//                           onChange={(e) =>
//                             handleChange(
//                               rowIndex,
//                               colName,
//                               Math.max(0, parseFloat(e.target.value))
//                             )
//                           }
//                           required={[
//                             "SalesBasePrice",
//                             "SalesStampDutyAmount",
//                             "SalesRegistrationAmount",
//                           ].includes(colName)}
//                         />
//                       </div>
//                     ))}
//                     <span className="font-bold self-center">
//                       Total: {salesTotal.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* 🟡 Line 3: Demand Details */}
//                 <div className="mb-2">
//                   <h4 className="font-bold mb-2">Demand Details</h4>
//                   <div className="grid grid-cols-7 gap-4">
//                     {[
//                       "DemandBasePrice",
//                       "DemandStampDuty",
//                       "DemandRegistrationAmount",
//                       "DemandOtherCharges",
//                       "DemandPassThroughCharges",
//                       "DemandTaxesAmount",
//                     ].map((colName) => (
//                       <div key={colName} className="flex flex-col">
//                         <label className="font-bold">
//                           {colName.replace(/([A-Z])/g, " $1").trim()}:
//                         </label>
//                         <input
//                           type="number"
//                           min="0"
//                           value={row[colName] || ""}
//                           onChange={(e) =>
//                             handleChange(
//                               rowIndex,
//                               colName,
//                               Math.max(0, parseFloat(e.target.value))
//                             )
//                           }
//                         />
//                       </div>
//                     ))}
//                     <span className="font-bold self-center">
//                       Total: {demandTotal.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* 🟡 Line 4: Received Details */}
//                 <div className="mb-2">
//                   <h4 className="font-bold mb-2">Received Details</h4>
//                   <div className="grid grid-cols-7 gap-4">
//                     {[
//                       "ReceivedBasePrice",
//                       "ReceivedStampDutyAmount",
//                       "ReceivedRegistrationAmount",
//                       "ReceivedOtherCharges",
//                       "ReceivedPassThroughCharges",
//                       "ReceivedTaxesAmount",
//                     ].map((colName) => (
//                       <div key={colName} className="flex flex-col">
//                         <label className="font-bold">
//                           {colName.replace(/([A-Z])/g, " $1").trim()}:
//                         </label>
//                         <input
//                           type="number"
//                           min="0"
//                           value={row[colName] || ""}
//                           onChange={(e) =>
//                             handleChange(
//                               rowIndex,
//                               colName,
//                               Math.max(0, parseFloat(e.target.value))
//                             )
//                           }
//                         />
//                       </div>
//                     ))}
//                     <span className="font-bold self-center">
//                       Total: {receivedTotal.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Registered Flag Checkbox */}
//                 <div className="flex items-center">
//                   <label className="w-40 font-bold">Registered?</label>
//                   <input
//                     type="checkbox"
//                     checked={row.RegisteredFlag?.trim().toUpperCase() === "Y"}
//                     onChange={() =>
//                       handleChange(
//                         rowIndex,
//                         "RegisteredFlag",
//                         row.RegisteredFlag === "Y" ? "N" : "Y"
//                       )
//                     }
//                     className="mr-2"
//                   />
//                 </div>

//                 {/* Dates and Finance Details */}
//                 {row.RegisteredFlag?.trim().toUpperCase() === "Y" && (
//                   <div className="mb-2">
//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="flex flex-col">
//                         <label className="font-bold">Registration Date:</label>
//                         <span className="text-red-700">*</span>
//                         <input
//                           type="date"
//                           value={
//                             row.RegistrationDate
//                               ? new Date(row.RegistrationDate)
//                                   .toISOString()
//                                   .split("T")[0]
//                               : ""
//                           }
//                           onChange={(e) =>
//                             handleChange(
//                               rowIndex,
//                               "RegistrationDate",
//                               e.target.value
//                             )
//                           }
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mb-2">
//                   <div className="grid grid-cols-3 gap-4">
//                     {[
//                       "BookingDate",
//                       "AllotmentLetterDate",
//                       "AgreementDate",
//                     ].map((colName) => (
//                       <div key={colName} className="flex flex-col">
//                         <label className="font-bold">
//                           {colName.replace(/([A-Z])/g, " $1").trim()}:
//                         </label>
//                         <input
//                           type="date"
//                           value={
//                             row[colName]
//                               ? new Date(row[colName])
//                                   .toISOString()
//                                   .split("T")[0]
//                               : ""
//                           }
//                           onChange={(e) =>
//                             handleChange(rowIndex, colName, e.target.value)
//                           }
//                           className="p-1 border rounded"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* 🟢 Line 5: Customer Details */}
//                 <div className="mb-2">
//                   <h4 className="font-bold mb-2">Customer Details:</h4>
//                   <div className="grid grid-cols-3 gap-4">
//                     {[
//                       "CustomerName",
//                       "CustomerKycAadhar",
//                       "CustomerKycPan",
//                       "CustomerKycMobile",
//                       "CustomerKycEmail",
//                       "CustomerKycAddress",
//                     ].map((colName) => (
//                       <div key={colName} className="flex flex-col">
//                         <label className="font-bold">
//                           {colName.replace(/([A-Z])/g, " $1").trim()}:
//                           <span className="text-red-700">*</span>
//                         </label>
//                         <input
//                           type={
//                             colName === "CustomerKycEmail" ? "email" : "text"
//                           }
//                           value={row[colName] || ""}
//                           onChange={(e) =>
//                             handleChange(rowIndex, colName, e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 {/* Source of Customer Dropdown */}
//                 <div className="mb-2">
//                   <label className="font-bold">Source Of Customer:</label>
//                   <select
//                     value={row.SourceOfCustomer || ""}
//                     onChange={(e) =>
//                       handleChange(rowIndex, "SourceOfCustomer", e.target.value)
//                     }
//                     className="p-1 border rounded"
//                   >
//                     <option value="">Select</option>
//                     <option value="Direct">Direct</option>
//                     <option value="Channel Partners (CP)">
//                       Channel Partners (CP)
//                     </option>
//                     <option value="Others">Others</option>
//                   </select>
//                 </div>

//                 {row.SourceOfCustomer === "Channel Partners (CP)" && (
//                   <div className="grid grid-cols-3 gap-4 mb-4">
//                     {[
//                       "ChannelPartnerName",
//                       "ChannelPartnerMobile",
//                       "ChannelPartnerEmail",
//                     ].map((colName) => (
//                       <div key={colName} className="flex flex-col">
//                         <label className="font-bold">
//                           {colName.replace(/([A-Z])/g, " $1").trim()}:
//                           <span className="text-red-700">*</span>
//                         </label>
//                         <input
//                           type={
//                             colName === "ChannelPartnerEmail" ? "email" : "text"
//                           }
//                           value={row[colName] || ""}
//                           onChange={(e) =>
//                             handleChange(rowIndex, colName, e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Mode of Finance Dropdown */}
//                 <div className="mb-2">
//                   <label className="font-bold">Mode Of Finance:</label>
//                   <select
//                     value={row.ModeOfFinance || ""}
//                     onChange={(e) =>
//                       handleChange(rowIndex, "ModeOfFinance", e.target.value)
//                     }
//                     className="p-1 border rounded"
//                   >
//                     <option value="">Select</option>
//                     <option value="Self">Self</option>
//                     <option value="Loan">Loan</option>
//                     <option value="Financial Institution">
//                       Financial Institution
//                     </option>
//                     <option value="Others">Others</option>
//                   </select>
//                 </div>

//                 {row.ModeOfFinance === "Financial Institution" && (
//                   <div className="grid grid-cols-3 gap-4 mb-4">
//                     <div className="flex flex-col">
//                       <label className="font-bold">
//                         Financial Institution Name:
//                         <span className="text-red-700">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={row.FinancialInstitutionName || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             rowIndex,
//                             "FinancialInstitutionName",
//                             e.target.value
//                           )
//                         }
//                         className="p-1 border rounded"
//                       />
//                       required
//                     </div>
//                   </div>
//                 )}

//                 {/* NC Issued Flag Checkbox */}
//                 <div className="flex items-center">
//                   <label className="w-40 font-bold">NC Issued?</label>
//                   <input
//                     type="checkbox"
//                     checked={row.NcIssuedFlag?.trim().toUpperCase() === "Y"}
//                     onChange={() =>
//                       handleChange(
//                         rowIndex,
//                         "NcIssuedFlag",
//                         row.NcIssuedFlag === "Y" ? "N" : "Y"
//                       )
//                     }
//                     className="mr-2"
//                   />
//                 </div>

//                 {/* NC Details */}
//                 {row.NcIssuedFlag?.trim().toUpperCase() === "Y" && (
//                   <div className="mb-2">
//                     <div className="grid grid-cols-3 gap-4">
//                       {["NcNumber"].map((colName) => (
//                         <div key={colName} className="flex flex-col">
//                           <label className="font-bold">
//                             {colName.replace(/([A-Z])/g, " $1").trim()}:
//                             <span className="text-red-700">*</span>
//                           </label>
//                           <input
//                             type="number"
//                             min="0"
//                             value={row[colName] || ""}
//                             onChange={(e) =>
//                               handleChange(
//                                 rowIndex,
//                                 colName,
//                                 Math.max(0, parseFloat(e.target.value))
//                               )
//                             }
//                             required
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Payment Plan Name Dropdown */}
//                 <div className="mb-2">
//                   <label className="font-bold">Payment Plan Name:</label>
//                   <select
//                     value={row.PaymentPlanName || ""}
//                     onChange={(e) =>
//                       handleChange(rowIndex, "PaymentPlanName", e.target.value)
//                     }
//                     className="p-1 border rounded"
//                   >
//                     <option value="">Select</option>
//                     {Array.from({ length: 9 }, (_, i) => (
//                       <option key={i} value={`CLP${i + 1}`}>
//                         {`CLP${i + 1}`}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 mb-4">
//                   <div className="flex flex-col">
//                     <label className="font-bold">Brokerage Amount:</label>
//                     <input
//                       type="number"
//                       min="0"
//                       value={row.BrokerageAmount || ""}
//                       onChange={(e) =>
//                         handleChange(
//                           rowIndex,
//                           "BrokerageAmount",
//                           Math.max(0, parseFloat(e.target.value))
//                         )
//                       }
//                       className={`p-1 border rounded ${
//                         row.BrokerageAmount === "" ? "border-red-500" : ""
//                       }`}
//                       required
//                     />
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         );
//       })}

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Save
//       </button>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { newAssetSale } from "../types";
import endpoints from "../endpoints";

export default function AssetSalesComponent({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) {
  const [data, setData] = useState<newAssetSale[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [unitNumbers, setUnitNumbers] = useState<string[]>([]);
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<string>("");
  const [unitConfigurations, setUnitConfigurations] = useState<string[]>([]);
  const [selectedUnitConfiguration, setSelectedUnitConfiguration] = useState<string>("");
  const [customerNames, setCustomerNames] = useState<string[]>([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  const [soldFlag, setSoldFlag] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [yearMonth, setYearMonth] = useState<string>("");
  const projectNumber = localStorage.getItem("projectNumber");

  // Initialize yearMonth from localStorage if available
  useEffect(() => {
    const storedYearMonth = localStorage.getItem("yearMonth");
    if (storedYearMonth) {
      setYearMonth(storedYearMonth);
    }
  }, []);

  // Fetch yearMonth data if not already in localStorage
  useEffect(() => {
    const fetchYearMonth = async () => {
      try {
        const response = await fetch(endpoints.yearmonth + `${projectNumber}`);
        if (response.ok) {
          const data = await response.json();
          const nextYearMonth = data.nextYearMonth;
          setYearMonth(nextYearMonth);
          localStorage.setItem("yearMonth", nextYearMonth);
        } else {
          console.error("Failed to fetch YearMonth data");
        }
      } catch (error) {
        console.error("Error fetching YearMonth data:", error);
      }
    };

    if (projectNumber && !yearMonth) {
      fetchYearMonth();
    }
  }, [projectNumber, yearMonth]);

  // Fetch buildings on component mount
  useEffect(() => {
    if (!projectNumber || !yearMonth) {
      console.error("Project number or YearMonth is missing!");
      return;
    }

    const url = `${endpoints.sales}buildings/${projectNumber}/${yearMonth}`;
    console.log("Fetching buildings from:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((fetchedData) => {
        console.log("API Response (Buildings):", fetchedData);
        if (fetchedData.buildings && Array.isArray(fetchedData.buildings)) {
          setBuildings(fetchedData.buildings);
        } else {
          console.error("Unexpected API response format:", fetchedData);
          setBuildings([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching buildings:", error);
        setBuildings([]);
      });
  }, [projectNumber, yearMonth]);

  // Fetch filters data when a building is selected
  useEffect(() => {
    if (!projectNumber || !selectedBuilding || !yearMonth) {
      return;
    }

    const url = `${endpoints.sales}filters/${projectNumber}/${yearMonth}/${selectedBuilding}`;
    console.log("Fetching filters data from:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((fetchedData) => {
        console.log("API Response (Filters):", fetchedData);
        if (fetchedData.unitNumbers && Array.isArray(fetchedData.unitNumbers)) {
          setUnitNumbers(fetchedData.unitNumbers);
        } else {
          console.error("Unexpected API response format:", fetchedData);
          setUnitNumbers([]);
        }
        if (
          fetchedData.unitConfigurations &&
          Array.isArray(fetchedData.unitConfigurations)
        ) {
          setUnitConfigurations(fetchedData.unitConfigurations);
        } else {
          console.error("Unexpected API response format:", fetchedData);
          setUnitConfigurations([]);
        }
        if (
          fetchedData.customerNames &&
          Array.isArray(fetchedData.customerNames)
        ) {
          setCustomerNames(fetchedData.customerNames);
        } else {
          console.error("Unexpected API response format:", fetchedData);
          setCustomerNames([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching filters data:", error);
        setUnitNumbers([]);
        setUnitConfigurations([]);
        setCustomerNames([]);
      });
  }, [projectNumber, selectedBuilding, yearMonth]);

  useEffect(() => {
    if (!projectNumber || !selectedBuilding || !yearMonth) {
      return;
    }

    let url = `${endpoints.sales}data/${projectNumber}/${yearMonth}/${selectedBuilding}`;
    const params = new URLSearchParams();
    if (selectedUnitNumber) {
      params.append("unitNumber", selectedUnitNumber);
    }
    if (selectedUnitConfiguration) {
      params.append("unitConfiguration", selectedUnitConfiguration);
    }
    if (selectedCustomerName) {
      params.append("customerName", selectedCustomerName);
    }
    if (soldFlag) {
      params.append("soldFlag", soldFlag ? "Y" : "N");
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Fetching data from:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((fetchedData) => {
        console.log("API Response (Data):", fetchedData);
        if (Array.isArray(fetchedData.data)) {
          setData(fetchedData.data);
          // Store uniqueUnitNumber in localStorage as an array
          const uniqueUnitNumbers = fetchedData.data.map(
            (row: { uniqueUnitNumber: any }) => row.uniqueUnitNumber
          );
          localStorage.setItem(
            `uniqueUnitNumbers_${projectNumber}_${yearMonth}_${selectedBuilding}`,
            JSON.stringify(uniqueUnitNumbers)
          );
        } else {
          console.error("Unexpected API response format:", fetchedData);
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching asset sales data:", error);
        setData([]);
      });
  }, [
    projectNumber,
    selectedBuilding,
    yearMonth,
    selectedUnitNumber,
    selectedUnitConfiguration,
    selectedCustomerName,
    soldFlag,
  ]);

  const handleChange = (
    index: number,
    key: string,
    value: string | number | boolean
  ) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [key]: value };

    // Clear associated fields if checkboxes are unchecked
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
      // Uncheck RegisteredFlag and NcIssuedFlag
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

    // Update the state with the new data
    setData(updatedData);
    setUpdateStatus(null); // Clear any previous status when editing starts
  };

  const handleSubmit = async () => {
    setUpdateStatus("Updating...");

    let allUpdatesSuccessful = true;
    const uniqueUnitNumbers = JSON.parse(
      localStorage.getItem(
        `uniqueUnitNumbers_${projectNumber}_${yearMonth}_${selectedBuilding}`
      ) || "[]"
    );

    for (const assetSale of data) {
      const uniqueUnitNumber = uniqueUnitNumbers.find(
        (num: string) => num === assetSale.uniqueUnitNumber
      );
      if (!uniqueUnitNumber) {
        console.error(
          `Unique Unit Number not found for asset sale:`,
          assetSale
        );
        allUpdatesSuccessful = false;
        continue;
      }

      try {
        const response = await fetch(
          `${endpoints.update}/${projectNumber}/${yearMonth}/${selectedBuilding}/${uniqueUnitNumber}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assetSale),
          }
        );

        if (!response.ok) {
          console.error(
            `Failed to update asset sale for Unit Number: ${assetSale.uniqueUnitNumber}`
          );
          allUpdatesSuccessful = false;
        } else {
          const result = await response.json();
          console.log(
            `Update successful for Unit Number: ${assetSale.uniqueUnitNumber}`,
            result
          );
        }
      } catch (error) {
        console.error("Error updating asset sales:", error);
        allUpdatesSuccessful = false;
      }
    }

    if (allUpdatesSuccessful) {
      setUpdateStatus("All updates successful!");
    } else {
      setUpdateStatus("Some updates failed. Check console for details.");
    }
  };

  return (
    <div
      className={`p-6 shadow-lg rounded-lg ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {updateStatus && <div className="mb-4 text-center">{updateStatus}</div>}

      {/* Building Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="building" className="mr-2">
          Select Building:
        </label>
        <select
          id="building"
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className={`p-2 border rounded ${
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

      {/* Unit Number Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="unitNumber" className="mr-2">
          Select Unit Number:
        </label>
        <select
          id="unitNumber"
          value={selectedUnitNumber}
          onChange={(e) => setSelectedUnitNumber(e.target.value)}
          className={`p-2 border rounded ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
        >
          <option value="">Select a unit number</option>
          {unitNumbers.map((unitNumber, index) => (
            <option key={index} value={unitNumber}>
              {unitNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Unit Configuration Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="unitConfiguration" className="mr-2">
          Select Unit Configuration:
        </label>
        <select
          id="unitConfiguration"
          value={selectedUnitConfiguration}
          onChange={(e) => setSelectedUnitConfiguration(e.target.value)}
          className={`p-2 border rounded ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
        >
          <option value="">Select a unit configuration</option>
          {unitConfigurations.map((unitConfiguration, index) => (
            <option key={index} value={unitConfiguration}>
              {unitConfiguration}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Name Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="customerName" className="mr-2">
          Select Customer Name:
        </label>
        <select
          id="customerName"
          value={selectedCustomerName}
          onChange={(e) => setSelectedCustomerName(e.target.value)}
          className={`p-2 border rounded ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
        >
          <option value="">Select a customer name</option>
          {customerNames.map((customerName, index) => (
            <option key={index} value={customerName}>
              {customerName}
            </option>
          ))}
        </select>
      </div>

      {/* Sold Flag Checkbox */}
      <div className="mb-4">
        <label htmlFor="soldFlag" className="mr-2">
          Sold:
        </label>
        <input
          type="checkbox"
          id="soldFlag"
          checked={soldFlag}
          onChange={(e) => setSoldFlag(e.target.checked)}
          className="mr-2"
        />
      </div>

      {data.map((row, rowIndex) => {
        // Calculate totals for Sales, Demand, and Received
        const calculateTotal = (prefix: string) => {
          const basePrice = parseFloat(row[`${prefix}BasePrice`]) || 0;
          const stampDuty = parseFloat(row[`${prefix}StampDutyAmount`]) || 0;
          const registrationAmount =
            parseFloat(row[`${prefix}RegistrationAmount`]) || 0;
          const otherCharges = parseFloat(row[`${prefix}OtherCharges`]) || 0;
          const passThroughCharges =
            parseFloat(row[`${prefix}PassThroughCharges`]) || 0;
          const taxesAmount = parseFloat(row[`${prefix}TaxesAmount`]) || 0;

          return (
            basePrice +
            stampDuty +
            registrationAmount +
            otherCharges +
            passThroughCharges +
            taxesAmount
          );
        };

        const salesTotal = calculateTotal("Sales");
        const demandTotal = calculateTotal("Demand");
        const receivedTotal = calculateTotal("Received");

        return (
          <div
            key={rowIndex}
            className="mb-6 p-4 shadow-lg rounded-lg bg-gray-100"
          >
            <div className="mb-4 grid grid-cols-3 gap-4">
              {/* Sold Checkbox */}
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
                />
              </div>
            </div>

            {/* 🟢 Unit Details */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                "UnitNumber",
                "UnitConfiguration",
                "UnitType",
                "CarpetAreaRR",
                "SaleableArea",
                "Floor",
                "UniqueUnitNumber",
              ].map((colName) => (
                <div key={colName} className="flex flex-col">
                  <label className="font-bold">
                    {colName.replace(/([A-Z])/g, " $1").trim()}:
                  </label>
                  <span className="p-1 border rounded">
                    {row[colName] || ""}
                  </span>
                </div>
              ))}
            </div>

            {/* 🔴 Lines Below Only Appear If SoldFlag is "Y" */}
            {row.SoldFlag?.trim().toUpperCase() === "Y" && (
              <>
                <div className="mb-2">
                  <h4 className="font-bold mb-2">Sale Details</h4>
                  <div className="grid grid-cols-7 gap-4">
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
                          {colName.replace(/([A-Z])/g, " $1").trim()}:
                          {[
                            "SalesBasePrice",
                            "SalesStampDutyAmount",
                            "SalesRegistrationAmount",
                          ].includes(colName) && (
                            <span className="text-red-700">*</span>
                          )}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={row[colName] || ""}
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              Math.max(0, parseFloat(e.target.value))
                            )
                          }
                          required={[
                            "SalesBasePrice",
                            "SalesStampDutyAmount",
                            "SalesRegistrationAmount",
                          ].includes(colName)}
                        />
                      </div>
                    ))}
                    <span className="font-bold self-center">
                      Total: {salesTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 🟡 Line 3: Demand Details */}
                <div className="mb-2">
                  <h4 className="font-bold mb-2">Demand Details</h4>
                  <div className="grid grid-cols-7 gap-4">
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
                          {colName.replace(/([A-Z])/g, " $1").trim()}:
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={row[colName] || ""}
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              Math.max(0, parseFloat(e.target.value))
                            )
                          }
                        />
                      </div>
                    ))}
                    <span className="font-bold self-center">
                      Total: {demandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 🟡 Line 4: Received Details */}
                <div className="mb-2">
                  <h4 className="font-bold mb-2">Received Details</h4>
                  <div className="grid grid-cols-7 gap-4">
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
                          {colName.replace(/([A-Z])/g, " $1").trim()}:
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={row[colName] || ""}
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              Math.max(0, parseFloat(e.target.value))
                            )
                          }
                        />
                      </div>
                    ))}
                    <span className="font-bold self-center">
                      Total: {receivedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Registered Flag Checkbox */}
                <div className="flex items-center">
                  <label className="w-40 font-bold">Registered?</label>
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
                  />
                </div>

                {/* Dates and Finance Details */}
                {row.RegisteredFlag?.trim().toUpperCase() === "Y" && (
                  <div className="mb-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <label className="font-bold">Registration Date:</label>
                        <span className="text-red-700">*</span>
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
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-2">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      "BookingDate",
                      "AllotmentLetterDate",
                      "AgreementDate",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {colName.replace(/([A-Z])/g, " $1").trim()}:
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
                          className="p-1 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🟢 Line 5: Customer Details */}
                <div className="mb-2">
                  <h4 className="font-bold mb-2">Customer Details:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      "CustomerName",
                      "CustomerKycAadhar",
                      "CustomerKycPan",
                      "CustomerKycMobile",
                      "CustomerKycEmail",
                      "CustomerKycAddress",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {colName.replace(/([A-Z])/g, " $1").trim()}:
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
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Source of Customer Dropdown */}
                <div className="mb-2">
                  <label className="font-bold">Source Of Customer:</label>
                  <select
                    value={row.SourceOfCustomer || ""}
                    onChange={(e) =>
                      handleChange(rowIndex, "SourceOfCustomer", e.target.value)
                    }
                    className="p-1 border rounded"
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
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      "ChannelPartnerName",
                      "ChannelPartnerMobile",
                      "ChannelPartnerEmail",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {colName.replace(/([A-Z])/g, " $1").trim()}:
                          <span className="text-red-700">*</span>
                        </label>
                        <input
                          type={
                            colName === "ChannelPartnerEmail" ? "email" : "text"
                          }
                          value={row[colName] || ""}
                          onChange={(e) =>
                            handleChange(rowIndex, colName, e.target.value)
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Mode of Finance Dropdown */}
                <div className="mb-2">
                  <label className="font-bold">Mode Of Finance:</label>
                  <select
                    value={row.ModeOfFinance || ""}
                    onChange={(e) =>
                      handleChange(rowIndex, "ModeOfFinance", e.target.value)
                    }
                    className="p-1 border rounded"
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
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className="font-bold">
                        Financial Institution Name:
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
                        className="p-1 border rounded"
                      />
                      required
                    </div>
                  </div>
                )}

                {/* NC Issued Flag Checkbox */}
                <div className="flex items-center">
                  <label className="w-40 font-bold">NC Issued?</label>
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
                  />
                </div>

                {/* NC Details */}
                {row.NcIssuedFlag?.trim().toUpperCase() === "Y" && (
                  <div className="mb-2">
                    <div className="grid grid-cols-3 gap-4">
                      {["NcNumber"].map((colName) => (
                        <div key={colName} className="flex flex-col">
                          <label className="font-bold">
                            {colName.replace(/([A-Z])/g, " $1").trim()}:
                            <span className="text-red-700">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={row[colName] || ""}
                            onChange={(e) =>
                              handleChange(
                                rowIndex,
                                colName,
                                Math.max(0, parseFloat(e.target.value))
                              )
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Plan Name Dropdown */}
                <div className="mb-2">
                  <label className="font-bold">Payment Plan Name:</label>
                  <select
                    value={row.PaymentPlanName || ""}
                    onChange={(e) =>
                      handleChange(rowIndex, "PaymentPlanName", e.target.value)
                    }
                    className="p-1 border rounded"
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 9 }, (_, i) => (
                      <option key={i} value={`CLP${i + 1}`}>
                        {`CLP${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="font-bold">Brokerage Amount:</label>
                    <input
                      type="number"
                      min="0"
                      value={row.BrokerageAmount || ""}
                      onChange={(e) =>
                        handleChange(
                          rowIndex,
                          "BrokerageAmount",
                          Math.max(0, parseFloat(e.target.value))
                        )
                      }
                      className={`p-1 border rounded ${
                        row.BrokerageAmount === "" ? "border-red-500" : ""
                      }`}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
}
