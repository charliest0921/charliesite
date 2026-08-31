(function () {
  const fileRoot = "class-console-files";

  const scheduleFiles = {
    calendar: {
      title: "學校行事曆",
      path: `./${fileRoot}/schedule/1.pdf`,
      filename: "1.pdf"
    },
    timetable: {
      title: "班級課表",
      path: `./${fileRoot}/schedule/2.jpeg`,
      filename: "2.jpeg"
    }
  };

  const formFiles = Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    return {
      id: `form-${number}`,
      title: `相關表件 ${number}`,
      path: `./${fileRoot}/forms/${number}.pdf`,
      filename: `${number}.pdf`
    };
  });

  const links = [
    { title: "康軒數學", url: "https://digitalmaster.knsh.com.tw/v3/pages/e/index.html#year=1151&field=ma&grade=6%E5%B9%B4%E7%B4%9A&item=ebook&bookcase=online", category: "教科書", note: "康軒數學六上" },
    { title: "南一", url: "https://reader.nani.com.tw/bookstore", category: "教科書", note: "南一數位資源入口網" },
    { title: "翰林電子書網站", url: "https://hanlindigi.hle.com.tw/depot/1/default", category: "教科書", note: "翰林數位產品入口" },
    { title: "教育部簡編本字典", url: "https://dict.concised.moe.edu.tw/", category: "語文", note: "國語辭典簡編本" },
    { title: "上石首頁", url: "https://hses.tc.edu.tw/", category: "上石", note: "臺中市西屯區上石國小" },
    { title: "上石雲端校務系統", url: "https://school.tc.edu.tw/", category: "上石", note: "臺中市校務系統入口" },
    { title: "上石差勤系統", url: "https://pemis.taichung.gov.tw/login.aspx", category: "行政", note: "臺中市差勤系統" },
    { title: "Apple iCloud首頁", url: "https://www.icloud.com/", category: "雲端", note: "Apple iCloud" },
    { title: "CHAT GPT", url: "https://chatgpt.com/", category: "AI", note: "OpenAI ChatGPT" },
    { title: "GEMINI", url: "https://gemini.google.com/", category: "AI", note: "Google Gemini" }
  ];

  window.ClassConsoleStore = {
    fileRoot,
    scheduleFiles,
    formFiles,
    links
  };
})();
