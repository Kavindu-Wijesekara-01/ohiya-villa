import os
from PIL import Image
from rembg import remove, new_session

print("Initializing rembg session...")
session = new_session("u2net")

os.makedirs("public/photos/fleet", exist_ok=True)

# Process car
car_path = "public/photos/wa-20.52.41.jpeg"
print(f"Processing car image: {car_path}...")
with Image.open(car_path) as img:
    car_nobg = remove(img, session=session)
    car_nobg.save("public/photos/fleet/car-nobg.png")
    print("Saved car-nobg.png, size:", car_nobg.size)

# Process scooters
scooter_path = "public/photos/wa-20.56.12.jpeg"
print(f"Processing scooter image: {scooter_path}...")
with Image.open(scooter_path) as img:
    scooter_nobg = remove(img, session=session)
    scooter_nobg.save("public/photos/fleet/scooter-nobg.png")
    print("Saved scooter-nobg.png, size:", scooter_nobg.size)

print("Done removing backgrounds!")
