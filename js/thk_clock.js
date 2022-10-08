function setAngle(id, angle) {
    var element = document.getElementById(id);
    element.setAttribute('transform',`rotate(${180 + angle}, 100, 100)`);
}

function setClock() {
    var date = new Date;
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    
    setAngle('handH', 30*hours + 0.5*minutes)
    setAngle('handM', 6*minutes)
    setAngle('handS', 6*seconds)
}

function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
}

CountDownTimer.prototype.start = function() {
    if (this.running) {
	return;
    }
    this.running = true;
    var start = Date.now(),
	that = this,
	diff, obj;
    
    (function timer() {
	diff = that.duration - (((Date.now() - start) / 1000) | 0);
	
	if (diff > 0) {
	    setTimeout(timer, that.granularity);
	} else {
	    diff = 0;
	    that.running = false;
	}
	
	obj = CountDownTimer.parse(diff);
	that.tickFtns.forEach(function(ftn) {
	    ftn.call(this, obj.minutes, obj.seconds);
	}, that);
    }());
};

CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
	this.tickFtns.push(ftn);
    }
    return this;
};

CountDownTimer.prototype.expired = function() {
    return !this.running;
};

CountDownTimer.parse = function(seconds) {
    return {
	'minutes': (seconds / 60) | 0,
	'seconds': (seconds % 60) | 0
    };
};

window.onload = function() {
    var display = document.querySelector('#time'),
	timer = new CountDownTimer(0);
    
    function restart() {
	if (this.expired()) {
	    setTimeout(function() { timer.start(); }, 1000);
	}
    }
    
    function format(minutes, seconds) {
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	display.textContent = minutes + ':' + seconds;
    }
};
