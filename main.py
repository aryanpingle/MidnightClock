# import pyautogui as gui

# gui.screenshot(region=(0, 72, 810, 810)).save("images/favicon.png", "PNG")

from PIL import Image

img = Image.open("images/favicon.png").convert("RGBA")
data = img.getdata()

def process(rgba):
    if (sum(rgba[:3]) // 3) < 50:
        rgba = (0, 0, 0, 0)
    return rgba

newdata = list(map(process, data))
img.putdata(newdata)
# print(img.getpixel((0,0)))
img.save("images/favicon.png", "PNG")