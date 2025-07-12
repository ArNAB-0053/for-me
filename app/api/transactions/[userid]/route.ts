import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_NAME_TRANSACTIONS = 'Sheet1';

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userid: string }> }
) {
  try {
    // Await the params Promise
    const { userid } = await params;
    
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
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        const normalizedKey = headerMap[header] || header.toLowerCase().replace(/[^a-z0-9]/g, '');
        let value = row[index] || '';
        // Convert string values to appropriate types
        if (normalizedKey === 'amount') {
          value = parseFloat(value) || 0;
        } else if (normalizedKey === 'givenToSomeone' || normalizedKey === 'isPending') {
          value = value.toUpperCase() === 'TRUE';
        }
        obj[normalizedKey] = value;
      });
      return obj;
    });

    const userTransactions = transactions.filter(
      (transaction) => transaction.userid === userid
    );

    return NextResponse.json({ success: true, data: userTransactions });
  } catch (err) {
    console.error('Error fetching user transactions:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user transactions' },
      { status: 500 }
    );
  }
}