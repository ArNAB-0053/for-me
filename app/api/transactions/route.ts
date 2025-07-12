import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_NAME_TRANSACTIONS = 'Sheet1';
const SHEET_NAME_TOTALS = 'Sheet1';

function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
  return google.sheets({ version: 'v4', auth });
}

// Map Google Sheets headers to camelCase field names
const headerMap: Record<string, string> = {
  Type: 'type',
  Amount: 'amount',
  Reason: 'reason',
  Category: 'category',
  Date: 'date',
  Time: 'time',
  'Given To Someone ?': 'givenToSomeone',
  'Person Name': 'personName',
  'Is Pending?': 'isPending',
  Thoughts: 'thoughts',
  'User Id': 'userid',
};

export async function GET() {
  try {
    const sheets = getGoogleSheetsClient();
    const sheetId = process.env.TRANSACTION_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME_TRANSACTIONS}!A1:Z1000`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const headers = rows[0];
    const transactions = rows.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        const normalizedKey = headerMap[header] || header.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Convert string values to appropriate types
        let value = row[index] || '';
        if (normalizedKey === 'amount') {
          value = parseFloat(value) || 0;
        } else if (normalizedKey === 'givenToSomeone' || normalizedKey === 'isPending') {
          value = value.toUpperCase() === 'TRUE';
        }
        obj[normalizedKey] = value;
      });
      return obj;
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sheets = getGoogleSheetsClient();

    // Append transaction using original header names
    const transactionSheetId = process.env.TRANSACTION_SHEET_ID;
    await sheets.spreadsheets.values.append({
      spreadsheetId: transactionSheetId,
      range: `${SHEET_NAME_TRANSACTIONS}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            body.type,
            body.amount,
            body.reason,
            body.category,
            body.date,
            body.time,
            body.givenToSomeone,
            body.personName,
            body.isPending,
            body.thoughts,
            body.userid || 'u001',
          ],
        ],
      },
    });

    // Fetch current totals
    const totalsSheetId = process.env.TOTALS_SHEET_ID;
    const totalsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: totalsSheetId,
      range: `${SHEET_NAME_TOTALS}!B2:C2`, // investedMoney, currentMoney
    });

    let [investedMoney, currentMoney] = totalsResponse.data.values?.[0] || [0, 0];
    investedMoney = parseFloat(investedMoney) || 0;
    currentMoney = parseFloat(currentMoney) || 0;

    // Update only currentMoney
    if (body.type === 'credit') {
      currentMoney += body.amount;
    } else if (body.type === 'debit') {
      currentMoney -= body.amount;
    }

    // Update totals in Google Sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: totalsSheetId,
      range: `${SHEET_NAME_TOTALS}!C2:C2`, // Only currentMoney
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[currentMoney]],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Transaction added & totals updated',
      newTotals: {
        investedMoney,
        currentMoney,
      },
    });
  } catch (err) {
    console.error('Error adding transaction or updating totals:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to add transaction or update totals' },
      { status: 500 }
    );
  }
}