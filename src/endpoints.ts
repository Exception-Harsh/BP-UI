const domain = "https://localhost:44341/api";

const endpoints = {
    project: domain + "/project",
    sales: domain + "/assetsales/",
    login: domain + "/login",
    update: domain + "/assetsales/update/",
    yearmonth: domain + "/assetsales/nextyearmonth/",
    workflow: domain + "/assetsales/workflow/",
    projectheader: domain + "/assetsales/hdr/",
    updateProjecthdr: domain + "/assetsales/updatehdr",
    disbursement: domain + "/assetdisbursement/insert",
    category: domain + "/categories",
    subcategory: domain + "/subcategories",
    fileupload: domain + "/filetest/upload",
    workflowStatus: domain + "/assetsales/workflow/status/",
    workflowCheck: domain + "/assetsales/workflow/check/",
    maxfdsbnumber: domain + "/filestorage/max-fdsb-number/",
    approve: domain + "/assetsales/approve",
    accntnum: domain + "/borrowerAccountNumber/",
    dpaccntnum: domain + "/dpaccountnum/",
    alldisbursements: domain + "/assetdisbursement/all",
    filesByAttachmentReferences: domain + "/filestorage/files",
    downloadFile: domain + "/filestorage/download",
    // updateDisbursement: domain + "/assetdisbursement/update",

};

export default endpoints;