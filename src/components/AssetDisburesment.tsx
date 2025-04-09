import React, { useEffect, useState } from "react";

interface DisbursementRow {
  padr_dr_nmbr_n: number;
  padr_prjct_nmbr_n: number;
  padr_asst_nmbr_n: number;
  padr_ctgry_v: string;
  padr_sb_ctgry_v: string;
  padr_prty_nm_v: string;
  padr_prty_gstn_v: string;
  padr_prty_pan_v: string;
  padr_prty_eml_v: string;
  padr_prty_mbl_v: string;
  padr_rsn_v: string;
  padr_po_wo_v: string;
  padr_ttl_ordr_amnt_n: number;
  padr_dcmnt_typ_v: string;
  padr_prty_dcmnt_nmbr_v: string;
  padr_prty_dcmnt_dt_d: string;
  padr_prty_dcmnt_pybl_dys_n: number;
  padr_prty_dcmnt_amnt_n: number;
  padr_prty_dcmnt_gst_amnt_n: number;
  padr_prty_dcmnt_ttl_amnt_n: number;
  padr_prty_tds_amnt_n: number;
  padr_prty_advnc_adjstd_n: number;
  padr_prty_rtntn_amnt_n: number;
  padr_prty_othr_ddctn_amnt_n: number;
  padr_prty_pybl_amnt_n: number;
  padr_prty_otstndng_amnt_n: number;
  padr_brrwr_accnt_nmbr_v: string;
  padr_prty_bnk_nm_v: string;
  padr_prty_accnt_nm_v: string;
  padr_prty_accnt_nmbr_v: string;
  padr_prty_accnt_ifsc_v: string;
  padr_stts_c: string;
  padr_apprvd_amnt_n: number;
  padr_rfrnc_dr_nmbr_n: number;
  padr_rmrks_v: string;
  attachment_file_name: string;
}

const columnHeaders: { [key in keyof Omit<DisbursementRow, 'attachment_content_type'>]: string } = Object.freeze({
  padr_dr_nmbr_n: "Serial No.",
  padr_prjct_nmbr_n: "Project Number",
  padr_asst_nmbr_n: "Asset Number",
  padr_ctgry_v: "Category",
  padr_sb_ctgry_v: "Sub-Category",
  padr_prty_nm_v: "Party Name",
  padr_prty_gstn_v: "GSTN",
  padr_prty_pan_v: "PAN",
  padr_prty_eml_v: "Email",
  padr_prty_mbl_v: "Mobile",
  padr_rsn_v: "Reason",
  padr_po_wo_v: "PO/WO",
  padr_ttl_ordr_amnt_n: "Total Order Amount",
  padr_dcmnt_typ_v: "Document Type",
  padr_prty_dcmnt_nmbr_v: "Document Number",
  padr_prty_dcmnt_dt_d: "Document Date",
  padr_prty_dcmnt_pybl_dys_n: "Payable Days",
  padr_prty_dcmnt_amnt_n: "Document Amount",
  padr_prty_dcmnt_gst_amnt_n: "GST Amount",
  padr_prty_dcmnt_ttl_amnt_n: "Total Document Amount",
  padr_prty_tds_amnt_n: "TDS Amount",
  padr_prty_advnc_adjstd_n: "Advance Adjusted",
  padr_prty_rtntn_amnt_n: "Retention Amount",
  padr_prty_othr_ddctn_amnt_n: "Other Deductions",
  padr_prty_pybl_amnt_n: "Payable Amount",
  padr_prty_otstndng_amnt_n: "Outstanding Amount",
  padr_brrwr_accnt_nmbr_v: "Borrower Account No.",
  padr_prty_bnk_nm_v: "Bank Name",
  padr_prty_accnt_nm_v: "Account Holder",
  padr_prty_accnt_nmbr_v: "Account Number",
  padr_prty_accnt_ifsc_v: "IFSC Code",
  padr_stts_c: "Status",
  padr_apprvd_amnt_n: "Approved Amount",
  padr_rfrnc_dr_nmbr_n: "Reference DR No.",
  padr_rmrks_v: "Remarks",
  attachment_file_name: "Attachment File",
});

const DisbursementTable: React.FC = () => {
  const [rows, setRows] = useState<DisbursementRow[]>([]);
  const [projectNumber, setProjectNumber] = useState<number>(0);

  const createInitialRow = (projectNum: number, serial: number): DisbursementRow => {
    const initial: any = {}; // using 'any' internally for construction

    (Object.keys(columnHeaders) as (keyof Omit<DisbursementRow, 'attachment_content_type'>)[]).forEach((key) => {
      if (key === "padr_dr_nmbr_n") {
        initial[key] = serial;
      } else if (key === "padr_prjct_nmbr_n") {
        initial[key] = projectNum;
      } else if (key.includes("_dt_")) {
        initial[key] = ""; // or use current date string: new Date().toISOString().split("T")[0]
      } else if (typeof ({} as DisbursementRow)[key] === "number") {
        initial[key] = 0;
      } else {
        initial[key] = "";
      }
    });

    return initial as DisbursementRow;
  };

  useEffect(() => {
    let stored = localStorage.getItem("projectNumber");
    if (!stored) {
      stored = "123456";
      localStorage.setItem("projectNumber", stored);
    }
    const num = Number(stored);
    setProjectNumber(num);
    setRows([createInitialRow(num, 1)]);
  }, []);

  const handleInputChange = <
    K extends keyof Omit<DisbursementRow, 'attachment_content_type'>
  >(
    rowIndex: number,
    field: K,
    value: string | File
  ) => {
    const updated = [...rows];
    const fieldType = typeof updated[rowIndex][field];

    updated[rowIndex] = {
      ...updated[rowIndex],
      [field]: fieldType === "number" ? Number(value) : value,
    };

    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, createInitialRow(projectNumber, rows.length + 1)]);
  };

  const deleteRow = () => {
    if (rows.length > 1) setRows(rows.slice(0, -1));
  };

  const handleSubmit = (row: DisbursementRow, index: number) => {
    console.log(`Submitting row ${index + 1}:`, row);
  };

  const headers = Object.keys(columnHeaders) as (keyof Omit<DisbursementRow, 'attachment_content_type'>)[];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[2000px] w-full table-auto border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th key={header} className="text-center px-4 py-2 min-w-[160px] border font-medium">
                {columnHeaders[header]}
              </th>
            ))}
            <th className="text-center px-4 py-2 min-w-[120px] border font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {headers.map((field) => (
                <td key={field} className="px-4 py-2 min-w-[160px] border">
                  {field === "attachment_file_name" ? (
                    <input
                      type="file"
                      onChange={(e) => handleInputChange(rowIndex, field, e.target.files?.[0] || "")}
                      className="w-full px-2 py-1 rounded border text-center text-sm bg-white"
                    />
                  ) : (
                    <input
                      type={typeof row[field] === "number" ? "number" : field.includes("_dt_") ? "date" : "text"}
                      value={row[field]}
                      readOnly={field === "padr_prjct_nmbr_n" || field === "padr_dr_nmbr_n"}
                      onChange={(e) => handleInputChange(rowIndex, field, e.target.value)}
                      className={`w-full px-2 py-1 rounded border text-center text-sm ${
                        field === "padr_prjct_nmbr_n" || field === "padr_dr_nmbr_n"
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  )}
                </td>
              ))}
              <td className="px-4 py-2 min-w-[120px] border text-center">
                <button
                  onClick={() => handleSubmit(row, rowIndex)}
                  className="bg-[#00134B] hover:bg-[#00134B]/90 text-white px-3 py-1 rounded"
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={addRow}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <span className="text-white text-lg font-bold">+</span> Add Row
        </button>

        <button
          type="button"
          onClick={deleteRow}
          disabled={rows.length <= 1}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            rows.length <= 1
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          <span className="text-white text-xl font-bold">&times;</span> Delete Row
        </button>
      </div>
    </div>
  );
};

export default DisbursementTable;