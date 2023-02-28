import {
  CellObject,
  read,
  utils,
  WorkBook,
  WorkSheet,
  write,
  Range,
} from "xlsx";

class WorkbookBuilder {
  private workbook: WorkBook;

  private get sheet(): WorkSheet {
    return this.workbook.Sheets[this.workbook.SheetNames[0]];
  }

  private currentRow = 1;
  public data: Uint8Array = new Uint8Array();

  constructor() {
    this.workbook = utils.book_new();
    utils.book_append_sheet(this.workbook, utils.aoa_to_sheet([[]]));
  }

  initializeHeader(headerData: unknown[][]) {
    if (this.currentRow === 1) {
      utils.sheet_add_aoa(this.sheet, headerData, {
        origin: `A${this.currentRow}`,
      });
      (this.sheet["O1"] as CellObject).v = "Contract Amount";
      this.currentRow++;
    }
  }

  addAoA(data: unknown[][]) {
    utils.sheet_add_aoa(this.sheet, data, { origin: `A${this.currentRow}` });
    this.currentRow = this.currentRow + data.length + 1;
  }

  async build() {
    this.data = write(this.workbook, { type: "array" });
    return this.data;
  }

  reset() {
    builder = new WorkbookBuilder();
  }
}

const rangeToAoA = (sheet: WorkSheet, range: Range) => {
  const result = [];

  for (let row = range.s.r; row <= range.e.r; row++) {
    const rowData = [];
    for (let column = range.s.c; column <= range.e.c; column++) {
      const cellAddress = utils.encode_cell({ r: row, c: column });
      const cell = sheet[cellAddress] as CellObject;

      if (cell != null) {
        rowData.push(cell.v);
      }
    }

    if (rowData.length > 0) {
      result.push(rowData);
    }
  }

  return result;
};

export const processSpreadsheet = async (file: File) => {
  const workbook = read(await file.arrayBuffer());
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const [start, end] = sheet["!ref"]?.split(":") as [string, string];
  const lastColumn = end.match(/[A-Z]+/)?.[0] as string;
  const noOfRows = parseInt(end.match(/[0-9]+/)?.[0] as string, 10);

  const operatingUnit = sheet["M2"] as CellObject;

  const headerRange = utils.decode_range(`A3:${lastColumn}3`);
  const header = rangeToAoA(sheet, headerRange);

  header[0].unshift("Entity");
  builder.initializeHeader(header);

  const range = utils.decode_range(`A5:${lastColumn}${noOfRows}`);
  const result = rangeToAoA(sheet, range);

  for (let index = 0; index < result.length; index++) {
    const row = result[index];
    row.unshift(operatingUnit.v?.toString() as string);
  }

  builder.addAoA(result);
};

let builder = new WorkbookBuilder();
export { builder };
