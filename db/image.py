from PIL import Image
import os

def resizeAllPhotoInDir(pathDir, newDir):
    i = 1
    for imageName in os.listdir(pathDir):
        try:
            file = Image.open(pathDir+imageName)
            file = file.resize((int(file.size[0]*0.75), int(file.size[1]*0.75)))
            file.save(newDir+f"{i}.jpg",optimize=True, quality=50)
        except:
            continue
        i += 1

resizeAllPhotoInDir("../../Downloads/activitee/","../../Downloads/lqActivitee/")
resizeAllPhotoInDir("../../Downloads/portraitHomme/","../../Downloads/lqPortraitHomme/")
resizeAllPhotoInDir("../../Downloads/portraitFemme/","../../Downloads/lqPortraitFemme/")




