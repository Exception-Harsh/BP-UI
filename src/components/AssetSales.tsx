// import { useState, useEffect } from "react";
// import { AssetSale } from "../types";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const columnNames = [
//   "YearMonth",
//   "ProjectNumber",
//   "AssetNumber",
//   "Phase",
//   "Building",
//   "Floor",
//   "UnitNumber",
//   "UnitConfiguration",
//   "UnitType",
//   "SaleableArea",
//   "CarpetArea",
//   "CarpetAreaRR",
//   "UniqueUnitNumber",
//   "Owner",
//   "SoldFlat",
//   "RegisteredFlag",
//   "RegistrationDate",
//   "BookingDate",
//   "AllotmentLetterDate",
//   "AgreementDate",
//   "CustomerName",
//   "CustomerKYCAadhar",
//   "CustomerKYCPAN",
//   "CustomerKYCMobile",
//   "CustomerKYCEmail",
//   "CustomerKYCAddress",
//   "NCIssuedFlag",
//   "NCNumber",
//   "SalesBasePrice",
//   "SalesStampDutyAmount",
//   "SalesRegistrationAmount",
//   "SalesOtherCharges",
//   "SalesPassThroughCharges",
//   "SalesTaxesAmount",
//   "SalesTotalAmount",
//   "DemandBasePrice",
//   "DemandStampDuty",
//   "DemandRegistrationAmount",
//   "DemandOtherCharges",
//   "DemandPassThroughCharges",
//   "DemandTaxesAmount",
//   "DemandTotalAmount",
//   "ReceivedBasePrice",
//   "ReceivedStampDutyAmount",
//   "ReceivedRegistrationAmount",
//   "ReceivedOtherCharges",
//   "ReceivedPassThroughCharges",
//   "ReceivedTaxesAmount",
//   "ReceivedTotalAmount",
// ];

// const columnMappings: Record<string, keyof AssetSale> = {
//   "YearMonth": "YearMonth",
//   "ProjectNumber": "ProjectNumber",
//   "AssetNumber": "AssetNumber",
//   "Phase": "Phase",
//   "Building": "Building",
//   "Floor": "Floor",
//   "UnitNumber": "UnitNumber",
//   "UnitConfiguration": "UnitConfiguration",
//   "Unit Type": "UnitType",
//   "Saleable Area": "SaleableArea",
//   "Carpet Area": "CarpetArea",
//   "Carpet Area RR": "CarpetAreaRR",
//   "Unique Unit Number": "UniqueUnitNumber",
//   "Owner": "Owner",
//   "Sold Flat": "SoldFlat",
//   "Registered Flag": "RegisteredFlag",
//   "Registration Date": "RegistrationDate",
//   "Booking Date": "BookingDate",
//   "Allotment Letter Date": "AllotmentLetterDate",
//   "Agreement Date": "AgreementDate",
//   "Customer Name": "CustomerName",
//   "Customer KYC Aadhar": "CustomerKycAadhar",
//   "Customer KYC PAN": "CustomerKycPan",
//   "Customer KYC Mobile": "CustomerKycMobile",
//   "Customer KYC Email": "CustomerKycEmail",
//   "Customer KYC Address": "CustomerKycAddress",
//   "NC Issued Flag": "NcIssuedFlag",
//   "NC Number": "NcNumber",
//   "Sales Base Price": "SalesBasePrice",
//   "Sales Stamp Duty Amount": "SalesStampDutyAmount",
//   "Sales Registration Amount": "SalesRegistrationAmount",
//   "Sales Other Charges": "SalesOtherCharges",
//   "Sales Pass Through Charges": "SalesPassThroughCharges",
//   "Sales Taxes Amount": "SalesTaxesAmount",
//   "Sales Total Amount": "SalesTotalAmount",
//   "Demand Base Price": "DemandBasePrice",
//   "Demand Stamp Duty": "DemandStampDuty",
//   "Demand Registration Amount": "DemandRegistrationAmount",
//   "Demand Other Charges": "DemandOtherCharges",
//   "Demand Pass Through Charges": "DemandPassThroughCharges",
//   "Demand Taxes Amount": "DemandTaxesAmount",
//   "Demand Total Amount": "DemandTotalAmount",
//   "Received Base Price": "ReceivedBasePrice",
//   "Received Stamp Duty Amount": "ReceivedStampDutyAmount",
//   "Received Registration Amount": "ReceivedRegistrationAmount",
//   "Received Other Charges": "ReceivedOtherCharges",
//   "Received Pass Through Charges": "ReceivedPassThroughCharges",
//   "Received Taxes Amount": "ReceivedTaxesAmount",
//   "Received Total Amount": "ReceivedTotalAmount"
// };

// export default function AssetSalesComponent({
//   isDarkMode,
// }: {
//   isDarkMode: boolean;
// }) {
//   const [data, setData] = useState<AssetSale[]>([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const rowsPerPage = 50;
//   const projectNumber = localStorage.getItem("projectNumber");

//   useEffect(() => {
//     if (!projectNumber) return;

//     fetch(`https://localhost:44341/api/assetsales/${projectNumber}`)
//       .then((response) => response.json())
//       .then((fetchedData) => {
//         console.log("Fetched data:", fetchedData);

//         if (Array.isArray(fetchedData.data)) {
//           setData(fetchedData.data);
//         } else {
//           console.error("Fetched data does not contain an array:", fetchedData);
//           setData([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching asset sales data:", error);
//         setData([]);
//       });
//   }, [projectNumber]);

//   // const handleChange = (index: number, key: string, value: string | number | boolean) => {
//   //   const updatedData = [...data];
//   //   updatedData[index] = { ...updatedData[index], [key]: value };
//   //   setData(updatedData);
//   // };

//   const handleChange = (
//     index: number,
//     key: string,
//     value: string | number | boolean
//   ) => {
//     const updatedData = [...data];
//     updatedData[index] = { ...updatedData[index], [key]: value };
//     setData(updatedData);
//   };
  
//   const handleSubmit = () => {
//     fetch("https://localhost:44341/api/assetsales/update", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((result) => alert(result.message || "Update successful"))
//       .catch((error) => console.error("Error updating asset sales:", error));
//   };

//   return (
//     <div
//       className={`p-6 shadow-lg rounded-lg ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
//       }`}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
//             disabled={currentPage === 0}
//             className={`p-2 rounded ${
//               isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//             } disabled:opacity-50`}
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span>Page {currentPage + 1}</span>
//           <button
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//             disabled={(currentPage + 1) * rowsPerPage >= data.length}
//             className={`p-2 rounded ${
//               isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//             } disabled:opacity-50`}
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//         <button
//           onClick={handleSubmit}
//           className={`px-4 py-2 rounded ${
//             isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//           }`}
//         >
//           Submit
//         </button>
//       </div>
//       <div className="overflow-auto w-full">
//         <table className="min-w-max border rounded-md table-auto">
//           <thead>
//             <tr
//               className={
//                 isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
//               }
//             >
//               {columnNames.map((col) => (
//                 <th key={col} className="border p-2 text-left">
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data
//               .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
//               .map((row, rowIndex) => (
//                 <tr
//                   key={rowIndex}
//                   className={isDarkMode ? "bg-gray-800" : "bg-white"}
//                 >
//                   {columnNames.map((col, colIndex) => (
//                     <td key={colIndex} className="border p-2">

//                     {col === "Sold Flat" || col === "NC Issued Flag" ? (
//                       <input
//                         type="checkbox"
//                         checked={row[col as keyof AssetSale] === "true"}
//                         onChange={e => handleChange(rowIndex, col as keyof AssetSale, e.target.checked ? "true" : "false")}
//                       />
//                     ) : (
//                       <input
//                         type="text"
//                         value={row[col as keyof AssetSale] || ""}
//                         onChange={e => handleChange(rowIndex, col as keyof AssetSale, e.target.value)}
//                         className={`w-full p-1 border rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
//                         disabled={colIndex < 14}
//                       />
//                     )}
//                   </td>                  
//                   ))}
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
