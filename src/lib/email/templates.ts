const BRAND = {
  name: "VINO12",
  color: "#722F37",
  font: "monospace",
};

function layout(content: string): string {
  return `
    <div style="font-family:${BRAND.font};max-width:600px;margin:0 auto;padding:40px 20px;background:#FAFAF5">
      <h1 style="font-size:32px;margin:0">VINO<span style="color:${BRAND.color}">12</span></h1>
      ${content}
      <hr style="border:2px solid #000;margin:24px 0" />
      <p style="color:#999;font-size:10px;text-transform:uppercase;letter-spacing:2px">
        VINO12 · Premium Wijnbox · vino12.com
      </p>
    </div>
  `;
}

export function orderConfirmationEmail(order: {
  orderNumber: string;
  totalCents: number;
  items: { wineName: string; quantity: number; totalCents: number }[];
}): string {
  const totalEur = (order.totalCents / 100).toFixed(2).replace(".", ",");

  const rows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.wineName}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">&euro;${(item.totalCents / 100).toFixed(2).replace(".", ",")}</td>
        </tr>`,
    )
    .join("");

  return layout(`
    <p style="color:#666;margin-top:8px">Bedankt voor je bestelling!</p>
    <hr style="border:2px solid #000;margin:24px 0" />
    <p><strong>Bestelnummer:</strong> ${order.orderNumber}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr>
          <th style="padding:8px;border-bottom:2px solid #000;text-align:left">Wijn</th>
          <th style="padding:8px;border-bottom:2px solid #000;text-align:center">Aantal</th>
          <th style="padding:8px;border-bottom:2px solid #000;text-align:right">Bedrag</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;font-size:18px;font-weight:bold">Totaal: &euro;${totalEur}</p>
    <hr style="border:2px solid #000;margin:24px 0" />
    <p style="color:#666;font-size:12px">Je bestelling wordt binnen 3-5 werkdagen bezorgd. Bij levering vindt een 18+ verificatie plaats.</p>
  `);
}

export function shippingNotificationEmail(order: {
  orderNumber: string;
  trackingUrl: string | null;
  carrier: string;
}): string {
  const trackingLine = order.trackingUrl
    ? `<p><a href="${order.trackingUrl}" style="color:${BRAND.color};font-weight:bold">Track je bestelling &rarr;</a></p>`
    : `<p style="color:#666">Een track & trace code volgt zodra beschikbaar.</p>`;

  return layout(`
    <p style="color:#666;margin-top:8px">Je bestelling is onderweg!</p>
    <hr style="border:2px solid #000;margin:24px 0" />
    <p><strong>Bestelnummer:</strong> ${order.orderNumber}</p>
    <p><strong>Verzender:</strong> ${order.carrier}</p>
    ${trackingLine}
    <hr style="border:1px solid #eee;margin:24px 0" />
    <p style="color:#666;font-size:12px">Bij levering wordt je leeftijd geverifieerd (18+). Zorg dat je een geldig identiteitsbewijs bij de hand hebt.</p>
  `);
}

export function gdprDataExportEmail(downloadUrl: string): string {
  return layout(`
    <p style="color:#666;margin-top:8px">Je dataexport is klaar.</p>
    <hr style="border:2px solid #000;margin:24px 0" />
    <p>Je hebt een export van je persoonlijke gegevens aangevraagd. Klik op onderstaande link om het bestand te downloaden:</p>
    <p style="margin:24px 0">
      <a href="${downloadUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#FAFAF5;text-decoration:none;font-weight:bold;text-transform:uppercase;letter-spacing:2px;font-size:12px">
        Download gegevens
      </a>
    </p>
    <p style="color:#666;font-size:12px">Deze link is 24 uur geldig. Na het downloaden raden we aan het bestand veilig op te slaan.</p>
  `);
}

export function gdprDeletionConfirmEmail(): string {
  return layout(`
    <p style="color:#666;margin-top:8px">Je account is verwijderd.</p>
    <hr style="border:2px solid #000;margin:24px 0" />
    <p>Conform je verzoek hebben we al je persoonlijke gegevens verwijderd uit onze systemen.</p>
    <p>De volgende gegevens zijn verwijderd:</p>
    <ul style="color:#666;font-size:14px">
      <li>Account informatie (naam, email, telefoon)</li>
      <li>Adressen</li>
      <li>Smaakprofiel en voorkeuren</li>
    </ul>
    <p style="color:#666;font-size:12px">Bestelgegevens worden bewaard conform de wettelijke bewaarplicht (7 jaar fiscaal). Deze zijn geanonimiseerd.</p>
  `);
}
