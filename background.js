// ตรวจสอบการเปิดใช้งาน Extension
chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 Roblox Cookie Login Extension ทำงานเสถียรบน Manifest V3 แล้ว!");
});
