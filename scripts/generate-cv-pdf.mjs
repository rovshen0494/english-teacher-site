import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "public", "downloads", "cv-balgyz-mammetyarova.pdf");

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 748;
const MARGIN_BOTTOM = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const BRAND = [0.122, 0.459, 0.408]; // teal, matches site's brand-600
const INK = [0.06, 0.13, 0.23]; // matches site's ink-900
const GRAY = [0.35, 0.42, 0.51]; // matches site's ink-500

// Turkish characters and typographic punctuation aren't in WinAnsiEncoding;
// normalise them so the base-14 Helvetica font can render them correctly.
function sanitize(str) {
  return str
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, "-");
}

function escapePdfText(str) {
  return str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// Average glyph width as a fraction of font size, per base-14 font.
const AVG_WIDTH = { F1: 0.5, F2: 0.54 };

function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const maxChars = Math.floor(maxWidth / (size * AVG_WIDTH[font]));
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

class PdfBuilder {
  constructor() {
    this.pages = [[]];
    this.y = MARGIN_TOP;
  }

  get currentPage() {
    return this.pages[this.pages.length - 1];
  }

  newPage() {
    this.pages.push([]);
    this.y = MARGIN_TOP;
  }

  ensureSpace(height) {
    if (this.y - height < MARGIN_BOTTOM) this.newPage();
  }

  rawLine(text, { font = "F1", size = 10, color = INK, x = MARGIN_X, leading = 14 }) {
    this.ensureSpace(leading);
    this.currentPage.push({ text: sanitize(text), font, size, color, x, y: this.y });
    this.y -= leading;
  }

  paragraph(text, opts = {}) {
    const { font = "F1", size = 9.5, color = GRAY, leading = 13, x = MARGIN_X, maxWidth = CONTENT_WIDTH } = opts;
    const lines = wrapText(text, font, size, maxWidth - (x - MARGIN_X));
    for (const line of lines) this.rawLine(line, { font, size, color, x, leading });
  }

  spacer(amount) {
    this.y -= amount;
  }

  heading(text) {
    this.spacer(10);
    this.ensureSpace(20);
    this.rawLine(sanitize(text).toUpperCase(), { font: "F2", size: 12, color: BRAND, leading: 4 });
    this.y -= 3;
    this.currentPage.push({ rule: true, x: MARGIN_X, y: this.y, width: CONTENT_WIDTH, color: BRAND });
    this.y -= 12;
  }

  jobHeader(title, dates) {
    this.ensureSpace(14);
    const titleText = sanitize(title);
    const datesText = sanitize(dates);
    this.currentPage.push({ text: titleText, font: "F2", size: 10.5, color: INK, x: MARGIN_X, y: this.y });
    const estWidth = datesText.length * 10.5 * AVG_WIDTH.F1;
    this.currentPage.push({
      text: datesText,
      font: "F1",
      size: 9.5,
      color: GRAY,
      x: MARGIN_X + CONTENT_WIDTH - estWidth,
      y: this.y,
    });
    this.y -= 13;
  }

  jobOrg(text) {
    this.rawLine(text, { font: "F1", size: 9.5, color: BRAND, leading: 13 });
  }

  bullet(text) {
    this.paragraph(`-  ${text}`, { x: MARGIN_X + 10, leading: 12.5, size: 9.3 });
    this.spacer(2);
  }

  centeredLine(text, { font = "F2", size = 20, color = INK, leading = 24 } = {}) {
    this.ensureSpace(leading);
    const estWidth = sanitize(text).length * size * AVG_WIDTH[font];
    const x = Math.max(MARGIN_X, (PAGE_WIDTH - estWidth) / 2);
    this.currentPage.push({ text: sanitize(text), font, size, color, x, y: this.y });
    this.y -= leading;
  }

  build() {
    const objects = [];
    objects.push("<< /Type /Catalog /Pages 2 0 R >>");

    const pageObjIds = [];
    const contentObjIds = [];
    const fontF1Id = objects.length + 1 + this.pages.length * 2 + 1;
    const fontF2Id = fontF1Id + 1;

    for (let i = 0; i < this.pages.length; i++) {
      pageObjIds.push(3 + i * 2);
      contentObjIds.push(3 + i * 2 + 1);
    }

    objects.push(
      `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${this.pages.length} >>`
    );

    for (let i = 0; i < this.pages.length; i++) {
      const items = this.pages[i];
      let stream = "";
      for (const item of items) {
        if (item.rule) {
          stream += `${item.color.join(" ")} RG 0.75 w\n${item.x} ${item.y} m ${item.x + item.width} ${item.y} l S\n`;
          continue;
        }
        stream += `BT\n/${item.font} ${item.size} Tf\n${item.color.join(" ")} rg\n1 0 0 1 ${item.x.toFixed(2)} ${item.y.toFixed(2)} Tm\n(${escapePdfText(item.text)}) Tj\nET\n`;
      }

      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontF1Id} 0 R /F2 ${fontF2Id} 0 R >> >> /Contents ${contentObjIds[i]} 0 R >>`
      );
      objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
    }

    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

    let pdf = "%PDF-1.4\n";
    const offsets = [];
    objects.forEach((obj, i) => {
      offsets.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return pdf;
  }
}

const doc = new PdfBuilder();

doc.centeredLine("BALGYZ MAMMETYAROVA", { font: "F2", size: 19, color: INK, leading: 24 });
doc.centeredLine("Ho Chi Minh City, Vietnam  |  bmammet09@gmail.com  |  linkedin.com/in/balgyz-mammetyarova-65ba0427a", {
  font: "F1",
  size: 9.5,
  color: GRAY,
  leading: 20,
});

doc.heading("Profile");
doc.paragraph(
  "TEFL/TESOL-certified ESL teacher with over three years of experience teaching English to students of varying ages, nationalities, and proficiency levels across Vietnam and Turkmenistan, including dedicated TOEFL exam preparation. Skilled in preparing curriculum-aligned lesson plans, designing original instructional materials (PowerPoint, Canva, Wordwall, Bamboozle), assessing student progress, and adapting teaching methods to meet diverse learner needs. Trilingual (English, Turkmen, Russian) with strong classroom management, cross-cultural communication, and interpersonal skills built through international teaching, translation, and public-facing cultural-diplomacy work. Committed to supporting student development through both classroom instruction and extracurricular engagement."
);

doc.heading("Key Skills");
doc.rawLine("Teaching & Classroom:", { font: "F2", size: 9.5, color: INK, leading: 13 });
doc.paragraph(
  "Lesson Planning & Curriculum Delivery, Student Assessment & Progress Monitoring, Classroom Management, TOEFL Exam Preparation, Differentiated Instruction, Remedial Support"
);
doc.rawLine("Digital & Content Tools:", { font: "F2", size: 9.5, color: INK, leading: 13 });
doc.paragraph("Canva, Microsoft PowerPoint, Wordwall, Bamboozle, Microsoft Office");
doc.rawLine("Interpersonal:", { font: "F2", size: 9.5, color: INK, leading: 13 });
doc.paragraph("Cross-Cultural Communication, Audience Adaptation, Patience & Flexibility, Teamwork, Time Management, Attention to Detail");
doc.rawLine("Languages:", { font: "F2", size: 9.5, color: INK, leading: 13 });
doc.paragraph(
  "Turkmen - Fluent  *  Russian - Fluent  *  English - Fluent (C1+)  *  Turkish - Intermediate  *  Bulgarian - Pre-Intermediate  *  German - Elementary"
);

doc.heading("Work Experience");

doc.jobHeader("ESL Teacher", "April 2026 - Present");
doc.jobOrg("PMP Training Center, Ho Chi Minh City, Vietnam");
doc.bullet("Teach English to students of varying ages, nationalities, and proficiency levels in a multicultural classroom, continuously assessing learner needs and adapting lesson content and delivery accordingly.");
doc.bullet("Prepare lesson plans and original instructional content - presentation slides, worksheets, and interactive digital activities - using PowerPoint, Canva, Wordwall, and Bamboozle to support curriculum delivery.");
doc.bullet("Evaluate material effectiveness based on student engagement and comprehension, refining content and teaching approach to improve learning outcomes.");
doc.spacer(4);

doc.jobHeader("TOEFL Instructor / English Language Teacher", "February 2025 - February 2026");
doc.jobOrg("Sahypa Education Centre, Anau, Turkmenistan");
doc.bullet("Taught individuals and small groups at Pre-Intermediate level and above within a structured curriculum, preparing students specifically for the TOEFL exam.");
doc.bullet("Adapted standard test-preparation materials and lesson plans with additional practice content tailored to individual student weaknesses.");
doc.bullet("Systematically monitored and assessed student progress, using results to adjust teaching strategy, materials, and remedial support.");
doc.spacer(4);

doc.jobHeader("English Language Teacher", "September 2023 - September 2024");
doc.jobOrg("Pak Nesil Education Centre, Ashgabat, Turkmenistan");
doc.bullet("Taught English and Russian to students from Beginner to Advanced level across varied age groups, delivering lessons aligned to an established curriculum (Let's Go!, Russian Souvenir 1).");
doc.bullet("Regularly created original supplementary lesson materials beyond the standard curriculum to assess and address individual learning gaps.");
doc.bullet("Planned and organized educational games and classroom events to establish classroom expectations, reinforce learning, and build student engagement.");
doc.spacer(4);

doc.jobHeader("Live-in Educator", "May - September 2022");
doc.jobOrg("Damla Danismanlik Insan Kaynaklari, Mugla, Turkiye");
doc.bullet("Provided educational childcare for a 3-year-old, including English-language activities to support early learning, behavioral development, and overall wellbeing.");
doc.spacer(4);

doc.jobHeader("Barista and Cashier", "May - August 2019");
doc.jobOrg("Back Door Donuts Bakery, Martha's Vineyard, Massachusetts, USA");
doc.bullet("Delivered customer service and communication in a fast-paced, high-interaction, multicultural environment.");
doc.spacer(4);

doc.jobHeader("Translator (English-Turkmen-Russian)", "July 2015 - August 2018");
doc.jobOrg("Ashgabat Yoga Center, Ashgabat, Turkmenistan");
doc.bullet("Provided English-Turkmen-Russian translation, including as ceremonial translator for the 1st, 2nd, and 3rd International Day(s) of Yoga in Ashgabat, held in cooperation with the Indian Embassy.");
doc.bullet("Supported public-facing, multilingual diplomatic and cultural programming in a formal international setting, coordinating with teachers, officials, and guests.");

doc.heading("Additional Experience & Volunteering");
doc.bullet("Teaching Assistant - Ashgabat International School, Ashgabat (Sept 2017 - Jan 2018): organized educational activities supporting preschoolers' intellectual development.");
doc.bullet("Volunteer - Association of People with Disabilities of Turkmenistan, Ashgabat (Sept 2017 - May 2018): contributed to association improvement initiatives.");
doc.bullet("Event Organizer - School for Children with Special Needs, Ashgabat (Dec 2017): organized \"New Year 2018\" holiday event.");
doc.bullet("Community Service Volunteer - Park \"Loven Dom,\" Blagoevgrad, Bulgaria (Nov 2021): participated in city park clean-up campaign.");

doc.heading("Education & Certifications");
doc.rawLine("120-Hour TEFL/TESOL Certificate - World TESOL Academy, Jan 2026", { font: "F2", size: 9.5, color: INK, leading: 15 });
doc.rawLine("B.A. in History and Civilizations and Literature (Double Degree)", { font: "F2", size: 9.5, color: INK, leading: 13 });
doc.paragraph("American University in Bulgaria (AUBG), Blagoevgrad, Bulgaria | Sept 2018 - Dec 2022. GPA: History & Civilizations 3.5, Literature 3.6");
doc.spacer(3);
doc.rawLine('"Prep4Success" Alumna - U.S. Colleges & Universities Preparatory Course', { font: "F2", size: 9.5, color: INK, leading: 13 });
doc.paragraph("American Councils, Ashgabat, Turkmenistan | Sept 2017 - Feb 2018");
doc.spacer(3);
doc.rawLine("Secondary Education", { font: "F2", size: 9.5, color: INK, leading: 13 });
doc.paragraph("Secondary School #60, Ashgabat, Turkmenistan | Sept 2006 - May 2017");

doc.heading("Publications, Honours & Achievements");
doc.bullet("Essay selected for publication as an example of Outstanding Student Work, American University in Bulgaria website - published contributor, AUBG Today, \"Where Time Lives\" (Oct 2021).");
doc.bullet("SAT: 1290/1600 (Mar 2018)  |  TOEFL PBT: 85/90 (Jan 2018).");
doc.bullet("Certificate of Appreciation, Indian Embassy Quiz - \"International Day of Yoga 2017\" (Jun 2017).");
doc.bullet("Certificate of Excellence, Essay Contest - \"International Day of Yoga 2017\" (Jun 2017).");
doc.bullet("Certificate of Outstanding Performance, High School (annually, 2015-2017).");

fs.writeFileSync(outPath, doc.build(), "latin1");
console.log("CV PDF written to", outPath, `(${doc.pages.length} page(s))`);
