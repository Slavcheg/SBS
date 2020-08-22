import {getAccessToken} from "../auth/auth.service";

export async function exportSpreadSheet(data){
    console.log(data);
    let accessToken = await getAccessToken() as String;
    console.log(accessToken);
    const request = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            properties: {
              title: "Report_" + new Date().toString(),
            },
          }),
        }
      );
    const spreadSheet = await request.json();
    console.log(request.json());
    const response = fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadSheet.spreadsheetId}/values/${data.range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data)
    });
    return (await response).json();
}
