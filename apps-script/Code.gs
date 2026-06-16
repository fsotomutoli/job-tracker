// Job Tracker – Backend Google Apps Script
// Este script va "bound" (vinculado) a tu propio Google Sheet — pégalo en
// Extensiones → Apps Script del sheet donde quieras guardar tus postulaciones.
// No necesita el Sheet ID: getActiveSpreadsheet() siempre resuelve al sheet
// al que el script está vinculado.

const SHEET_NAME = 'Postulaciones';
const HEADERS = [
  'id', 'cargo', 'empresa', 'plataforma', 'link',
  'fechaPostulacion', 'modalidad', 'sueldo', 'estado', 'notas', 'createdAt'
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1e293b')
      .setFontColor('#ffffff');
  }
  return sheet;
}

function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => { obj[h] = row[i]; });
  return obj;
}

function getAllRows(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  return data.slice(1).map(row => rowToObj(data[0], row));
}

function respond(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET → devuelve todas las postulaciones
function doGet() {
  try {
    return respond({ ok: true, data: getAllRows(getSheet()) });
  } catch (e) {
    return respond({ ok: false, error: e.message });
  }
}

// POST → body.action: 'create' | 'update' | 'delete'
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = getSheet();

    if (body.action === 'create') {
      sheet.appendRow(HEADERS.map(h => body.data[h] ?? ''));
      return respond({ ok: true, data: body.data });
    }

    if (body.action === 'update') {
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(body.data.id)) {
          HEADERS.forEach((h, j) =>
            sheet.getRange(i + 1, j + 1).setValue(body.data[h] ?? '')
          );
          return respond({ ok: true, data: body.data });
        }
      }
      return respond({ ok: false, error: 'Fila no encontrada' });
    }

    if (body.action === 'delete') {
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(body.id)) {
          sheet.deleteRow(i + 1);
          return respond({ ok: true });
        }
      }
      return respond({ ok: false, error: 'Fila no encontrada' });
    }

    return respond({ ok: false, error: 'Acción desconocida' });
  } catch (e) {
    return respond({ ok: false, error: e.message });
  }
}
