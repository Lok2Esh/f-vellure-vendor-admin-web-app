import fs from "node:fs";
import path from "node:path";
const forbidden = /Pakistan(?:i)?|\bPKR\b|\+92|Karachi|Lahore|Islamabad|Rawalpindi|Faisalabad|Multan|Peshawar|Quetta|Urdu|\bprovince\b|postal code|JazzCash|CNIC|\.pk\b|\bRs\./i;
const failures = [];
function walk(directory) {
 if (!fs.existsSync(directory)) return;
 for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
  const file = path.join(directory,entry.name);
  if(entry.isDirectory()) walk(file);
  else if(/\.(tsx?|jsx?|json|html|svg|css|md|txt|csv)$/.test(file)) {
   fs.readFileSync(file,"utf8").split(/\r?\n/).forEach((line,index)=>{if(forbidden.test(line)) failures.push(`${file}:${index+1}`)});
  }
 }
}
// Historical backend reference and migration notes are documentation, never runtime UI.
for(const directory of ["src","public","tests","app","components","pages","features","lib","constants","config","locales","mocks","fixtures","seed"]) walk(directory);
if(failures.length) { console.error(failures.join("\n")); process.exitCode=1; }
else console.log("Market audit passed: no legacy market references in frontend source, assets or tests.");
