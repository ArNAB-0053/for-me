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

export async function GET() {
  try {
    const sheets = getGoogleSheetsClient();
    const totalsSheetId = process.env.TOTALS_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: totalsSheetId,
      range: `${SHEET_NAME_TOTALS}!A2:C2`, // userid, investedMoney, currentMoney
    });

    const [userid, investedMoney, currentMoney] = response.data.values?.[0] || [];

    return NextResponse.json({
      success: true,
      data: {
        userid,
        investedMoney: parseFloat(investedMoney),
        currentMoney: parseFloat(currentMoney),
      },
    });
  } catch (err) {
    console.error('Error fetching totals:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch totals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userid, investedMoney, currentMoney } = await req.json();
    const sheets = getGoogleSheetsClient();
    const totalsSheetId = process.env.TOTALS_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId: totalsSheetId,
      range: `${SHEET_NAME_TOTALS}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[userid, investedMoney, currentMoney]],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Initial totals set successfully',
      data: { userid, investedMoney, currentMoney },
    });
  } catch (err) {
    console.error('Error setting initial totals:', err);
    return NextResponse.json({ success: false, error: 'Failed to set initial totals' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { investedMoney, currentMoney } = await req.json();
    const sheets = getGoogleSheetsClient();
    const totalsSheetId = process.env.TOTALS_SHEET_ID;

    await sheets.spreadsheets.values.update({
      spreadsheetId: totalsSheetId,
      range: `${SHEET_NAME_TOTALS}!B2:C2`, // Update investedMoney & currentMoney
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[investedMoney, currentMoney]],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Totals updated successfully',
      data: { investedMoney, currentMoney },
    });
  } catch (err) {
    console.error('Error updating totals:', err);
    return NextResponse.json({ success: false, error: 'Failed to update totals' }, { status: 500 });
  }
}
