import { useState, useEffect } from "react";
import { newAssetSale } from "../types";
import endpoints from "../endpoints";

// Define an interface for the column names mapping
interface ColumnNames {
  [key: string]: string;
}

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
  const [selectedUnitConfiguration, setSelectedUnitConfiguration] =
    useState<string>("");
  const [customerNames, setCustomerNames] = useState<string[]>([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  const [soldFlag, setSoldFlag] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [yearMonth, setYearMonth] = useState<string>("");
  const [projectNumber, setProjectNumber] = useState<string | null>(null);
  const userRole = localStorage.getItem("role");

  const columnNames: ColumnNames = {
    UnitNumber: "Unit No.",
    UnitConfiguration: "Unit Config.",
    UnitType: "Unit Type",
    CarpetAreaRR: "Carpet Area (RR)",
    SaleableArea: "Saleable Area",
    Floor: "Floor",
    SalesBasePrice: "Base Price",
    SalesStampDutyAmount: "Stamp Duty",
    SalesRegistrationAmount: "Registration Amount",
    SalesOtherCharges: "Other Charges",
    SalesPassThroughCharges: "Pass-Through Charges",
    SalesTaxesAmount: "Taxes",
    DemandBasePrice: "Base Price",
    DemandStampDuty: "Stamp Duty",
    DemandRegistrationAmount: "Registration Amount",
    DemandOtherCharges: "Other Charges",
    DemandPassThroughCharges: "Pass-Through Charges",
    DemandTaxesAmount: "Taxes",
    ReceivedBasePrice: "Base Price",
    ReceivedStampDutyAmount: "Stamp Duty",
    ReceivedRegistrationAmount: "Registration Amount",
    ReceivedOtherCharges: "Other Charges",
    ReceivedPassThroughCharges: "Pass-Through Charges",
    ReceivedTaxesAmount: "Taxes",
    RegistrationDate: "Registration Date",
    CustomerName: "Name",
    CustomerKycAadhar: "Aadhar",
    CustomerKycPan: "PAN",
    CustomerKycMobile: "Mobile",
    CustomerKycEmail: "Email",
    CustomerKycAddress: "Address",
    SourceOfCustomer: "Source of Customer",
    ChannelPartnerName: "Channel Partner Name",
    ChannelPartnerMobile: "Channel Partner Mobile",
    ChannelPartnerEmail: "Channel Partner Email",
    NcNumber: "NOC Number",
    PaymentPlanName: "Payment Plan",
    ModeOfFinance: "Mode of Finance",
    FinancialInstitutionName: "Financial Institution",
    BrokerageAmount: "Brokerage Amount",
    BookingDate: "Booking Date",
    AllotmentLetterDate: "Allotment Letter Date",
    AgreementDate: "Agreement Date",
  };

  // Initialize yearMonth and projectNumber from localStorage if available
  useEffect(() => {
    const storedYearMonth = localStorage.getItem("yearMonth");
    const storedProjectNumber = localStorage.getItem("projectNumber");
    if (storedYearMonth) {
      setYearMonth(storedYearMonth);
    }
    if (storedProjectNumber) {
      setProjectNumber(storedProjectNumber);
    }
  }, []);

  useEffect(() => {
    if (!projectNumber || !yearMonth) return;

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
        if (fetchedData && Array.isArray(fetchedData.buildings)) {
          setBuildings(fetchedData.buildings);
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
          console.log("Storing uniqueUnitNumbers:", uniqueUnitNumbers);
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
    if (["Arbour", "PME", "Trustee"].includes(userRole || "")) {
      return;
    }

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

    // Validate input values
    if (key.includes("BasePrice")) {
      const basePrice = parseFloat(value as string);
      const stampDutyKey = key.replace("BasePrice", "StampDutyAmount");
      const registrationKey = key.replace("BasePrice", "RegistrationAmount");

      if (updatedData[index][stampDutyKey] > basePrice) {
        updatedData[index][stampDutyKey] = basePrice;
      }
      if (updatedData[index][registrationKey] > updatedData[index][stampDutyKey]) {
        updatedData[index][registrationKey] = updatedData[index][stampDutyKey];
      }
    }

    if (key.includes("StampDuty")) {
      const stampDuty = parseFloat(value as string);
      const basePriceKey = key.replace("StampDuty", "BasePrice");
      const registrationKey = key.replace("StampDuty", "RegistrationAmount");

      if (updatedData[index][basePriceKey] < stampDuty) {
        updatedData[index][basePriceKey] = stampDuty;
      }
      if (updatedData[index][registrationKey] > stampDuty) {
        updatedData[index][registrationKey] = stampDuty;
      }
    }

    if (key.includes("RegistrationAmount")) {
      const registrationAmount = parseFloat(value as string);
      const stampDutyKey = key.replace("RegistrationAmount", "StampDutyAmount");

      if (updatedData[index][stampDutyKey] < registrationAmount) {
        updatedData[index][stampDutyKey] = registrationAmount;
      }
    }

    // Ensure demand base price is less than or equal to sales base price
    if (key === "DemandBasePrice") {
      const demandBasePrice = parseFloat(value as string);
      if (demandBasePrice > updatedData[index]["SalesBasePrice"]) {
        updatedData[index]["DemandBasePrice"] = updatedData[index]["SalesBasePrice"];
      }
    }

    // Ensure received base price is less than or equal to demand base price
    if (key === "ReceivedBasePrice") {
      const receivedBasePrice = parseFloat(value as string);
      if (receivedBasePrice > updatedData[index]["DemandBasePrice"]) {
        updatedData[index]["ReceivedBasePrice"] = updatedData[index]["DemandBasePrice"];
      }
    }

    // Update the state with the new data
    setData(updatedData);
    setUpdateStatus(null); // Clear any previous status when editing starts
  };

  const calculateTotal = (row: any, prefix: string) => {
    const basePrice = parseFloat(row[`${prefix}BasePrice`]) || 0;
    const stampDuty = parseFloat(row[`${prefix}StampDutyAmount`]) || 0;
    const registrationAmount = parseFloat(row[`${prefix}RegistrationAmount`]) || 0;
    const otherCharges = parseFloat(row[`${prefix}OtherCharges`]) || 0;
    const passThroughCharges = parseFloat(row[`${prefix}PassThroughCharges`]) || 0;
    const taxesAmount = parseFloat(row[`${prefix}TaxesAmount`]) || 0;

    return basePrice + stampDuty + registrationAmount + otherCharges + passThroughCharges + taxesAmount;
  };

  const handleSubmit = async () => {
    setUpdateStatus("Updating...");

    let allUpdatesSuccessful = true;
    const uniqueUnitNumbers = JSON.parse(
      localStorage.getItem(
        `uniqueUnitNumbers_${projectNumber}_${yearMonth}_${selectedBuilding}`
      ) || "[]"
    );

    console.log("Retrieved uniqueUnitNumbers:", uniqueUnitNumbers);

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

  const handleSubmitApproval = () => {
    // Placeholder for approve functionality
    console.log("Submit button clicked");
  };

  const handleApprove = () => {
    // Placeholder for approve functionality
    console.log("Approve button clicked");
  };

  const handleReject = () => {
    // Placeholder for reject functionality
    console.log("Reject button clicked");
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

      {/* Unit Number Search Box */}
      <div className="mb-4">
        <label htmlFor="unitNumber" className="mr-2">
          Search Unit Number:
        </label>
        <input
          type="text"
          id="unitNumber"
          value={selectedUnitNumber}
          onChange={(e) => setSelectedUnitNumber(e.target.value)}
          className={`p-1 border rounded ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
          placeholder="Search unit number..."
        />
      </div>

      {/* Unit Configuration Search Box */}
      <div className="mb-4">
        <label htmlFor="unitConfiguration" className="mr-2">
          Search Unit Configuration:
        </label>
        <input
          type="text"
          id="unitConfiguration"
          value={selectedUnitConfiguration}
          onChange={(e) => setSelectedUnitConfiguration(e.target.value)}
          className={`p-1 border rounded ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
          placeholder="Search unit configuration..."
        />
      </div>

      {/* Customer Name Search Box and Sold Flag Checkbox */}
      <div className="mb-4 flex items-center">
        <label htmlFor="customerName" className="mr-2">
          Search Customer Name:
        </label>
        <input
          type="text"
          id="customerName"
          value={selectedCustomerName}
          onChange={(e) => setSelectedCustomerName(e.target.value)}
          className={`p-1 border rounded ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
          placeholder="Search customer name..."
        />
        <label htmlFor="soldFlag" className="ml-4 mr-2">
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
            <div className="mb-4 grid grid-cols-5 gap-4">
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
                  <span className="p-1 rounded">{row[colName] || ""}</span>
                </div>
              ))}
            </div>

            {/* 🔴 Lines Below Only Appear If SoldFlag is "Y" */}
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
                          type="number"
                          min="0"
                          value={row[colName] || ""}
                          max={
                            colName === "SalesStampDutyAmount"
                              ? row["SalesBasePrice"]
                              : colName === "SalesRegistrationAmount"
                              ? row["SalesStampDutyAmount"]
                              : undefined
                          }
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              Math.max(0, parseFloat(e.target.value)).toString()
                            )
                          }
                          required={[
                            "SalesBasePrice",
                            "SalesStampDutyAmount",
                            "SalesRegistrationAmount",
                          ].includes(colName)}
                          className="p-1 border rounded"
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
                          type="number"
                          min="0"
                          value={row[colName] || ""}
                          max={
                            colName === "DemandStampDuty"
                              ? row["DemandBasePrice"]
                              : colName === "DemandRegistrationAmount"
                              ? row["DemandStampDuty"]
                              : undefined
                          }
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              Math.max(0, parseFloat(e.target.value)).toString()
                            )
                          }
                          className="p-1 border rounded"
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
                          type="number"
                          min="0"
                          value={row[colName] || ""}
                          max={
                            colName === "ReceivedStampDutyAmount"
                              ? row["ReceivedBasePrice"]
                              : colName === "ReceivedRegistrationAmount"
                              ? row["ReceivedStampDutyAmount"]
                              : undefined
                          }
                          onChange={(e) =>
                            handleChange(
                              rowIndex,
                              colName,
                              Math.max(0, parseFloat(e.target.value)).toString()
                            )
                          }
                          className="p-1 border rounded"
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
                    <div className="grid grid-cols-5 gap-4">
                      <div className="flex flex-col">
                        <label className="font-bold">
                          {columnNames["RegistrationDate"]}:
                        </label>
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
                          className="p-1 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-2">
                  <div className="grid grid-cols-5 gap-4">
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
                          className="p-1 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🟢 Line 5: Customer Details */}
                <div className="mb-2">
                  <h4 className="font-bold mb-2">Customer Details:</h4>
                  <div className="grid grid-cols-5 gap-4">
                    {/* First Line: Customer Name and Address */}
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
                        className="p-1 border rounded"
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
                        className="p-1 border rounded"
                      />
                    </div>

                    {/* Second Line: Remaining Fields */}
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
                          className="p-1 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source of Customer Dropdown */}
                <div className="mb-2">
                  <label className="font-bold">
                    {columnNames["SourceOfCustomer"]}:
                  </label>
                  <select
                    value={
                      row.SourceOfCustomer ? row.SourceOfCustomer.trim() : ""
                    }
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
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {[
                      "ChannelPartnerName",
                      "ChannelPartnerMobile",
                      "ChannelPartnerEmail",
                    ].map((colName) => (
                      <div key={colName} className="flex flex-col">
                        <label className="font-bold">
                          {columnNames[colName]}:
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
                          className="p-1 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Mode of Finance Dropdown */}
                <div className="mb-2">
                  <label className="font-bold">
                    {columnNames["ModeOfFinance"]}:
                  </label>
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
                  <div className="grid grid-cols-5 gap-4 mb-4">
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
                    <div className="grid grid-cols-5 gap-4">
                      {["NcNumber"].map((colName) => (
                        <div key={colName} className="flex flex-col">
                          <label className="font-bold">
                            {columnNames[colName]}:
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
                                Math.max(0, parseFloat(e.target.value)).toString()
                              )
                            }
                            required
                            className="p-1 border rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Plan Name Dropdown */}
                <div className="mb-2">
                  <label className="font-bold">
                    {columnNames["PaymentPlanName"]}:
                  </label>
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

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="font-bold">
                      {columnNames["BrokerageAmount"]}:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={row.BrokerageAmount || ""}
                      onChange={(e) =>
                        handleChange(
                          rowIndex,
                          "BrokerageAmount",
                          Math.max(0, parseFloat(e.target.value)).toString()
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

      {/* Save Button for Borrower Role */}
      {userRole === "Borrower" && (
        <div className="mt4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Save
          </button>
          <button
            onClick={handleSubmitApproval}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      )}

      {/* Approve and Reject Buttons for Arbour or PME roles */}
      {(userRole === "Arbour" || userRole === "PME") && (
        <div className="mt-4">
          <button
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
