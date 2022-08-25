import Tenor from 'tenorjs'

const tenorToken = process.env["TENOR_TOKEN"];

export const TenorClient = Tenor.client({
  Key: tenorToken, // https://tenor.com/developer/keyregistration
  Filter: "medium", // "off", "low", "medium", "high", not case sensitive
  Locale: "en_US", // Your locale here, case-sensitivity depends on input
  MediaFilter: "basic", // either minimal or basic, not case sensitive
  DateFormat: "D/MM/YYYY - H:mm:ss A", // Change this accordingly
});