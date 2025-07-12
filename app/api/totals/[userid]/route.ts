import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
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

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ userid: string }> }
) {
  try {
    // Await the params Promise
    const { userid } = await params;
    
    const sheets = getGoogleSheetsClient();
    const totalsSheetId = process.env.TOTALS_SHEET_ID;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: totalsSheetId,
      range: `${SHEET_NAME_TOTALS}!A2:C`,
    });
    
    const values = response.data.values || [];
    const userRow = values.find(([id]) => id === userid);
    
    if (!userRow) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    const [userIdFromSheet, investedMoney, currentMoney] = userRow;
    
    return NextResponse.json({
      success: true,
      data: {
        userid: userIdFromSheet,
        investedMoney: parseFloat(investedMoney),
        currentMoney: parseFloat(currentMoney),
      },
    });
  } catch (err) {
    console.error('Error fetching totals:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch totals' }, { status: 500 });
  }
}