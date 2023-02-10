import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const input = document.getElementById("xmlInput") as HTMLInputElement;
const button = document.getElementById("uploadButton") as HTMLButtonElement;

input.addEventListener("change", (e) => {
  const file = input.files![0];
  if (!file) {
   return alert('no selected file ');
  }
  const reader = new FileReader();

  reader.onload = (e) => {
    const xml = e.target?.result;
    console.log(xml);

    button.addEventListener("click", () => {
      if (typeof xml === "string") {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const menu = Array.from(xmlDoc.getElementsByTagName("food"));
        const data = [
          ["", "menu"],
          ["name","price","description","calories"],
          ...menu.map((b) => [
            b.getElementsByTagName("name")[0].textContent,
            b.getElementsByTagName("price")[0].textContent,
            b.getElementsByTagName("description")[0].textContent,
            b.getElementsByTagName("calories")[0].textContent,
          ]),
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        const file = new Blob([wbout], { type: "application/octet-stream" });

        saveAs(file, "menu.xlsx");
      }

      // const xlsx = Xlsx.write(workbook, { type: "array" });
      // const blob = new Blob([xlsx], {
      //   type: "application/octet-stream",
      // });
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = "tata.xlsx";
      // link.click();
    });
  };

  reader.readAsText(file);
});