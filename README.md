
# VideoSliderJS
Plugin to play video/audio and images in a slider with configuration 

## TO ADD IMAGES and VIDEOS IN SLIDER
For adding images and videos in slider, create an LI element and then place your IMG or VIDEO tag inside it and, put it inside UL element ('carousel'). Check Code for more information

```sh
// TO CONFIGURE VideoSlider
var VideoSlider = new VideoSlider();
s.init({
    interval: 4000,               // Set VideoSlider Interval 4000 - 4 sec.
    autoPlayMediaContent: true,   // true will make media content(audio/video) runs automatically on coming in front, FALSE will not play video.
    moveItemsLeft:true,           // true will move VideoSlider towards left, FALSE will move VideoSlider towards right.
    animateTime : 1000,           // Set the Animation tranisition speed (set in css as well)
    autoPlaySlide: true           // false will make VideoSlider only on button click
});
```
###Note:
Yet to audio compatability.

#Snapshots:
#Image
<img src="https://image.ibb.co/eB0AFF/Image_Slider.png" alt="Image_Slider" border="0">
#Video
<img src="https://image.ibb.co/mn0uaF/Video_Play.png" alt="Video_Play" border="0">

#Sliding Transition
<img src="https://image.ibb.co/n3J82v/Sliding.png" alt="Sliding" border="0">
