import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportAsExcelWithNestedSheets(data: any[], fileName: string): void {
    if (!data || !data.length) return;

    const workbook: XLSX.WorkBook = {
      SheetNames: [],
      Sheets: {}
    };

    const mainSheetData = data.map((item, index) => {
      const flat: any = {};
      for (const key in item) {
        const val = item[key];
        if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
          // Handle nested — push to separate sheet
          const nestedSheetName = item.id || item.empId || `Nested_${index}_${key}`;

          const nestedArray = Array.isArray(val)
            ? val
            : [val]; // Wrap single object as array

          const flattenedNested = nestedArray.map(n => this.flattenObject(n));

          const nestedSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedNested);
          workbook.SheetNames.push(nestedSheetName);
          workbook.Sheets[nestedSheetName] = nestedSheet;

          flat[key] = `[See Sheet: ${nestedSheetName}]`;
        } else {
          flat[key] = val;
        }
      }
      return flat;
    });

    const mainSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mainSheetData);
    workbook.SheetNames.unshift('Main');
    workbook.Sheets['Main'] = mainSheet;

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private flattenObject(obj: any, prefix = ''): any {
    let result: any = {};
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          result[prefixedKey] = value.map(v =>
            typeof v === 'object' ? JSON.stringify(v) : v
          ).join(', ');
        } else {
          result = {
            ...result,
            ...this.flattenObject(value, prefixedKey)
          };
        }
      } else {
        result[prefixedKey] = value;
      }
    }
    return result;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], {
      type: 'application/octet-stream'
    });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  }
}
