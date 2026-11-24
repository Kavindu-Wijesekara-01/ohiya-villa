import fs from "fs";

const foodSrc = "C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\6682ad3f-5b9f-4dfc-ab8c-da77fbfc9c4f\\sri_lankan_food_1795458379474.jpg";
const bathSrc = "C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\6682ad3f-5b9f-4dfc-ab8c-da77fbfc9c4f\\highland_hot_water_shower_1795458407326.jpg";

fs.copyFileSync(foodSrc, "public/photos/sri-lankan-food.jpg");
fs.copyFileSync(bathSrc, "public/photos/highland-hot-water.jpg");

console.log("Copied sri-lankan-food.jpg:", fs.statSync("public/photos/sri-lankan-food.jpg").size, "bytes");
console.log("Copied highland-hot-water.jpg:", fs.statSync("public/photos/highland-hot-water.jpg").size, "bytes");
