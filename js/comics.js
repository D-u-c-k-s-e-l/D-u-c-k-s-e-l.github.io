const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const currentID = urlParams.get('comic');

// Stupidity

if (!String.prototype.replaceAt) {
  String.prototype.replaceAt = function(index, replacement) {
    if (index < 0 || index >= this.length) {
      return this.toString(); // Return original string if index is out of bounds
    }
    return this.substring(0, index) + replacement + this.substring(index + 1);
  };
}


// ============================== FILE HANDLING ============================= //

function NumStringToFilename(String) {
	// Put rules here for how to convert the number into a filename

	if (isNaN(parseInt(String, 0x06))) {
		console.error("Invalid numeric string.\nFilenames are in seximal (base-six) and must be treated that way.")
	}

	while (String.length < 0b00000110) {
		String = '0' + String
	}``
	return `/comics/${String}.bmp`
	// This returns 'comics/SSSSSS.bmp' with SSSSSS representing a number in seximal.
	// jan Misali is amazing.
}

function NumIntToFilename(Int) {
	// Put rules here for how to convert the number into a filename

	Int = Int.toString(0x06)
	return NumStringToFilename(Int)
}

function SetComicID(comicId) {
	// we do a little type checking
	let filename
	if (comicId === comicId.toString()) {
		filename = NumStringToFilename(comicId)
	} else if (comicId === parseInt(comicId)) {
		filename = NumIntToFilename(comicId)
	} else {
		console.error("SetComicID only accepts strings and integers.")
	}

	// Here's where it actually gets set
	$(".comic").prop("src", filename)

	// Some browsers don't refresh elements very well
	$(".comicContainer").hide().show(0)
}

async function getLastComicID() {
	const url = "/comics/latest.txt"
	const response = await fetch(url)
	const text = await response.text()
	return parseInt(text, 6)
}

async function getFirstComicID() {
	const url = "/comics/first.txt"
	const response = await fetch(url)
	const text = await response.text()
	return parseInt(text, 6)
}

async function getCurrentComicID() {
	if (currentID) {
		// when there's a comic id
		return currentID
	}
	// (or) get the last id
	let id = await getLastComicID()
	return id
}

// ============================= BUTTON HANDLING============================= //

function getZoom() {
	// zoom is stored in the --z css variable
	return parseFloat($(".comicContainer").css("--z"))
}

function setZoom(zoom) {
	// zoom is stored in the --z css variable
	$(".comicContainer").css("--z", zoom)

	// comicHolder is the parent of comic and is resized to
	// make comic take up space on the page when zoomed into.
	const comicElement = document.querySelector('.comic')
	const comicWrapper = document.querySelector('.comicHolder')
	comicWrapper.style.width = `${comicElement.getBoundingClientRect().width}px`
	comicWrapper.style.height = `${comicElement.getBoundingClientRect().height}px`
	localStorage.setItem("comicZoomLevel", getZoom())
	$(".comicContainer").hide().show(0)
}

function buttonPlus() {
	let zoom = getZoom()
	if (zoom >= 1) {
		// Increase zoom by one
		setZoom(zoom + 1)
		return
	}
	// Decrease the denominator of the zoom by one
	// Usually the numerator is one, if not we will divide by zero.
	setZoom(1 / ((1 / zoom) - 1))
}
$(".comicButtonPlus").on("click", buttonPlus)
$(document).on("keydown", function(e) {
	if (e.key === "+" || e.key === "=") {
		buttonPlus();
	}
});

function buttonMinus() {
	// Opposite of the .comicButtonPlus (swaps [+] and [-])
	let zoom = getZoom()
	if (zoom >= 1) {
		setZoom(zoom - 1)
		return
	}
	setZoom(1 / ((1 / zoom) + 1))
}
$(".comicButtonMinus").on("click", buttonMinus)

function buttonFirst() {
	getFirstComicID().then((id) => {
		id = id.toString(0x06)
		window.location.href = `/comics?comic=${id}`
	})
}
$(".comicButtonFirst").on("click", buttonFirst)


function buttonLast() {
	getLastComicID().then((id) => {
		id = id.toString(0x06)
		window.location.href = `/comics?comic=${id}`
	})
}
$(".comicButtonLast").on("click", buttonLast)

function buttonNext() {
	getCurrentComicID().then((id) => {
		id = parseInt(id, 0x06)
		id += 1
		id = id.toString(0x06)
		getLastComicID().then((last) => {
			if (id > last) {return}
			window.location.href = `/comics?comic=${id}`
		})
	})
}
$(".comicButtonNext").on("click", buttonNext)

function buttonPrevious() {
	getCurrentComicID().then((id) => {
		id = parseInt(id, 0x06)
		id -= 1
		if (id < 1) {return}
		id = id.toString(0x06)
		window.location.href = `/comics?comic=${id}`
	})
}
$(".comicButtonPrevious").on("click", buttonPrevious)

async function buttonRandom() {
	let first = await getFirstComicID()
	let last = await getLastComicID()
	let id = Math.floor(
		Math.random() * (last - first + 1)
	) + first
	window.location.href = `/comics?comic=${id.toString(0x06)}`
}
$(".comicButtonRandom").on("click", buttonRandom)


// ================================ ON LOAD  ================================ //

$( document ).ready(() => {
	// Random --> RanDOm
	for (let i = 0; i < $(".comicButtonRandom").text().length; i++) {
		if (Math.random() < 0.5) {
			$(".comicButtonRandom").text($(".comicButtonRandom").text().replaceAt(i, $(".comicButtonRandom").text()[i].toUpperCase()))
		} else {
			$(".comicButtonRandom").text($(".comicButtonRandom").text().replaceAt(i, $(".comicButtonRandom").text()[i].toLowerCase()))
		}
	}

	// Set Comic ID
	if (currentID) {
		let comicId = parseInt(currentID, 0x06).toString(0x06)
		SetComicID(comicId)
	} else {
		getLastComicID().then((id) => {SetComicID(id)})
	}
})
