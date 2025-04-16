const domain = "https://localhost:44341/api";

const endpoints = {
    project: domain + "/project",
    sales: domain + "/assetsales/",
    login: domain + "/login",
    update: domain + "/assetsales/update/",
    yearmonth: domain + "/assetsales/nextyearmonth/",
    workflow: domain + "/assetsales/workflow/",
    projectheader: domain + "assetsales/hdr/",
    updateProjecthdr: domain + "assetsales/updatehdr"
};

export default endpoints;