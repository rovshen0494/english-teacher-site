import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "downloads");
fs.mkdirSync(outDir, { recursive: true });

function makePdf(lines) {
  const fontSize = 12;
  const leading = 18;
  const startY = 760;

  const contentLines = lines
    .map((line, i) => {
      const escaped = line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
      if (i === 0) {
        return `(${escaped}) Tj`;
      }
      return `0 -${leading} Td (${escaped}) Tj`;
    })
    .join("\n");

  const streamContent = `BT\n/F1 ${fontSize} Tf\n50 ${startY} Td\n${contentLines}\nET`;

  const objects = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push(`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`);

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdf;
}

const cvPdf = makePdf([
  "PLACEHOLDER CV -- SAMPLE FORMAT ONLY",
  "",
  "[Teacher Name]",
  "English Teacher & IELTS Instructor -- Ho Chi Minh City, Vietnam",
  "[email@example.com]  |  [phone placeholder]  |  [LinkedIn placeholder]",
  "",
  "PROFILE",
  "[Placeholder professional summary -- replace with real introduction.]",
  "",
  "QUALIFICATIONS",
  "[Placeholder qualification 1]",
  "[Placeholder qualification 2]",
  "",
  "TEACHING EXPERIENCE",
  "[Placeholder role] -- [Placeholder institution], [Placeholder dates]",
  "[Placeholder responsibilities and achievements.]",
  "",
  "AGE GROUPS TAUGHT",
  "[Placeholder: e.g. Ages 3-5, 6-8, 9-12, 13-17, Adults, IELTS]",
  "",
  "IELTS EXPERIENCE",
  "[Placeholder IELTS teaching background.]",
  "",
  "This document is a clearly labelled placeholder.",
  "It will be replaced with a real, verified CV before publishing.",
]);

const resourcePdf = makePdf([
  "PLACEHOLDER DOWNLOAD",
  "",
  "This is a placeholder file used during development of the",
  "teaching resource library.",
  "",
  "It will be replaced with the real printable / teacher material",
  "before this resource is published.",
]);

fs.writeFileSync(path.join(outDir, "cv-placeholder.pdf"), cvPdf, "latin1");
fs.writeFileSync(path.join(outDir, "placeholder-resource.pdf"), resourcePdf, "latin1");

console.log("Placeholder PDFs written to", outDir);
