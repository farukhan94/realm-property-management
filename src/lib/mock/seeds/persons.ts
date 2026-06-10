import type { Person } from "@/types/person";

export const PERSONS: Person[] = [
  // Owners — Bahraini
  { id: "own-1", name: "Khalid Al-Khalifa", nameAr: "خالد آل خليفة", email: "k.alkhalifa@email.bh", phone: "+973 3666 1122", role: "owner", cpr: "760101234", nationality: "bahraini", ownedUnitIds: ["U-1002", "U-104-01"] },
  { id: "own-2", name: "Fatima Al-Mannai", nameAr: "فاطمة المناعي", email: "f.mannai@email.bh", phone: "+973 3999 2233", role: "owner", cpr: "820505678", nationality: "bahraini", ownedUnitIds: ["U-1001", "U-204", "U-103-03"] },
  { id: "own-4", name: "Hessa Al-Jowder", nameAr: "حصة الجودر", email: "h.jowder@email.bh", phone: "+973 3666 4455", role: "owner", cpr: "900312345", nationality: "bahraini", ownedUnitIds: ["U-102-02", "U-105-01"] },
  { id: "own-6", name: "Mariam Al-Buainain", nameAr: "مريم البوعينين", email: "m.buainain@email.bh", phone: "+973 3999 6677", role: "owner", cpr: "850701234", nationality: "bahraini", ownedUnitIds: ["U-106-01"] },
  { id: "own-8", name: "Noor Al-Sayed", nameAr: "نور السيد", email: "n.sayed@email.bh", phone: "+973 3666 8899", role: "owner", cpr: "910203456", nationality: "bahraini", ownedUnitIds: ["U-110-01"] },
  { id: "own-9", name: "Abdulla Al-Sada", nameAr: "عبدالله السادة", email: "a.alsada@email.bh", phone: "+973 3344 9901", role: "owner", cpr: "780412567", nationality: "bahraini", ownedUnitIds: ["U-101-05"] },
  { id: "own-10", name: "Noura Al-Doseri", nameAr: "نورة الدوسري", email: "n.doseri@email.bh", phone: "+973 3777 9902", role: "owner", cpr: "830608901", nationality: "bahraini", ownedUnitIds: ["U-102-08"] },
  { id: "own-11", name: "Jassim Al-Kooheji", nameAr: "جاسم الكوهجي", email: "j.kooheji@email.bh", phone: "+973 3999 9903", role: "owner", cpr: "740215678", nationality: "bahraini", ownedUnitIds: ["U-103-06"] },
  { id: "own-12", name: "Latifa Al-Zayani", nameAr: "لطيفة الزياني", email: "l.zayani@email.bh", phone: "+973 3666 9904", role: "owner", cpr: "860923456", nationality: "bahraini", ownedUnitIds: ["U-104-10"] },
  { id: "own-13", name: "Hamad Al-Jalahma", nameAr: "حمد الجلاهمة", email: "h.jalahma@email.bh", phone: "+973 3344 9905", role: "owner", cpr: "790307890", nationality: "bahraini", ownedUnitIds: ["U-105-07"] },
  { id: "own-14", name: "Aisha Al-Mansoori", nameAr: "عائشة المنصوري", email: "a.mansoori@email.bh", phone: "+973 3777 9906", role: "owner", cpr: "880511234", nationality: "bahraini", ownedUnitIds: ["U-106-09"] },
  { id: "own-15", name: "Salman Al-Hashimi", nameAr: "سلمان الهاشمي", email: "s.hashimi@email.bh", phone: "+973 3999 9907", role: "owner", cpr: "810104567", nationality: "bahraini", ownedUnitIds: ["U-107-04"] },
  { id: "own-16", name: "Zainab Al-Hassan", nameAr: "زينب الحسن", email: "z.hassan@email.bh", phone: "+973 3666 9908", role: "owner", cpr: "920718901", nationality: "bahraini", ownedUnitIds: ["U-108-11"] },
  { id: "own-17", name: "Rashid Al-Shurooqi", nameAr: "راشد الشروقي", email: "r.shurooqi@email.bh", phone: "+973 3344 9909", role: "owner", cpr: "770902345", nationality: "bahraini", ownedUnitIds: ["U-109-03"] },

  // Owners — Expat
  { id: "own-3", name: "James Whitfield", email: "j.whitfield@email.com", phone: "+973 3777 3344", role: "owner", passportNo: "GB882211", nationality: "expat", ownedUnitIds: ["U-1005", "U-301"] },
  { id: "own-5", name: "Rajesh Nair", email: "r.nair@email.com", phone: "+973 3344 5566", role: "owner", passportNo: "IN445566", nationality: "expat", ownedUnitIds: ["U-104-02"] },
  { id: "own-7", name: "Thomas Berg", email: "t.berg@email.de", phone: "+973 3777 7788", role: "owner", passportNo: "DE998877", nationality: "expat", ownedUnitIds: ["U-108-01", "U-108-02"] },
  { id: "own-18", name: "Sarah Mitchell", email: "s.mitchell@email.co.uk", phone: "+973 3999 9910", role: "owner", passportNo: "GB334455", nationality: "expat", ownedUnitIds: ["U-101-12"] },
  { id: "own-19", name: "Vikram Patel", email: "v.patel@email.in", phone: "+973 3666 9911", role: "owner", passportNo: "IN778899", nationality: "expat", ownedUnitIds: ["U-103-14"] },
  { id: "own-20", name: "Omar El-Sayed", email: "o.elsayed@email.eg", phone: "+973 3344 9912", role: "owner", passportNo: "EG112233", nationality: "expat", ownedUnitIds: ["U-104-06"] },

  // Tenants — Bahraini
  { id: "ten-3", name: "Dana Al-Ghatam", nameAr: "دانا الغتم", email: "dana.alghatam@email.bh", phone: "+973 3999 3030", role: "tenant", cpr: "950601789", nationality: "bahraini" },
  { id: "ten-5", name: "Sara Al-Haddad", nameAr: "سارة الحداد", email: "s.haddad@email.bh", phone: "+973 3344 5050", role: "tenant", cpr: "980104567", nationality: "bahraini" },
  { id: "ten-8", name: "Yusuf Al-Aradi", nameAr: "يوسف العرادي", email: "y.aradi@email.bh", phone: "+973 3666 8080", role: "tenant", cpr: "920308901", nationality: "bahraini" },
  { id: "ten-9", name: "Reem Al-Qassim", nameAr: "ريم القاسم", email: "r.qassim@email.bh", phone: "+973 3777 9091", role: "tenant", cpr: "960412345", nationality: "bahraini" },
  { id: "ten-10", name: "Faisal Al-Moayed", nameAr: "فيصل المعياد", email: "f.moayed@email.bh", phone: "+973 3999 9092", role: "tenant", cpr: "930807678", nationality: "bahraini" },
  { id: "ten-11", name: "Lulwa Al-Mahmood", nameAr: "لولوة المحمود", email: "l.mahmood@email.bh", phone: "+973 3344 9093", role: "tenant", cpr: "970215901", nationality: "bahraini" },
  { id: "ten-12", name: "Hassan Al-Ansari", nameAr: "حسن الأنصاري", email: "h.ansari@email.bh", phone: "+973 3666 9094", role: "tenant", cpr: "940603234", nationality: "bahraini" },

  // Tenants — Expat
  { id: "ten-1", name: "Alice Cooper", email: "alice@email.com", phone: "+973 3344 1010", role: "tenant", passportNo: "US112233", lmraPermit: "LMRA-2025-8812", lmraExpiry: "2026-12-31", nationality: "expat" },
  { id: "ten-2", name: "Charlie Davis", email: "charlie@email.com", phone: "+973 3777 2020", role: "tenant", passportNo: "AU334455", lmraPermit: "LMRA-2025-4421", lmraExpiry: "2026-08-15", nationality: "expat" },
  { id: "ten-4", name: "Evan Ford", email: "evan@email.com", phone: "+973 3666 4040", role: "tenant", passportNo: "CA556677", lmraPermit: "LMRA-2025-1199", lmraExpiry: "2027-01-20", nationality: "expat" },
  { id: "ten-6", name: "Mohammed Hassan", email: "m.hassan@email.eg", phone: "+973 3777 6060", role: "tenant", passportNo: "EG778899", lmraPermit: "LMRA-2025-3300", lmraExpiry: "2026-06-30", nationality: "expat" },
  { id: "ten-7", name: "Priya Menon", email: "p.menon@email.in", phone: "+973 3999 7070", role: "tenant", passportNo: "IN990011", lmraPermit: "LMRA-2025-5500", lmraExpiry: "2026-11-01", nationality: "expat" },
  { id: "ten-13", name: "David Thompson", email: "d.thompson@email.co.uk", phone: "+973 3344 9095", role: "tenant", passportNo: "GB556677", lmraPermit: "LMRA-2025-6601", lmraExpiry: "2026-09-30", nationality: "expat" },
  { id: "ten-14", name: "Anita Desai", email: "a.desai@email.in", phone: "+973 3777 9096", role: "tenant", passportNo: "IN223344", lmraPermit: "LMRA-2025-6602", lmraExpiry: "2027-02-28", nationality: "expat" },
  { id: "ten-15", name: "Carlos Reyes", email: "c.reyes@email.ph", phone: "+973 3999 9097", role: "tenant", passportNo: "PH889900", lmraPermit: "LMRA-2025-6603", lmraExpiry: "2026-10-15", nationality: "expat" },
  { id: "ten-16", name: "Sophie Laurent", email: "s.laurent@email.fr", phone: "+973 3666 9098", role: "tenant", passportNo: "FR445566", lmraPermit: "LMRA-2025-6604", lmraExpiry: "2027-03-31", nationality: "expat" },
  { id: "ten-17", name: "Ahmed Ibrahim", email: "a.ibrahim@email.eg", phone: "+973 3344 9099", role: "tenant", passportNo: "EG667788", lmraPermit: "LMRA-2025-6605", lmraExpiry: "2026-07-20", nationality: "expat" },
  { id: "ten-18", name: "Maria Santos", email: "m.santos@email.ph", phone: "+973 3777 9100", role: "tenant", passportNo: "PH112233", lmraPermit: "LMRA-2025-6606", lmraExpiry: "2026-12-01", nationality: "expat" },
  { id: "ten-19", name: "Robert Clarke", email: "r.clarke@email.co.uk", phone: "+973 3999 9101", role: "tenant", passportNo: "GB990011", lmraPermit: "LMRA-2025-6607", lmraExpiry: "2027-01-15", nationality: "expat" },
  { id: "ten-20", name: "Deepak Krishnan", email: "d.krishnan@email.in", phone: "+973 3666 9102", role: "tenant", passportNo: "IN334455", lmraPermit: "LMRA-2025-6608", lmraExpiry: "2026-11-30", nationality: "expat" },

  // Technicians
  { id: "tech-1", name: "Marcus Webb", email: "m.webb@realm.bh", phone: "+973 3344 9001", role: "technician", lmraPermit: "LMRA-STAFF-101", nationality: "expat" },
  { id: "tech-2", name: "Priya Sharma", email: "p.sharma@realm.bh", phone: "+973 3777 9002", role: "technician", lmraPermit: "LMRA-STAFF-102", nationality: "expat" },
  { id: "tech-3", name: "Ahmed Al-Fardan", nameAr: "أحمد الفردان", email: "a.fardan@realm.bh", phone: "+973 3999 9003", role: "technician", cpr: "870412345", nationality: "bahraini" },
  { id: "tech-4", name: "Ravi Kumar", email: "r.kumar@realm.bh", phone: "+973 3344 9004", role: "technician", lmraPermit: "LMRA-STAFF-103", nationality: "expat" },
  { id: "tech-5", name: "Khalid Al-Mannai", nameAr: "خالد المناعي", email: "k.mannai@realm.bh", phone: "+973 3777 9005", role: "technician", cpr: "890615678", nationality: "bahraini" },

  // Board members
  { id: "board-1", name: "Dr. Layla Al-Sitri", nameAr: "د. ليلى السيتري", email: "l.sitri@hoa.bh", phone: "+973 3666 0001", role: "board_member", cpr: "750201234", nationality: "bahraini" },
  { id: "board-2", name: "Peter Johansson", email: "p.johansson@hoa.bh", phone: "+973 3777 0002", role: "board_member", passportNo: "SE112244", nationality: "expat" },
  { id: "board-3", name: "Sheikha Al-Khalifa", nameAr: "الشيخة آل خليفة", email: "s.alkhalifa@hoa.bh", phone: "+973 3999 0003", role: "board_member", cpr: "720408901", nationality: "bahraini" },
  { id: "board-4", name: "Sanjay Mehta", email: "s.mehta@hoa.bh", phone: "+973 3344 0004", role: "board_member", passportNo: "IN556677", nationality: "expat" },
];
