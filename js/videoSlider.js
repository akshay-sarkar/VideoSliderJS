var VideoSlider = function () {
    this._sliderInterval = null;
    this._animFlag = true;
    this._videoIndex = [];
    this._isVideoPlaying = false;
    this._currentItem = 1;
    this._countAnimationEnd = 0;
    this.carousel = document.getElementById('carousel');
    this.carouselItems = this.carousel.children.length;
    this.carouselChilds = [].slice.call(this.carousel.children);
    this.videoSlider = document.getElementById('videoSlider');
    this.height = this.videoSlider.getClientRects()[0].height;
    this.width =  this.videoSlider.getClientRects()[0].width;
};
/* intialize VideoSlider with User Defined Object or continue with default */
VideoSlider.prototype.init = function (obj) {
    if (obj) {
        
        obj.interval ? (this.interval = obj.interval) : (this.interval = 3000);
        obj.autoPlaySlide ? ( this.autoPlaySlide = obj.autoPlaySlide) : ( this.autoPlaySlide = true );
        obj.animateTime ? ( this.animateTime = obj.animateTime ) : ( this.animateTime = 1000);
        obj.autoPlayMediaContent ? (this.autoPlayMediaContent = obj.autoPlayMediaContent) : (this.autoPlayMediaContent = true);
        obj.moveItemsLeft ? (this.moveItemsLeft = obj.moveItemsLeft) : (this.moveItemsLeft = true);
        if (obj.carousel) {
            this.carousel = document.getElementById(obj.carousel);
            this.carouselItems = this.carousel.children.length;
            this.carouselChilds = [].slice.call(this.carousel.children);
        }
        if (obj.videoSlider) {
            this.videoSlider = document.getElementById(obj.videoSlider);
            this.height = this.videoSlider.getClientRects()[0].height;
            this.width =  this.videoSlider.getClientRects()[0].width;
        }
    }
    this.checkVideoIndex();
    this.getParentSize();
};
VideoSlider.prototype.checkVideoIndex = function () {
    var ele, i, p;
    for (i = 0; i < this.carouselItems; i++) {
        ele = this.carouselChilds[i];
        p = ele.children.item(0);
        if (p.tagName === 'VIDEO') {
            // pushing in indexes in array
            this._videoIndex.push((i + 1));
            // Register Video End Event
            p.addEventListener('ended', this.endVideoTrigger());
            p.addEventListener('play', this.playVideoTrigger());
            p.addEventListener('pause', this.pauseVideoTrigger());
        }
    }
};
VideoSlider.prototype.getParentSize = function () {
    var height = this.videoSlider.getClientRects()[0].height;
    var width = this.videoSlider.getClientRects()[0].width;
    var i;
    // Inner Element Width Settings
    this.carousel.style.width = (this.carouselItems * width) + 'px';
    this.carousel.style.height = height + 'px';
    this.carousel.style.left = (-width) + 'px';
    // All Inner Elements 
    var child;
    for (i = this.carouselItems - 1; i >= 0; i--) {
        child = this.carousel.children[i];
        child.style.width = width + 'px';
        child.style.height = height + 'px';
    }
    //move last child at front
    this.moveLastChildFront();
};
VideoSlider.prototype.moveLastChildFront = function () {
    var child = this.carouselChilds[this.carouselItems - 1];
    // Array change
    this.carouselChilds.unshift(child);
    this.carouselChilds.pop();
    // dom change
    child = this.carousel.removeChild(child);
    this.carousel.insertBefore(child, this.carousel.childNodes[0]);
    this.startSlider();
};
/* Clear VideoSlider Interval */
VideoSlider.prototype.clearSliderInterval = function () {
    clearInterval(this._sliderInterval);
};
/* Restart VideoSlider with paramter to stat immediately : moveRequire */
VideoSlider.prototype.setSliderInterval = function (moveRequire) {
    var that = this;
    
    this._sliderInterval = setInterval(function () {
        that.slider(that.moveItemsLeft);
    }, this.interval);

    /* On Resume , Move the VideoSlider to Next */
    if (moveRequire) {
        if (this.moveItemsLeft) {
            this.moveNext();
        } else {
            this.movePrev();
        }
    }
};
/* Video Events */
VideoSlider.prototype.endVideoTrigger = function () {
    var that = this;
    return function (e) {
        e.currentTarget.currentTime = 0.0;
        that._isVideoPlaying = false;
        if (that.autoPlaySlide) {
            //that.setSliderInterval(true);
            that.clearSliderInterval();
            that.slider(that.moveItemsLeft);
        }
    };
};
VideoSlider.prototype.pauseVideoTrigger = function () {
    var that = this;
    return function () {
        that._isVideoPlaying = false;
    };
};
VideoSlider.prototype.playVideoTrigger = function () {
    var that = this;
    return function () {
        that._isVideoPlaying = true;
        that.playVideo();
    };
};
/* Pause/Resume Event in Video */
VideoSlider.prototype.pausePlay = function () {
    if (this.autoPlaySlide) {
        this.autoPlaySlide = false;
        this.clearSliderInterval();
    } else {
        this.autoPlaySlide = true;
        this.setSliderInterval(true);
    }
};
VideoSlider.prototype.animationEnd = function(e) {

    /* Working perfectly for slide Left Case*/
    var that = this;
    if (that.moveItemsLeft) {

        if (e.classList.length === 2) {
            ++that._countAnimationEnd;
            // array change
            var ele = that.carouselChilds.shift(); // removed 1st element
            that.carouselChilds.push(ele); // pushing it in last in array
            //dom change
            that.carousel.appendChild(ele); // appending in dom at end

            e.classList.remove('animateSlideIn');
        } else {
            ++that._countAnimationEnd;
            e.classList.remove('animateSlideIn');
        }
    } else {
        if (e.classList.length === 2) {
            ++that._countAnimationEnd;
            // array change
            var ele = that.carouselChilds.pop(); // removed last element
            that.carouselChilds.unshift(ele); // pushing it in front of array
            //dom change
            that.carousel.insertBefore(ele, carousel.childNodes[0]);

            e.classList.remove('animateSlideInRight');
        } else {
            ++that._countAnimationEnd;
            e.classList.remove('animateSlideInRight');
        }
    }

    /* Both Elements Animation Ended*/
    if (that._countAnimationEnd >= 2) {
        that._countAnimationEnd = 0;
        this._animFlag = true;
        // Checking for Video To Play by matching with the CurrentIndex
        if ((that._videoIndex.indexOf(that._currentItem) >= 0) && that.autoPlayMediaContent) {
            that.playVideo();
        }
    }
};

/* Move Next */
VideoSlider.prototype.moveNext = function () {

    this.clearSliderInterval();
    var visibleIndex = 2, currentIndex = 1,  that = this;
    that.moveItemsLeft = true;

    // Moving the first child
    var child = this.carouselChilds[currentIndex];
    child.classList.add('animateSlideIn');
    child.classList.remove('active');
    
    setTimeout(function () {
        that.animationEnd(child);
    }, that.animateTime);
    
    // Bringing up the the next child
    var child_v = this.carouselChilds[visibleIndex];
    child_v.classList.add('animateSlideIn');
    child_v.classList.add('active');
    
    if (this.carouselItems > that._currentItem) {
        ++that._currentItem;
    } else {
        that._currentItem = 1;
    }
    setTimeout(function () {
        that.animationEnd(child_v);
    }, that.animateTime);

    if (this.autoPlaySlide) {
        this.setSliderInterval();
    }
};
VideoSlider.prototype.movePrev = function () {
    this.clearSliderInterval();

    var visibleIndex = 0, currentIndex = 1, that = this;
    that.moveItemsLeft = false;
    // Moving the first child
    var child = this.carouselChilds[currentIndex];
    child.classList.add('animateSlideInRight');
    child.classList.remove('active');

    setTimeout(function () {
        that.animationEnd(child);
    }, that.animateTime);

    var child_v = this.carouselChilds[visibleIndex];
    child_v.classList.add('animateSlideInRight');
    child_v.classList.add('active');

    // Setting Current Index
    if (that._currentItem > 1) {
        --that._currentItem;
    } else {
        that._currentItem = this.carouselItems;
    }
    setTimeout(function () {
        that.animationEnd(child_v);
    }, that.animateTime);

    if (this.autoPlaySlide) {
        this.setSliderInterval();
    }

    
};
VideoSlider.prototype.playVideo = function () {
    // removing interval as video need to play
    this.clearSliderInterval();
    try {
        var p = this.carouselChilds[1],
            v = p.children[0];
        v.play();
    } catch (e) {
        console.log(e);
    }
};
VideoSlider.prototype.resetHeightWidth = function () {
    this.height = this.videoSlider.getClientRects()[0].height;
    this.width =  this.videoSlider.getClientRects()[0].width;
};
VideoSlider.prototype.startSlider = function () {
    var that = this;
    if (that._videoIndex.indexOf(that._currentItem) !== -1 && that.autoPlayMediaContent) {
        that.playVideo();
    } else {
        this._sliderInterval = setInterval(function () {
            if (that.autoPlaySlide) {
                that.slider(that.moveItemsLeft);
            }
        }, this.interval);
    }
};
VideoSlider.prototype.slider = function (move) {
    if (move) {
        if (this._animFlag) {
            this._animFlag = false;
            this.moveNext();
        }
    } else {
        if (this._animFlag) {
            this._animFlag = false;
            this.movePrev();
        }
    }
};