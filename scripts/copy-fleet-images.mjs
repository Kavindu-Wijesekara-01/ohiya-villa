import fs from "fs";

const carSrc = "C:/Users/LENOVO/.gemini/antigravity/brain/6682ad3f-5b9f-4dfc-ab8c-da77fbfc9c4f/.user_uploaded/media_1795457467030_84721af8.jpg";
const scooterSrc = "C:/Users/LENOVO/.gemini/antigravity/brain/6682ad3f-5b9f-4dfc-ab8c-da77fbfc9c4f/.user_uploaded/media_1795457467017_28d8e515.jpg";

fs.copyFileSync(carSrc, "public/photos/car-fleet.jpg");
fs.copyFileSync(scooterSrc, "public/photos/scooter-fleet.jpg");

console.log("Successfully copied car-fleet.jpg:", fs.statSync("public/photos/car-fleet.jpg").size, "bytes");
console.log("Successfully copied scooter-fleet.jpg:", fs.statSync("public/photos/scooter-fleet.jpg").size, "bytes");
