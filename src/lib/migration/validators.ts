export interface CsvRow {
  [key: string]: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: CsvRow = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

export function validateBuildings(rows: CsvRow[]): ValidationError[] {
  const errors: ValidationError[] = [];
  rows.forEach((row, i) => {
    if (!row.external_id) errors.push({ row: i + 2, field: "external_id", message: "Required" });
    if (!row.name) errors.push({ row: i + 2, field: "name", message: "Required" });
    if (!row.road && !row.block) errors.push({ row: i + 2, field: "road", message: "Road or block required" });
  });
  return errors;
}

export function validateUnits(rows: CsvRow[]): ValidationError[] {
  const errors: ValidationError[] = [];
  rows.forEach((row, i) => {
    if (!row.unit_id) errors.push({ row: i + 2, field: "unit_id", message: "Required" });
    if (!row.building_id) errors.push({ row: i + 2, field: "building_id", message: "Required" });
    if (row.area_sqm && Number.isNaN(Number(row.area_sqm))) {
      errors.push({ row: i + 2, field: "area_sqm", message: "Must be numeric" });
    }
  });
  return errors;
}

export function validateLeases(rows: CsvRow[]): ValidationError[] {
  const errors: ValidationError[] = [];
  rows.forEach((row, i) => {
    if (!row.unit_id) errors.push({ row: i + 2, field: "unit_id", message: "Required" });
    if (!row.tenant_name) errors.push({ row: i + 2, field: "tenant_name", message: "Required" });
    if (row.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.start_date)) {
      errors.push({ row: i + 2, field: "start_date", message: "Invalid date (YYYY-MM-DD)" });
    }
    if (row.cpr && !/^\d{9}$/.test(row.cpr)) {
      errors.push({ row: i + 2, field: "cpr", message: "CPR must be 9 digits" });
    }
    if (row.ewa_account && !/^EWA-\d+$/.test(row.ewa_account)) {
      errors.push({ row: i + 2, field: "ewa_account", message: "Format: EWA-123456" });
    }
  });
  return errors;
}

export function validateByTemplate(template: string, rows: CsvRow[]): ValidationError[] {
  if (template === "buildings") return validateBuildings(rows);
  if (template === "units") return validateUnits(rows);
  if (template === "leases") return validateLeases(rows);
  return [];
}
