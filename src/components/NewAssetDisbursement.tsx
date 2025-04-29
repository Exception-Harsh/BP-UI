import React, { useState, useEffect } from 'react';
import { NewDisbursementRequest } from '../types';
import axios from 'axios';
import endpoints from '../endpoints';

const NewAssetDisbursement: React.FC = () => {
  const [requests, setRequests] = useState<NewDisbursementRequest[]>([
    {
      ProjectNumber: 0,
      AssetNumber: 0,
      Category: '',
      SubCategory: '',
      PartyName: '',
      PartyGSTIN: '',
      PartyPAN: '',
      PartyEmail: '',
      PartyMobile: '',
      Reason: '',
      PurchaseOrder: '',
      TotalOrderAmount: 0,
      DocumentType: '',
      PartyDocumentNumber: '',
      PartyDocumentDate: new Date(),
      PartyDocumentPayableDays: 0,
      PartyDocumentAmount: 0,
      PartyDocumentGSTAmount: 0,
      PartyDocumentTotalAmount: 0,
      PartyTDSAmount: 0,
      PartyAdvanceAdjusted: 0,
      PartyRetentionAmount: 0,
      PartyOtherDeductionAmount: 0,
      PartyPayableAmount: 0,
      PartyOutstandingAmount: 0,
      BorrowerAccountNumber: '',
      PartyBankName: '',
      PartyAccountName: '',
      PartyAccountNumber: '',
      PartyAccountIFSC: '',
      Status: '',
      ApprovedAmount: 0,
      ReferenceDRNumber: 0,
      Remarks: '',
      AttachmentReference: '',
      CreatedBy: '',
      LastModifiedBy: '',
    },
  ]);

  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${endpoints.category}`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const subCategoryPromises = categories.map(async (category) => {
          const response = await axios.get(`${endpoints.subcategory}?category=${category}`);
          return { category, subCategories: response.data };
        });

        const subCategoryResults = await Promise.all(subCategoryPromises);
        const subCategoryMap = subCategoryResults.reduce((acc, { category, subCategories }) => {
          acc[category] = subCategories;
          return acc;
        }, {} as { [key: string]: string[] });

        setSubCategories(subCategoryMap);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    if (categories.length > 0) {
      fetchSubCategories();
    }
  }, [categories]);

  useEffect(() => {
    const rememberedCredentials = localStorage.getItem('rememberedCredentials');
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

  const handleInputChange = (index: number, field: keyof NewDisbursementRequest, value: string | number | Date) => {
    const newRequests = [...requests];

    if (
      field === 'ProjectNumber' ||
      field === 'AssetNumber' ||
      field === 'PartyDocumentPayableDays' ||
      field === 'PartyDocumentAmount' ||
      field === 'PartyDocumentGSTAmount' ||
      field === 'PartyDocumentTotalAmount' ||
      field === 'PartyTDSAmount' ||
      field === 'PartyAdvanceAdjusted' ||
      field === 'PartyRetentionAmount' ||
      field === 'PartyOtherDeductionAmount' ||
      field === 'PartyPayableAmount' ||
      field === 'PartyOutstandingAmount' ||
      field === 'ApprovedAmount' ||
      field === 'ReferenceDRNumber'
    ) {
      newRequests[index][field] = Number(value) as never;
    } else if (field === 'PartyDocumentDate') {
      newRequests[index][field] = new Date(value) as never;
    } else {
      newRequests[index][field] = value as never;
    }

    setRequests(newRequests);
  };

  const handleSubmit = async (index: number) => {
    try {
      const projectNumber = localStorage.getItem('projectNumber');
      console.log(projectNumber);

      if (!projectNumber) {
        alert('Project number not found in localStorage');
        return;
      }

      const response = await axios.post(`${endpoints.disbursement}/${projectNumber}`, requests[index]);
      alert('Insert successful');
    } catch (error) {
      console.error('Error inserting asset disbursement request:', error);
      alert('Error inserting asset disbursement request');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Asset Disbursement</h1>
      <div className="bg-white w-full overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Asset Number</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Sub Category</th>
              <th className="py-2 px-4 border-b">Party Name</th>
              <th className="py-2 px-4 border-b">Party GSTIN</th>
              <th className="py-2 px-4 border-b">Party PAN</th>
              <th className="py-2 px-4 border-b">Party Email</th>
              <th className="py-2 px-4 border-b">Party Mobile</th>
              <th className="py-2 px-4 border-b">Reason</th>
              <th className="py-2 px-4 border-b">Purchase Order</th>
              <th className="py-2 px-4 border-b">Total Order Amount</th>
              <th className="py-2 px-4 border-b">Document Type</th>
              <th className="py-2 px-4 border-b">Party Document Number</th>
              <th className="py-2 px-4 border-b">Party Document Date</th>
              <th className="py-2 px-4 border-b">Party Document Payable Days</th>
              <th className="py-2 px-4 border-b">Party Document Amount</th>
              <th className="py-2 px-4 border-b">Party Document GST Amount</th>
              <th className="py-2 px-4 border-b">Party Document Total Amount</th>
              <th className="py-2 px-4 border-b">Party TDS Amount</th>
              <th className="py-2 px-4 border-b">Party Advance Adjusted</th>
              <th className="py-2 px-4 border-b">Party Retention Amount</th>
              <th className="py-2 px-4 border-b">Party Other Deduction Amount</th>
              <th className="py-2 px-4 border-b">Party Payable Amount</th>
              <th className="py-2 px-4 border-b">Party Outstanding Amount</th>
              <th className="py-2 px-4 border-b">Borrower Account Number</th>
              <th className="py-2 px-4 border-b">Party Bank Name</th>
              <th className="py-2 px-4 border-b">Party Account Name</th>
              <th className="py-2 px-4 border-b">Party Account Number</th>
              <th className="py-2 px-4 border-b">Party Account IFSC</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Approved Amount</th>
              <th className="py-2 px-4 border-b">Reference DR Number</th>
              <th className="py-2 px-4 border-b">Remarks</th>
              <th className="py-2 px-4 border-b">Attachment Reference</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.AssetNumber}
                    onChange={(e) => handleInputChange(index, 'AssetNumber', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={request.Category}
                    onChange={(e) => handleInputChange(index, 'Category', e.target.value)}
                    className="border p-2 w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={request.SubCategory}
                    onChange={(e) => handleInputChange(index, 'SubCategory', e.target.value)}
                    className="border p-2 w-full"
                    disabled={!request.Category}
                  >
                    <option value="">Select SubCategory</option>
                    {request.Category && subCategories[request.Category]
                      ? subCategories[request.Category].map((subCategory) => (
                          <option key={subCategory} value={subCategory}>
                            {subCategory}
                          </option>
                        ))
                      : null}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyName}
                    onChange={(e) => handleInputChange(index, 'PartyName', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyGSTIN}
                    onChange={(e) => handleInputChange(index, 'PartyGSTIN', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyPAN}
                    onChange={(e) => handleInputChange(index, 'PartyPAN', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyEmail}
                    onChange={(e) => handleInputChange(index, 'PartyEmail', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyMobile}
                    onChange={(e) => handleInputChange(index, 'PartyMobile', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.Reason}
                    onChange={(e) => handleInputChange(index, 'Reason', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PurchaseOrder}
                    onChange={(e) => handleInputChange(index, 'PurchaseOrder', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.TotalOrderAmount}
                    onChange={(e) => handleInputChange(index, 'TotalOrderAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={request.DocumentType}
                    onChange={(e) => handleInputChange(index, 'DocumentType', e.target.value)}
                    className="border p-2 w-full"
                  >
                    <option value="">Select Document Type</option>
                    <option value="INVOICE">INVOICE</option>
                    <option value="PI">PI</option>
                    <option value="ADVANCE">ADVANCE</option>
                    <option value="DN">DN</option>
                    <option value="CN">CN</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyDocumentNumber}
                    onChange={(e) => handleInputChange(index, 'PartyDocumentNumber', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="date"
                    value={request.PartyDocumentDate.toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange(index, 'PartyDocumentDate', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyDocumentPayableDays}
                    onChange={(e) => handleInputChange(index, 'PartyDocumentPayableDays', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyDocumentAmount}
                    onChange={(e) => handleInputChange(index, 'PartyDocumentAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyDocumentGSTAmount}
                    onChange={(e) => handleInputChange(index, 'PartyDocumentGSTAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyDocumentTotalAmount}
                    onChange={(e) => handleInputChange(index, 'PartyDocumentTotalAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyTDSAmount}
                    onChange={(e) => handleInputChange(index, 'PartyTDSAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyAdvanceAdjusted}
                    onChange={(e) => handleInputChange(index, 'PartyAdvanceAdjusted', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyRetentionAmount}
                    onChange={(e) => handleInputChange(index, 'PartyRetentionAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyOtherDeductionAmount}
                    onChange={(e) => handleInputChange(index, 'PartyOtherDeductionAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyPayableAmount}
                    onChange={(e) => handleInputChange(index, 'PartyPayableAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.PartyOutstandingAmount}
                    onChange={(e) => handleInputChange(index, 'PartyOutstandingAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.BorrowerAccountNumber}
                    onChange={(e) => handleInputChange(index, 'BorrowerAccountNumber', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyBankName}
                    onChange={(e) => handleInputChange(index, 'PartyBankName', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyAccountName}
                    onChange={(e) => handleInputChange(index, 'PartyAccountName', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyAccountNumber}
                    onChange={(e) => handleInputChange(index, 'PartyAccountNumber', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.PartyAccountIFSC}
                    onChange={(e) => handleInputChange(index, 'PartyAccountIFSC', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.Status}
                    onChange={(e) => handleInputChange(index, 'Status', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.ApprovedAmount}
                    onChange={(e) => handleInputChange(index, 'ApprovedAmount', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={request.ReferenceDRNumber}
                    onChange={(e) => handleInputChange(index, 'ReferenceDRNumber', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.Remarks}
                    onChange={(e) => handleInputChange(index, 'Remarks', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={request.AttachmentReference}
                    onChange={(e) => handleInputChange(index, 'AttachmentReference', e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleSubmit(index)}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewAssetDisbursement;