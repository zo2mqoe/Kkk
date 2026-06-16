document.querySelector(".button")?.addEventListener("click", async (Event) => {
    const rawCookie = document.querySelector(".cookie-input").value;
    // เคลียร์ช่องว่างและอัญประกาศออกเพื่อป้องกันการใส่โค้ดที่คัดลอกมาผิดพลาด
    const cleanCookie = rawCookie.replace(/["']/g, "").replace(/\s+/g, "");
    
    const useButton = Event.target;
    const useInput = document.querySelector('.cookie-input');
    const errorDiv = document.querySelector('.error');
    
    useButton.disabled = true;
    errorDiv.textContent = "";
    errorDiv.classList.remove("shown");
    useInput.classList.remove("errored");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // ตรวจสอบความถูกต้องของคุกกี้เบื้องต้น
    if (!cleanCookie.includes("_|WARNING:-DO-NOT-SHARE-THIS.") || cleanCookie.length < 500) {
        errorDiv.style.color = "#ED4245";
        errorDiv.textContent = '❌ รูปแบบ Cookie ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
        errorDiv.classList.add("shown");
        useInput.classList.add("errored");
        useButton.disabled = false;
        return;
    }

    try {
        const domains = ["roblox.com", ".roblox.com", "www.roblox.com", "web.roblox.com"];
        const expirationDate = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // เซ็ตอายุคุกกี้ 7 วัน

        for (const domain of domains) {
            await chrome.cookies.set({
                url: "https://www.roblox.com/",
                domain: domain,
                name: ".ROBLOSECURITY",
                value: cleanCookie,
                expirationDate: expirationDate,
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: "no_restriction"
            });
        }

        errorDiv.style.color = "#57F287";
        errorDiv.textContent = "🟢 ตั้งค่า Cookie สำเร็จ! กำลังรีโหลดหน้าเว็บ...";
        errorDiv.classList.add("shown");

        // รีโหลดหน้าเว็บให้ทันทีหากอยู่หน้า Roblox หรือเปิดแท็บใหม่ให้หากอยู่หน้าอื่น
        setTimeout(() => {
            if (tab && tab.url && (tab.url.includes("roblox.com") || tab.url.includes("web.roblox.com"))) {
                chrome.tabs.reload(tab.id);
            } else {
                chrome.tabs.create({ url: "https://www.roblox.com/home" });
            }
        }, 1200);

    } catch (err) {
        errorDiv.style.color = "#ED4245";
        errorDiv.textContent = "❌ เกิดข้อผิดพลาดในระบบเบราว์เซอร์";
        errorDiv.classList.add("shown");
        useButton.disabled = false;
    }
});
